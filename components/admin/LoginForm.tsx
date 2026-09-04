"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/apiClient";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminLogin(password);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <h1 className="text-xl font-semibold text-neutral-100">Admin login</h1>
      <input
        type="password"
        autoFocus
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-neutral-100 text-neutral-900 px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
