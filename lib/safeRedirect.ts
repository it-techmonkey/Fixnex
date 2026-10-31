/** Only allow redirects to pages on this site (blocks e.g. ?redirect=https://evil.com or //evil.com). */
export function safeRedirect(value: string | null | undefined, fallback = "/"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
