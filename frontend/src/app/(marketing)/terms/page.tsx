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
      <p className="mt-4 text-sm text-[#6b7280]">
        Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
      </p>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-[#888888]">
        <p>
          These Terms govern access to {SITE.name}. By creating an account or using the service, you agree to follow these Terms.
        </p>
        <p>
          <strong className="text-[#ffffff]">Betting.</strong> All bets are final once placed. Please review your selections carefully before confirming.
        </p>
        <p>
          <strong className="text-[#ffffff]">Deposits.</strong> Deposits are processed via Paystack/M-Pesa. Deposits are usually processed instantly.
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
