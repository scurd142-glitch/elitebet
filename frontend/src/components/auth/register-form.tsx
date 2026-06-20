"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
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

const COUNTRIES = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Nigeria",
  "Ghana",
  "South Africa",
  "Other",
];

function RegisterFormInner() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get("ref") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const referralCode =
      String(form.get("referralCode") ?? "").trim() || refFromUrl || undefined;
    const message = await register({
      fullName: String(form.get("fullName") ?? ""),
      username: String(form.get("username") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      country: String(form.get("country") ?? ""),
      password: String(form.get("password") ?? ""),
      referralCode,
    });

    if (message) setError(message);
    setLoading(false);
  }

  return (
    <Card className="glass border-primary/20">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Join WritersNite and start your writer journey.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                name="country"
                required
                disabled={loading}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {refFromUrl ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="referralCode">Referral code</Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  defaultValue={refFromUrl}
                  disabled={loading}
                />
              </div>
            ) : null}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="password">Password (min. 8 characters)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export function RegisterForm() {
  return (
    <Suspense fallback={<Card className="glass p-8 text-center text-muted-foreground">Loading…</Card>}>
      <RegisterFormInner />
    </Suspense>
  );
}
