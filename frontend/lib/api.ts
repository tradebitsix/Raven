import { getToken, clearToken } from "./auth";

const rawBase = process.env.NEXT_PUBLIC_API_URL;

if (!rawBase) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

// normalize:
// - trim trailing slashes
// - if someone accidentally put /api at the end, remove it (your client already prefixes /api/*)
const base = rawBase
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

type Json = any;

async function request<T = Json>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> | undefined),
  };

  // Only set JSON content-type if caller didn't provide it AND body isn't FormData
  const body = (opts as any).body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (!headers["Content-Type"] && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${base}${path}`, { ...opts, headers });

  // auth fails -> clear cookie so middleware + client stay in sync
  if (res.status === 401) {
    clearToken();
  }

  if (!res.ok) {
    // best-effort error message
    let msg = res.statusText || `Request failed (${res.status})`;
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j: any = await res.json();
        msg = j?.detail || j?.message || JSON.stringify(j);
      } else {
        const t = await res.text();
        if (t) msg = t;
      }
    } catch {}
    throw new Error(msg);
  }

  // handle empty response (204 etc)
  if (res.status === 204) return undefined as unknown as T;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    request<{ id: number; email: string; name: string; role: string }>("/api/auth/me"),

  jobs: {
    list: () => request<any[]>("/api/jobs"),
    create: (data: any) =>
      request<any>("/api/jobs", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      request<any>(`/api/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: number) => request<any>(`/api/jobs/${id}`, { method: "DELETE" }),
  },

  projects: {
    list: () => request<any[]>("/api/projects"),
    create: (data: any) =>
      request<any>("/api/projects", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      request<any>(`/api/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: number) => request<any>(`/api/projects/${id}`, { method: "DELETE" }),
  },

  users: {
    list: () => request<any[]>("/api/users"),
    create: (data: any) =>
      request<any>("/api/users", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      request<any>(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: number) => request<any>(`/api/users/${id}`, { method: "DELETE" }),
  },
};