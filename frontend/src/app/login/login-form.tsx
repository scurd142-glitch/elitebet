"use client";

import Link from "next/link";
import { useState } from "react";
import { COMPANY } from "@/components/landing/constants";
import { useAuth } from "@/components/providers/auth-provider";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const errorMessage = await login(email, password);
    if (errorMessage) {
      setMessage(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]" style={{ background: "#234A37", border: "1px solid #3A5F4A" }}>
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="text-2xl font-bold tracking-tight" style={{ color: "#F0EAD6" }}>
          WritersNite
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold mb-2" style={{ color: "#F0EAD6" }}>
        Sign in to your account
      </h1>
      <p className="text-sm mb-8" style={{ color: "#A8BFAE" }}>
        Welcome back. Please enter your details.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8BFAE" }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-3 text-sm border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all"
            style={{
              background: "#1B3A2B",
              borderColor: "#3A5F4A",
              color: "#F0EAD6"
            }}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8BFAE" }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-3 text-sm border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all"
            style={{
              background: "#1B3A2B",
              borderColor: "#3A5F4A",
              color: "#F0EAD6"
            }}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 border-gray-300 rounded focus:ring-green-500" style={{ accentColor: "#C9A227" }} />
            <span className="ml-2 text-sm" style={{ color: "#A8BFAE" }}>Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "#C9A227", color: "#1B3A2B" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-center" style={{ color: "#EF4444" }}>{message}</p>}

      <p className="mt-6 text-center text-sm" style={{ color: "#A8BFAE" }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold hover:underline" style={{ color: "#C9A227" }}>
          Sign up
        </Link>
      </p>

      <p className="mt-4 text-center text-xs" style={{ color: "#A8BFAE" }}>
        <Link href="/" className="hover:underline">← Back to home</Link>
      </p>
    </div>
  );
}
