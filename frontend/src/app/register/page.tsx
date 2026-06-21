"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EliteBetLogo } from "@/components/ui/elitebet-logo";
import { apiUrl } from "@/lib/api-config";

const inputClass =
  "w-full rounded-lg border border-[#333333] bg-[#222222] px-4 py-3 text-sm text-[#ffffff] focus:border-[#00a651] focus:outline-none focus:ring-1 focus:ring-[#00a651]";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("Kenya");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const regRes = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          country,
          phone,
          referralCode: referralCode || undefined,
          promoCode: promoCode || undefined,
        }),
      });

      const contentType = regRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setMessage("Server returned invalid response. The backend may be starting up.");
        setLoading(false);
        return;
      }

      const regData = await regRes.json();
      if (!regData?.success) {
        setMessage(regData?.message || regData?.error?.message || "Registration failed");
        setLoading(false);
        return;
      }

      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        setMessage("Server is starting up, please wait 30 seconds and try again");
      } else {
        setMessage(error.message || "Registration error");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111111] px-4 py-12">
      <div className="mb-8">
        <EliteBetLogo size={64} showText />
      </div>
      <div className="w-full max-w-md rounded-xl border border-[#333333] bg-[#1a1a1a] p-8">
        <h1 className="mb-2 text-2xl font-semibold text-[#ffffff]">Create your account</h1>
        <p className="mb-8 text-sm text-[#888888]">Join EliteBet and start betting today.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Full Name
            </label>
            <input id="fullName" type="text" className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Email
            </label>
            <input id="email" type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Password
            </label>
            <input id="password" type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
          </div>
          <div>
            <label htmlFor="country" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Country
            </label>
            <select id="country" className={inputClass} value={country} onChange={(e) => setCountry(e.target.value)} required>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Phone
            </label>
            <input id="phone" type="tel" className={inputClass} placeholder="2547XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="referralCode" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Referral Code (optional)
            </label>
            <input id="referralCode" type="text" className={inputClass} value={referralCode} onChange={(e) => setReferralCode(e.target.value)} />
          </div>
          <div>
            <label htmlFor="promoCode" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#888888]">
              Have a promo code? (Optional)
            </label>
            <input id="promoCode" type="text" className={inputClass} value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-[#00a651] py-3 text-sm font-semibold text-[#ffffff] transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-[#e63946]">{message}</p>}

        <p className="mt-6 text-center text-sm text-[#888888]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#f5c518] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
