"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plane, Gamepad2, Dice1, Sparkles, Gift, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Crash");
  const [winTicker, setWinTicker] = useState<string>("");

  const categories = [
    { name: "Crash", count: 65 },
    { name: "Virtuals", count: 38 },
    { name: "Slots", count: 582 },
    { name: "Live Casino", count: 26 },
  ];

  const games = [
    { name: "Aviator", isNew: true, gradient: "from-orange-500 to-red-600", href: "/games/aviator" },
    { name: "JetX", isNew: true, gradient: "from-purple-500 to-pink-600", href: "/games/jetx" },
    { name: "Bazooka", isNew: true, gradient: "from-blue-500 to-cyan-600", href: "/games/bazooka" },
    { name: "Aviatrix", isNew: false, gradient: "from-green-500 to-teal-600", href: "/games/aviatrix" },
    { name: "Blackjack", isNew: false, gradient: "from-gray-700 to-gray-900", href: "/casino" },
    { name: "Roulette", isNew: false, gradient: "from-red-600 to-red-800", href: "/casino" },
    { name: "Virtual Football", isNew: false, gradient: "from-emerald-500 to-green-700", href: "/sports" },
  ];

  const deals = [
    { icon: "⚽", title: "25% Cashback", subtitle: "Sportsbook" },
    { icon: "💥", title: "10% Cashback", subtitle: "Crash games" },
    { icon: "💰", title: "Tax Free", subtitle: "All deposits" },
  ];

  const bigWins = Array.from({ length: 8 }, (_, i) => ({
    phone: `07X${Math.random().toString(36).substring(2, 5).toUpperCase()}XXX`,
    amount: Math.floor(Math.random() * 50000) + 5000,
    game: games[Math.floor(Math.random() * games.length)].name,
    gradient: games[Math.floor(Math.random() * games.length)].gradient,
  }));

  const quickAccess = [
    { name: "Aviator", icon: Plane, color: "bg-orange-500" },
    { name: "Featured", icon: Sparkles, color: "bg-[#222222]" },
    { name: "vFootball", icon: Gamepad2, color: "bg-[#222222]" },
    { name: "Ligi Kuu", icon: Gamepad2, color: "bg-[#222222]" },
    { name: "Soccer", icon: Gamepad2, color: "bg-[#222222]" },
    { name: "50+", icon: Dice1, color: "bg-[#222222]" },
  ];

  // Simulated win ticker
  useEffect(() => {
    const updateTicker = () => {
      const randomGame = games[Math.floor(Math.random() * games.length)].name;
      const randomAmount = Math.floor(Math.random() * 20000) + 1000;
      const randomPhone = `07X${Math.random().toString(36).substring(2, 5).toUpperCase()}XXX`;
      setWinTicker(`💰 Just now! ${randomPhone} got KES ${randomAmount.toLocaleString()} on ${randomGame}`);
    };
    updateTicker();
    const interval = setInterval(updateTicker, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-24">
      {/* Game Category Tabs */}
      <section className="border-b border-[#333333] bg-[#111111]">
        <div className="flex gap-6 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors ${
                activeCategory === cat.name
                  ? "text-[#ffffff] border-b-2 border-[#00a651]"
                  : "text-[#888888]"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </section>

      {/* Game Icon Grid */}
      <section className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {games.map((game) => (
            <Link
              key={game.name}
              href={game.href}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className={`relative h-[120px] w-[120px] rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
                {game.isNew && (
                  <span className="absolute -top-2 -right-2 bg-[#e63946] px-2 py-0.5 text-[10px] font-bold text-[#ffffff] rounded-full">
                    NEW
                  </span>
                )}
                <Gamepad2 className="h-10 w-10 text-white/80" />
              </div>
              <span className="text-xs text-[#ffffff]">{game.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DEALS Section */}
      <section className="px-4 py-4">
        <h2 className="mb-3 text-lg font-bold text-[#ffffff]">DEALS</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {deals.map((deal, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[200px] rounded-xl border-2 border-[#00a651] bg-[#1a1a1a] p-4"
            >
              <span className="text-2xl">{deal.icon}</span>
              <h3 className="mt-2 text-sm font-bold text-[#ffffff]">{deal.title}</h3>
              <p className="text-xs text-[#888888]">{deal.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Wins Ticker */}
      <section className="overflow-hidden bg-[#00a651] py-2">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-sm font-medium text-[#ffffff]">{winTicker}</span>
        </div>
      </section>

      {/* Recent Big Wins */}
      <section className="px-4 py-4">
        <h2 className="mb-3 text-lg font-bold text-[#ffffff]">Recent Big Wins</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {bigWins.map((win, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[160px] rounded-xl bg-[#1a1a1a] p-3 border border-[#333333]"
            >
              <div className={`h-16 w-full rounded-lg bg-gradient-to-br ${win.gradient} mb-2`} />
              <p className="text-xs text-[#888888]">{win.phone}</p>
              <p className="text-sm font-bold text-[#f5c518]">KES {win.amount.toLocaleString()}</p>
              <p className="text-xs text-[#888888]">{win.game}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Circles */}
      <section className="px-4 py-4">
        <h2 className="mb-3 text-lg font-bold text-[#ffffff]">Quick Access</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickAccess.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className={`h-16 w-16 rounded-full ${item.color} flex items-center justify-center`}>
                <item.icon className="h-7 w-7 text-[#ffffff]" />
              </div>
              <span className="text-xs text-[#ffffff]">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offer Card */}
      <section className="px-4 py-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#00a651] to-[#008c45] p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-[#ffffff]/20 px-3 py-1 text-xs font-bold text-[#ffffff] mb-2">
                SPECIAL OFFER
              </span>
              <h3 className="text-xl font-bold text-[#ffffff] mb-1">Get 100% Boost Bonus</h3>
              <Link
                href="/promotions"
                className="inline-flex items-center gap-2 rounded-full bg-[#ffffff] px-4 py-2 text-sm font-bold text-[#00a651] hover:bg-[#f5f5f5] transition-colors"
              >
                Claim Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="ml-4">
              <Gift className="h-16 w-16 text-[#ffffff]/80" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
