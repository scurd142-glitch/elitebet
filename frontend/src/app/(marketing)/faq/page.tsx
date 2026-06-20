import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ITEMS, COMPANY } from "@/components/landing/constants";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${COMPANY.brand}.`,
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-heading text-4xl font-bold tracking-tight heading-gradient">FAQ</h1>
      <p className="mt-4 text-[var(--muted-foreground)] font-body">Common questions about access, payouts, and ownership.</p>
      <dl className="mt-10 space-y-8">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q}>
            <dt className="font-semibold text-[#FFD700]">{item.q}</dt>
            <dd className="mt-2 leading-relaxed text-[var(--muted-foreground)] font-body">{item.a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-12">
        <Link href="/#faq" className="font-medium text-[#FFD700] hover:underline">
          View on homepage
        </Link>
        {" · "}
        <Link href="/" className="font-medium text-[#FFD700] hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
