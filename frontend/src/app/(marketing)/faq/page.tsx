import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";

const FAQ_ITEMS = [
  {
    q: "How do I deposit money into my EliteBet account?",
    a: "You can deposit money via M-Pesa. Go to the Wallet page, click on Deposit, enter the amount, and follow the M-Pesa payment instructions. Deposits are usually processed instantly.",
  },
  {
    q: "Is EliteBet a real betting platform?",
    a: "No, EliteBet is a simulation betting platform for entertainment purposes only. All balances are virtual and cannot be withdrawn. This is a play-to-learn platform.",
  },
  {
    q: "How does Aviator crash game work?",
    a: "Aviator is a crash game where a multiplier starts at 1.00x and increases. You can cash out at any time before the plane crashes. If you cash out before the crash, you win your stake multiplied by the current multiplier. If the plane crashes before you cash out, you lose your bet.",
  },
  {
    q: "How do I place a sports bet?",
    a: "Go to the Sports page, select the matches you want to bet on, choose your prediction (Home Win, Draw, or Away Win), and add them to your betslip. Enter your stake and place your bet.",
  },
  {
    q: "What are the minimum and maximum bet amounts?",
    a: "The minimum bet amount is KES 10. Maximum bet amounts vary by game and sport. Check each game for specific limits.",
  },
  {
    q: "How are odds calculated?",
    a: "Odds are calculated based on the probability of outcomes. Higher odds mean lower probability but higher potential winnings. Our odds are competitive with industry standards.",
  },
  {
    q: "Can I cancel a bet after placing it?",
    a: "No, once a bet is placed, it cannot be cancelled. Please review your selections carefully before confirming your bet.",
  },
  {
    q: "How do I view my bet history?",
    a: "Go to the My Bets page to view all your past and active bets. You can filter by status (All, Active, Settled) to find specific bets.",
  },
  {
    q: "Is my personal information secure?",
    a: "Yes, we use industry-standard encryption to protect your personal information. We do not share your data with third parties without your consent.",
  },
  {
    q: "What should I do if I have a problem?",
    a: "If you encounter any issues, please contact our support team through the Contact page or create a support ticket. We'll respond within 24 hours.",
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
