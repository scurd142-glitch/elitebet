import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Your EliteBet account",
};

export default function AccountPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-xl font-bold">Account</h1>
      <p className="text-[#888888]">Account page coming soon.</p>
    </div>
  );
}
