import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/components/landing/constants";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${COMPANY.brand} and ${COMPANY.legalName}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-heading text-4xl font-bold tracking-tight heading-gradient">About {COMPANY.brand}</h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--muted-foreground)] font-body">
        {COMPANY.brand} is a web-based writing marketplace where professionals discover vetted opportunities, manage
        submissions, and grow earnings with wallets, referrals, and gamified ranks.
      </p>
      <p className="mt-4 leading-relaxed text-[var(--muted-foreground)] font-body">
        The platform is owned and operated by <strong className="text-[#FFD700]">{COMPANY.legalName}</strong>,{" "}
        {COMPANY.country}. Our roadmap includes native mobile apps, richer analytics, and expanded payout rails — all
        on a security-first architecture.
      </p>
      <p className="mt-8">
        <Link href="/" className="font-medium text-[#FFD700] hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
