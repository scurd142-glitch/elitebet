import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/components/landing/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${COMPANY.brand}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-heading text-4xl font-bold tracking-tight heading-gradient">Terms &amp; Conditions</h1>
      <p className="mt-6 text-sm text-[var(--muted-foreground)] font-body">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      <div className="mt-10 space-y-6 text-[var(--muted-foreground)] leading-relaxed font-body">
        <p>
          These Terms govern access to {COMPANY.brand}, operated by {COMPANY.legalName} ({COMPANY.country}). By
          creating an account or using the service, you agree to follow these Terms and all applicable laws.
        </p>
        <p>
          <strong className="text-[#FFD700]">Accounts &amp; activation.</strong> Certain features require
          payment of activation or subscription fees. Fees, taxes, and refund eligibility are described at checkout and
          in our Refund Policy.
        </p>
        <p>
          <strong className="text-[#FFD700]">Acceptable use.</strong> You may not misuse the platform,
          interfere with other users, attempt unauthorized access, or use the service to distribute malware or unlawful
          content.
        </p>
        <p>
          <strong className="text-[#FFD700]">Disclaimers.</strong> The service is provided &ldquo;as
          is&rdquo; to the maximum extent permitted by law. Marketplace outcomes depend on third-party behavior; we do
          not guarantee earnings or job availability.
        </p>
        <p>
          <strong className="text-[#FFD700]">Contact.</strong> Legal notices may be directed through the
          contact channels published on the website.
        </p>
        <p className="text-xs">
          This is a starter legal page for development. Replace with counsel-reviewed terms before production.
        </p>
      </div>
      <p className="mt-10">
        <Link href="/" className="font-medium text-[#FFD700] hover:underline">
          ← Home
        </Link>
      </p>
    </div>
  );
}
