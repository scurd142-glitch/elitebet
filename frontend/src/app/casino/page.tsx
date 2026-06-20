"use client";

import Link from "next/link";
import { Dice1, Sparkles, Gamepad2, Gift } from "lucide-react";

const GAMES = [
  {
    id: "1",
    name: "Lucky Slots",
    icon: Dice1,
    color: "bg-gradient-to-br from-purple-600 to-pink-600",
    category: "Slots",
    hot: true,
  },
  {
    id: "2",
    name: "Blackjack Pro",
    icon: Gamepad2,
    color: "bg-gradient-to-br from-green-600 to-teal-600",
    category: "Card Games",
    hot: false,
  },
  {
    id: "3",
    name: "Royal Roulette",
    icon: Sparkles,
    color: "bg-gradient-to-br from-red-600 to-orange-600",
    category: "Table Games",
    hot: true,
  },
  {
    id: "4",
    name: "Dice Roll",
    icon: Dice1,
    color: "bg-gradient-to-br from-blue-600 to-indigo-600",
    category: "Dice Games",
    hot: false,
  },
  {
    id: "5",
    name: "Mega Jackpot",
    icon: Gift,
    color: "bg-gradient-to-br from-yellow-600 to-amber-600",
    category: "Slots",
    hot: true,
  },
  {
    id: "6",
    name: "Poker Night",
    icon: Gamepad2,
    color: "bg-gradient-to-br from-cyan-600 to-blue-600",
    category: "Card Games",
    hot: false,
  },
];

export default function CasinoPage() {
  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <h1 className="text-2xl font-bold text-[#f5c518]">Casino Games</h1>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["All", "Slots", "Card Games", "Table Games", "Dice Games"].map((cat) => (
            <button
              key={cat}
              className="flex-shrink-0 rounded-full bg-[#222222] px-4 py-2 text-sm text-[#ffffff] hover:bg-[#333333] transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              href="#"
              className="group relative overflow-hidden rounded-xl border border-[#333333] bg-[#1a1a1a] transition-all hover:border-[#00a651]"
            >
              <div className={`aspect-square ${game.color} p-4`}>
                <game.icon className="h-12 w-12 text-[#ffffff]" />
              </div>
              <div className="p-3">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#ffffff]">{game.name}</h3>
                  {game.hot && (
                    <span className="rounded-full bg-[#e63946] px-2 py-0.5 text-xs font-bold text-[#ffffff]">
                      HOT
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#888888]">{game.category}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-6 text-center">
          <h3 className="mb-2 text-lg font-bold text-[#f5c518]">More Games Coming Soon</h3>
          <p className="text-sm text-[#888888]">
            We're adding new casino games regularly. Stay tuned for more exciting games!
          </p>
        </div>
      </div>
    </div>
  );
}
