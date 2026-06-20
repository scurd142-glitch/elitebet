import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home",
  description: "EliteBet — bet on sports, play crash games, and enjoy casino entertainment.",
};

export default function HomePage() {
  return (
    <div className="px-4 py-6">
      <section className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-[#ffffff]">Welcome to EliteBet</h1>
        <p className="text-[#888888]">
          Kenya&apos;s ultimate simulation betting experience. Home page layout coming in the next step.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/games/aviator" className="card-surface p-4 transition hover:border-[#00a651]">
          <h3 className="mb-1 text-[#ffffff]">Aviator</h3>
          <p className="text-sm text-[#888888]">Crash game — play now</p>
        </Link>
        <Link href="/sports" className="card-surface p-4 transition hover:border-[#00a651]">
          <h3 className="mb-1 text-[#ffffff]">Sports</h3>
          <p className="text-sm text-[#888888]">Bet on football, basketball & more</p>
        </Link>
        <Link href="/casino" className="card-surface p-4 transition hover:border-[#00a651]">
          <h3 className="mb-1 text-[#ffffff]">Casino</h3>
          <p className="text-sm text-[#888888]">Slots, roulette & blackjack</p>
        </Link>
        <Link href="/wallet" className="card-surface p-4 transition hover:border-[#00a651]">
          <h3 className="mb-1 text-[#ffffff]">Deposit</h3>
          <p className="text-sm text-[#888888]">Load your balance via M-Pesa</p>
        </Link>
      </div>
    </div>
  );
}
