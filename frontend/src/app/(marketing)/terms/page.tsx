import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${SITE.name}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[#ffffff]">Terms &amp; Conditions</h1>
      <p className="mt-4 text-sm text-[#888888]">
        Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
      </p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#888888]">
        <p>
          These Terms govern access to {SITE.name}. By creating an account or using the service, you agree to follow these Terms.
        </p>
        <p>
          <strong className="text-[#ffffff]">Simulation betting.</strong> Display balances are for entertainment only and have no real cash-out value. Withdrawals are not available.
        </p>
        <p>
          <strong className="text-[#ffffff]">Deposits.</strong> Deposits are processed via Paystack/M-Pesa. Real funds belong to the platform operator.
        </p>
        <p>
          <strong className="text-[#ffffff]">Age requirement.</strong> You must be 18+ to use EliteBet.
        </p>
      </div>
      <p className="mt-8">
        <Link href="/" className="text-[#f5c518] hover:underline">← Home</Link>
      </p>
    </div>
  );
}
