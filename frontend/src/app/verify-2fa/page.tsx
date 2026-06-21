"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/api-config";

export default function Verify2FAPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const value = params.get("email") ?? "";
    setEmail(value);
    if (!value) {
      setMessage("Missing email address. Please log in again.");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(apiUrl("/api/auth/verify-2fa"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!data?.success) {
        setMessage(data?.error || "Verification failed");
        setLoading(false);
        return;
      }

      window.localStorage.setItem("elitebet_token", data.token);
      router.push("/dashboard");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setMessage("Unable to verify code. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-4 py-16 bg-[#0A0A0A] text-[#F5F5F5]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(124,58,237,0.2),transparent)]" />
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card)]/90 p-8 shadow-2xl shadow-violet-500/10 backdrop-blur" style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.1)", borderColor: "rgba(255,215,0,0.2)" }}>
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold">Verify sign in</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Enter the code sent to {email || "your email"}.</p>
        </div>

        <Input type="text" placeholder="Enter code" value={code} onChange={(e) => setCode(e.target.value)} required />
        <Button type="submit" className="mt-4 w-full" disabled={loading}>
          {loading ? "Verifying…" : "Verify code"}
        </Button>

        {message ? <p className="mt-4 text-center text-sm text-[#FFD700]">{message}</p> : null}

        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          <Link href="/login" className="text-[#FFD700] hover:underline">Return to login</Link>
        </p>
      </form>
    </div>
  );
}
