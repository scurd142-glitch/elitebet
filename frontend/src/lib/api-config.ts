/**
 * API base URL for client-side fetch calls.
 *
 * Priority:
 * 1. NEXT_PUBLIC_API_URL — direct calls to backend (must be set at Vercel build time)
 * 2. Production without that var — same-origin "/api/..." (proxied by next.config rewrites)
 * 3. Local dev — http://localhost:4000
 */
export function getApiBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "";
  }

  return "http://localhost:4000";
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
