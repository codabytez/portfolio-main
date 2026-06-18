"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const isSubdomain = window.location.hostname.startsWith("admin.");
      router.push(isSubdomain ? "/profile" : "/admin/profile");
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full items-center justify-center bg-[#0f172b]">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-lg font-medium text-[#f8fafc]">admin panel</p>
          <p className="text-sm text-[#90a1b9]">portfolio cms</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#90a1b9]">password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="rounded border border-[#314158] bg-[#020618] px-3 py-2 text-sm text-[#f8fafc] outline-none placeholder:text-[#4a5568] focus:border-[#ff9d00]"
            />
          </div>

          {error && <p className="text-xs text-[#ff637e]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="rounded bg-[#ff9d00] px-4 py-2 text-sm font-medium text-[#020618] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
