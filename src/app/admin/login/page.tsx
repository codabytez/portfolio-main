"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
    <div className="bg-theme-theme-backdrop flex h-full items-center justify-center p-3">
      <div className="border-theme-theme-stroke bg-theme-theme-background w-full max-w-sm overflow-hidden rounded-xl border">
        <div className="border-theme-theme-stroke border-b px-8 py-5">
          <p className="text-body-md text-theme-heading-foreground">_admin</p>
        </div>

        <div className="px-8 py-8">
          <p className="text-theme-foreground mb-8 text-sm">
            sign in to continue to your portfolio cms.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              state={error ? "error" : "static"}
              errorMessage={error}
            />

            <Button type="submit" variant="primary" disabled={loading || !password}>
              {loading ? "signing in..." : "sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
