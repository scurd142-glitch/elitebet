import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inplay",
  description: "Live in-play betting on EliteBet",
};

export default function InplayPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-xl font-bold">Inplay</h1>
      <p className="text-[#888888]">Live matches coming soon.</p>
    </div>
  );
}
