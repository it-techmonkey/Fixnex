import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Blocks cross-site form posts. Browsers always send Origin on cross-origin POSTs;
 * requests without it (curl, server-to-server) cannot ride on a victim's cookies.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Base URL for links in emails. Production always uses the configured site URL. */
export function getAppBaseUrl(request: NextRequest): string {
  const configured = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  if (process.env.NODE_ENV === "production" && configured) return configured;
  return request.nextUrl.origin;
}
