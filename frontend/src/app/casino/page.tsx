import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casino",
  description: "Casino games on EliteBet",
};

export default function CasinoPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-xl font-bold">Casino</h1>
      <p className="text-[#888888]">Casino games coming soon.</p>
    </div>
  );
}
