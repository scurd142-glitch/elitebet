import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

const FAQ_ITEMS = [
  {
    q: "How do I deposit on EliteBet?",
    a: "Tap Deposit or visit Wallet. Enter an amount (minimum KES 50) and pay via M-Pesa through Paystack. Your balance updates after confirmation.",
  },
  {
    q: "Can I withdraw my balance?",
    a: "No. Withdrawals are not available. Deposits fund simulation betting only — they have no real cash-out value.",
  },
  {
    q: "Is EliteBet real money gambling?",
    a: "EliteBet is a simulation platform. Deposits go to the platform via Paystack; your displayed balance is used for entertainment betting only.",
  },
];

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${SITE.name}.`,
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[#ffffff]">FAQ</h1>
      <p className="mt-2 text-[#888888]">Common questions about deposits, betting, and your account.</p>
      <dl className="mt-8 space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="card-surface p-4">
            <dt className="font-semibold text-[#00a651]">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[#888888]">{item.a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8">
        <Link href="/" className="text-[#f5c518] hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
