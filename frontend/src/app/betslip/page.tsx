import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betslip",
  description: "Your betslip on EliteBet",
};

export default function BetslipPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-xl font-bold">Betslip</h1>
      <p className="text-[#888888]">No selections yet. Browse sports to add bets.</p>
    </div>
  );
}
