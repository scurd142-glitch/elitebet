import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bets",
  description: "Your betting history on EliteBet",
};

export default function MyBetsPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-xl font-bold">My Bets</h1>
      <p className="text-[#888888]">No bets placed yet.</p>
    </div>
  );
}
