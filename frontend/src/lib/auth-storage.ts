const TOKEN_KEY = "writersnite_token";
const COOKIE_NAME = "writersnite_token";

const ONE_DAY = 60 * 60 * 24;
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export function setAuthToken(token: string, remember: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  const maxAge = remember ? SEVEN_DAYS : ONE_DAY;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
