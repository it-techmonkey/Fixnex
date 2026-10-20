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

/**
 * Base URL for links in emails (e.g. password reset).
 * Uses the address the request actually came in on, but only when it is one we trust
 * (the configured site, localhost, or a Vercel preview), so a forged Host header cannot
 * point a reset link at another site. Otherwise falls back to the configured site URL.
 */
export function getAppBaseUrl(request: NextRequest): string {
  const configured = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  const first = (value: string | null) => (value ?? "").split(",")[0].trim().toLowerCase();

  const host = first(request.headers.get("x-forwarded-host")) || first(request.headers.get("host"));
  const hostname = host.split(":")[0];
  const bare = (value: string) => value.replace(/^www\./, "");

  let configuredHost = "";
  try {
    configuredHost = configured ? new URL(configured).host.toLowerCase() : "";
  } catch {
    configuredHost = "";
  }

  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const trusted =
    !!host &&
    (isLocal ||
      hostname.endsWith(".vercel.app") ||
      (!!configuredHost && bare(host) === bare(configuredHost)));

  if (trusted) {
    const proto = first(request.headers.get("x-forwarded-proto")) || (isLocal ? "http" : "https");
    return `${proto}://${host}`;
  }
  return configured || request.nextUrl.origin;
}
