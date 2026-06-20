"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const identifier = String(form.get("identifier") ?? "");
    const password = String(form.get("password") ?? "");
    const remember = form.get("remember") === "on";

    const message = await login(identifier, password, remember);
    if (message) setError(message);
    setLoading(false);
  }

  return (
    <Card className="border-[#333333] bg-[#1a1a1a] text-[#ffffff]">
      <CardHeader>
        <CardTitle className="text-center text-[#ffffff]">Welcome back</CardTitle>
        <CardDescription className="text-center text-[#888888]">
          Sign in to your EliteBet account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && <p className="error-state">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-[#ffffff]">Email or username</Label>
            <Input
              id="login-email"
              name="identifier"
              autoComplete="username"
              required
              disabled={loading}
              className="border-[#333333] bg-[#222222] text-[#ffffff]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-[#ffffff]">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              className="border-[#333333] bg-[#222222] text-[#ffffff]"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#888888]">
            <input
              type="checkbox"
              name="remember"
              className="rounded border-[#333333] accent-[#00a651]"
              disabled={loading}
            />
            Remember me (7 days)
          </label>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-[#00a651] text-[#ffffff] hover:opacity-90" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-[#888888]">
            No account?{" "}
            <Link href="/register" className="text-[#f5c518] hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
