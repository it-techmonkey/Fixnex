import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

/**
 * Resolves the signed-in user for a request. Besides a valid token it requires that the
 * password has not changed since the token was issued, so a password change or reset
 * signs out every other device.
 */
export async function getVerifiedUser(request: NextRequest): Promise<SessionUser | null> {
  const session = getSessionFromRequest(request);
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, fullName: true, role: true, passwordChangedAt: true },
  });
  if (!user) return null;

  if (user.passwordChangedAt) {
    const issuedAt = session.iat ?? 0;
    if (issuedAt < Math.floor(user.passwordChangedAt.getTime() / 1000)) return null;
  }

  return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
}
