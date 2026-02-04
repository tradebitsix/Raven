export const tokenKey = "raven_token";

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${tokenKey}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function setToken(token: string) {
  // Secure cookie (works on Vercel HTTPS). SameSite=Lax is fine for this use.
  document.cookie = `${tokenKey}=${encodeURIComponent(token)}; Path=/; SameSite=Lax; Secure`;
}

export function clearToken() {
  document.cookie = `${tokenKey}=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
}