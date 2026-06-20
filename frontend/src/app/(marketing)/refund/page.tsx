import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/components/landing/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund policy for ${COMPANY.brand}.`,
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-display text-4xl font-bold tracking-tight">Refund Policy</h1>
      <p className="mt-6 text-sm text-[var(--muted-foreground)]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      <div className="mt-10 space-y-6 text-[var(--muted-foreground)] leading-relaxed">
        <p>
          {COMPANY.brand}, operated by {COMPANY.legalName}, sets refund rules for platform fees (activation,
          subscriptions, upgrades) separately from peer-to-peer job payments, which follow dispute flows defined at job
          acceptance.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Activation fees.</strong> Generally non-refundable once the
          account is activated and marketplace access is granted, except where required by law or explicit promotional
          terms.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Subscriptions.</strong> Cancellations stop renewal; refunds for
          partial periods may be offered where mandated by law or at our discretion.
        </p>
        <p>
          <strong className="text-[var(--foreground)]">Chargebacks.</strong> Abuse of chargebacks may result in account
          suspension and collection of owed balances where permitted.
        </p>
        <p className="text-xs">
          This is a starter refund page for development. Replace with counsel-reviewed policy before production.
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
