"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Anchor, Lock } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect username or password.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-cream">
            <Anchor className="h-7 w-7" />
          </span>
          <h1 className="font-display text-2xl text-ink">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-warmgray">
            Please sign in to continue.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-[var(--radius-card)] border border-line bg-parchment p-6 shadow-xl"
        >
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-warmgray">
            <Lock className="h-3 w-3" /> Secured session · confidential data
          </p>
        </form>
      </div>
    </main>
  );
}
