"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
      const regRes = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, country, phone, referralCode }),
      });

      // Check if response is JSON (not HTML error page)
      const contentType = regRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setMessage("Server returned invalid response. The backend may be starting up.");
        setLoading(false);
        return;
      }

      const regData = await regRes.json();
      if (!regData?.success) {
        setMessage(regData?.message || regData?.error || "Registration failed");
        setLoading(false);
        return;
      }

      setMessage("Registration successful! Redirecting to activation...");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Registration error:", err);
      if (err.name === "TypeError" && err.message === "Failed to fetch") {
        setMessage("Server is starting up, please wait 30 seconds and try again");
      } else {
        setMessage((err as any).message || "Registration error");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: "#1B3A2B" }}>
      <div className="w-full max-w-md p-10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]" style={{ background: "#234A37", border: "1px solid #3A5F4A" }}>
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-2xl font-bold tracking-tight" style={{ color: "#F0EAD6" }}>
            WritersNite
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-2" style={{ color: "#F0EAD6" }}>
          Create your account
        </h1>
        <p className="text-sm mb-8" style={{ color: "#A8BFAE" }}>
          Start your writing journey today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8BFAE" }}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{
                background: "#1B3A2B",
                borderColor: "#3A5F4A",
                color: "#F0EAD6"
              }}
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8BFAE" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all"
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
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{
                background: "#1B3A2B",
                borderColor: "#3A5F4A",
                color: "#F0EAD6"
              }}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8BFAE" }}>
              Country
            </label>
            <select
              id="country"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all appearance-none"
              style={{
                background: "#1B3A2B",
                borderColor: "#3A5F4A",
                color: "#F0EAD6",
                fontSize: "0.875rem"
              }}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="">Select your country</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8BFAE" }}>
              Phone (optional)
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{
                background: "#1B3A2B",
                borderColor: "#3A5F4A",
                color: "#F0EAD6"
              }}
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="referralCode" className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8BFAE" }}>
              Referral Code (optional)
            </label>
            <input
              id="referralCode"
              type="text"
              className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{
                background: "#1B3A2B",
                borderColor: "#3A5F4A",
                color: "#F0EAD6"
              }}
              placeholder="Enter referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            style={{ background: "#C9A227", color: "#1B3A2B" }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-center" style={{ color: "#EF4444" }}>{message}</p>}

        <p className="mt-6 text-center text-sm" style={{ color: "#A8BFAE" }}>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#C9A227" }}>
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs" style={{ color: "#A8BFAE" }}>
          <Link href="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
