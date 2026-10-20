import { prisma } from "@/lib/prisma";

export type RateLimitStatus = { limited: boolean; retryAfterSeconds: number };

/** Whether `key` has already used up `limit` hits in its current window. */
export async function checkRateLimit(key: string, limit: number): Promise<RateLimitStatus> {
  const row = await prisma.rateLimit.findUnique({ where: { key } });
  const now = Date.now();
  if (!row || row.reset_at.getTime() <= now || row.count < limit) {
    return { limited: false, retryAfterSeconds: 0 };
  }
  return { limited: true, retryAfterSeconds: Math.ceil((row.reset_at.getTime() - now) / 1000) };
}

/** Counts one hit against `key`; the window starts at the first hit. */
export async function recordRateLimitHit(key: string, windowSeconds: number): Promise<void> {
  const row = await prisma.rateLimit.findUnique({ where: { key } });
  const now = Date.now();
  if (!row || row.reset_at.getTime() <= now) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, reset_at: new Date(now + windowSeconds * 1000) },
      update: { count: 1, reset_at: new Date(now + windowSeconds * 1000) },
    });
    return;
  }
  await prisma.rateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
}

export async function clearRateLimit(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}

export const formatRetryAfter = (seconds: number) => {
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
};
