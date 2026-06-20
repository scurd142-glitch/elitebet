import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search matches, games and leagues on EliteBet",
};

export default function SearchPage() {
  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">Search</h1>
      <input
        type="search"
        placeholder="Search matches, games, leagues..."
        className="input-field"
      />
      <p className="mt-4 text-sm text-[#888888]">Start typing to search.</p>
    </div>
  );
}
