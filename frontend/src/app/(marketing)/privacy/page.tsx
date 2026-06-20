import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/components/landing/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${COMPANY.brand}.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-6 text-sm text-[var(--muted-foreground)]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      <div className="mt-10 space-y-6 text-[var(--muted-foreground)] leading-relaxed">
        <p>
          {COMPANY.legalName} ({COMPANY.country}) operates {COMPANY.brand}. This policy describes how we collect, use,
          and protect personal information.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Data we collect.</strong> Account details (name, email, phone
          where provided), usage logs, device and security signals, payment metadata from processors, and communications
          you send us.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">How we use data.</strong> To provide and secure the service,
          process payments, prevent fraud, comply with law, and improve product experience.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Sharing.</strong> We share data with infrastructure and payment
          providers as needed to operate the platform, under contractual safeguards.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Your choices.</strong> Where applicable, you may access, correct,
          or delete certain information through account settings or by contacting support.
        </p>
        <p className="text-xs">
          This is a starter privacy page for development. Replace with counsel-reviewed policy and jurisdiction-specific
          disclosures before production.
        </p>
      </div>
      <p className="mt-10">
        <Link href="/" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
          ← Home
        </Link>
      </p>
    </div>
  );
}
