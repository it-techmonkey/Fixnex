import { createHash, randomBytes } from "crypto";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validatePassword } from "@/lib/passwordPolicy";
import {
  checkRateLimit,
  clearRateLimit,
  formatRetryAfter,
  recordRateLimitHit,
} from "@/lib/rateLimit";
import { AuthError } from "./auth.service";

export const RESET_TOKEN_TTL_MINUTES = 30;
const HOUR = 60 * 60;
const FIFTEEN_MINUTES = 15 * 60;

const normalize = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export class PasswordService {
  /** Change the password of a signed-in user. Requires the current password. */
  async changePassword(
    userId: string,
    input: { currentPassword?: unknown; newPassword?: unknown; confirmPassword?: unknown }
  ) {
    const currentPassword = normalize(input.currentPassword);
    const newPassword = normalize(input.newPassword);
    const confirmPassword = normalize(input.confirmPassword);

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new AuthError("Please fill in all password fields.", 400);
    }

    const limitKey = `change-password:${userId}`;
    const limit = await checkRateLimit(limitKey, 5);
    if (limit.limited) {
      throw new AuthError(
        `Too many incorrect attempts. Try again in ${formatRetryAfter(limit.retryAfterSeconds)}.`,
        429
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });
    if (!user) throw new AuthError("Not authenticated.", 401);
    if (!user.passwordHash) {
      throw new AuthError("This account signs in with Google and has no password to change.", 400);
    }

    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      await recordRateLimitHit(limitKey, FIFTEEN_MINUTES);
      throw new AuthError("Current password is incorrect.", 400);
    }

    const policyError = validatePassword(newPassword);
    if (policyError) throw new AuthError(policyError, 400);
    if (newPassword !== confirmPassword) {
      throw new AuthError("New password and confirmation do not match.", 400);
    }
    if (await verifyPassword(newPassword, user.passwordHash)) {
      throw new AuthError("New password must be different from your current password.", 400);
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, passwordChangedAt: new Date() },
      }),
      prisma.passwordResetToken.deleteMany({ where: { user_id: user.id } }),
    ]);
    await clearRateLimit(limitKey);
  }

  /**
   * Starts a password reset. Never reveals whether the email belongs to an account:
   * it returns null (send nothing) for unknown emails, Google-only accounts and
   * throttled requests, so callers can give the same response every time.
   */
  async createResetToken(
    emailInput: unknown,
    ip: string
  ): Promise<{ email: string; fullName: string; token: string } | null> {
    const email = normalize(emailInput).toLowerCase();
    if (!email || !email.includes("@")) return null;

    const ipKey = `forgot-ip:${ip}`;
    const emailKey = `forgot-email:${email}`;
    const [ipLimit, emailLimit] = await Promise.all([
      checkRateLimit(ipKey, 10),
      checkRateLimit(emailKey, 3),
    ]);
    if (ipLimit.limited || emailLimit.limited) return null;
    await Promise.all([recordRateLimitHit(ipKey, HOUR), recordRateLimitHit(emailKey, HOUR)]);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, fullName: true, passwordHash: true },
    });
    if (!user || !user.passwordHash) return null;

    const token = randomBytes(32).toString("hex");
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { user_id: user.id } }),
      prisma.passwordResetToken.create({
        data: {
          user_id: user.id,
          token_hash: hashToken(token),
          expires_at: new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000),
        },
      }),
    ]);

    return { email: user.email, fullName: user.fullName, token };
  }

  /** Completes a reset with the emailed token and signs every device out. */
  async resetPassword(
    input: { token?: unknown; newPassword?: unknown; confirmPassword?: unknown },
    ip: string
  ) {
    const token = normalize(input.token);
    const newPassword = normalize(input.newPassword);
    const confirmPassword = normalize(input.confirmPassword);

    const ipKey = `reset-ip:${ip}`;
    const limit = await checkRateLimit(ipKey, 10);
    if (limit.limited) {
      throw new AuthError(
        `Too many attempts. Try again in ${formatRetryAfter(limit.retryAfterSeconds)}.`,
        429
      );
    }

    // Check the password first so a typo does not use up the one-time link.
    const policyError = validatePassword(newPassword);
    if (policyError) throw new AuthError(policyError, 400);
    if (newPassword !== confirmPassword) {
      throw new AuthError("New password and confirmation do not match.", 400);
    }

    const invalid = () =>
      new AuthError("This reset link is invalid or has expired. Please request a new one.", 400);
    if (!token) throw invalid();

    const row = await prisma.passwordResetToken.findUnique({
      where: { token_hash: hashToken(token) },
    });
    if (!row || row.used_at || row.expires_at.getTime() <= Date.now()) {
      await recordRateLimitHit(ipKey, HOUR);
      throw invalid();
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.$transaction(async (tx) => {
      // Claim the token atomically so a link can never be used twice.
      const claimed = await tx.passwordResetToken.updateMany({
        where: { id: row.id, used_at: null },
        data: { used_at: new Date() },
      });
      if (claimed.count === 0) throw invalid();

      await tx.user.update({
        where: { id: row.user_id },
        data: { passwordHash, passwordChangedAt: new Date() },
      });
      await tx.passwordResetToken.deleteMany({
        where: { user_id: row.user_id, id: { not: row.id } },
      });
    });
  }
}
