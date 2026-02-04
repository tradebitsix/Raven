"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (loading) return;

    setErr(null);
    setLoading(true);

    try {
      const r = await api.login(email.trim(), password);

      // cookie-based token
      setToken(r.access_token);

      // go to dashboard
      router.replace("/dashboard");
    } catch (ex: any) {
      setErr(ex?.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] grid place-items-center">
      <div className="w-full max-w-md glass card-strong p-6 md:p-7">
        <div className="text-xs text-dim font-semibold">Raven Roofing</div>
        <h1 className="text-2xl font-extrabold tracking-tight mt-1">Admin Login</h1>

        <form className="space-y-3 mt-6" onSubmit={onSubmit}>
        <input
          className="w-full rounded-xl glass card px-3 py-2.5 outline-none placeholder:text-dim"
          placeholder="Email"
          value={email}
          autoComplete="email"
          inputMode="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-xl glass card px-3 py-2.5 outline-none placeholder:text-dim"
          placeholder="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <div className="text-red-300 text-sm">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        </form>
      </div>
    </div>
  );
}