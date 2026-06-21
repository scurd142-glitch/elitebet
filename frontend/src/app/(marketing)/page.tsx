"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, ArrowRight, Plane, Star, Trophy, Dice1 } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Crash");
  const [winTicker, setWinTicker] = useState<string>("");
  const [balance] = useState(0.00);

  const categories = [
    { name: "Crash", count: 65 },
    { name: "Virtuals", count: 38 },
    { name: "Slots", count: 582 },
    { name: "Live Casino", count: 26 },
  ];

  const games = [
    { id: 1, name: "Aviator", image: "/images/games/aviator.svg", isNew: false, bgColor: "#c0392b", href: "/games/aviator" },
    { id: 2, name: "Avionix", image: "/images/games/avionix.svg", isNew: false, bgColor: "#1a472a", href: "/games/aviator" },
    { id: 3, name: "Bazooka", image: "/images/games/bazooka.svg", isNew: true, bgColor: "#922b21", href: "/games/aviator" },
    { id: 4, name: "JetX", image: "/images/games/jetx.svg", isNew: false, bgColor: "#1a1a2e", href: "/games/aviator" },
    { id: 5, name: "Aviatrix", image: "/images/games/aviatrix.svg", isNew: false, bgColor: "#2c1654", href: "/games/aviator" },
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
    bgColor: games[Math.floor(Math.random() * games.length)].bgColor,
  }));

  const quickAccess = [
    { name: "Aviator", icon: Plane, color: "bg-[#ff2d55]", href: "/games/aviator" },
    { name: "Featured", icon: Star, color: "bg-[#a855f7]", href: "/games/aviator" },
    { name: "vFootball", icon: Trophy, color: "bg-[#00C853]", href: "/sports" },
    { name: "Ligi Kuu", icon: Trophy, color: "bg-[#f5a623]", href: "/sports" },
    { name: "Soccer", icon: Trophy, color: "bg-[#00C853]", href: "/sports", badge: "50+" },
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
    const interval = setInterval(updateTicker, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pb-24 pt-[56px]">
      {/* CATEGORY TABS */}
      <section className="h-[44px] border-b border-[#1e2530]">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`h-8 whitespace-nowrap rounded-full px-[14px] text-[13px] font-semibold transition-colors ${
                activeCategory === cat.name
                  ? "bg-[#ffffff] text-[#000000]"
                  : "bg-[#1e2530] text-[#9aa0a6]"
              }`}
            >
              {cat.name} {cat.count}
            </button>
          ))}
        </div>
      </section>

      {/* GAME ICONS ROW */}
      <section className="h-[120px] px-4 py-4">
        <div className="flex gap-[10px] overflow-x-auto scrollbar-hide">
          {games.map((game) => (
            <Link
              key={game.name}
              href={game.href}
              className="flex-shrink-0 flex flex-col items-center"
            >
              <div className="relative h-[90px] w-[90px] rounded-2xl overflow-hidden" style={{ backgroundColor: game.bgColor }}>
                {game.isNew && (
                  <span className="absolute top-[6px] right-[6px] bg-[#ff0000] px-[5px] py-[2px] text-[9px] font-bold text-[#ffffff] rounded-[4px] z-10">
                    NEW
                  </span>
                )}
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-white text-xs font-bold">${game.name}</span>`;
                  }}
                />
              </div>
              <span className="mt-1 text-[11px] text-[#ffffff] text-center">{game.name}</span>
            </Link>
          ))}
          {/* More button */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="h-[90px] w-[90px] rounded-2xl bg-[#1e2530] flex items-center justify-center">
              <span className="text-2xl text-[#6b7280]">...</span>
            </div>
          </div>
        </div>
      </section>

      {/* DEALS ROW */}
      <section className="h-[56px] px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[11px] font-semibold text-[#6b7280] mr-2">DEALS</span>
          {deals.map((deal, i) => (
            <div
              key={i}
              className="flex-shrink-0 h-[52px] w-[110px] rounded-xl bg-[#1e2530] p-[6px] px-[10px]"
            >
              <span className="text-[18px]">{deal.icon}</span>
              <h3 className="mt-1 text-[11px] font-semibold text-[#ffffff] truncate">{deal.title}</h3>
              <p className="text-[10px] text-[#6b7280]">{deal.subtitle}</p>
            </div>
          ))}
          <Link href="/promotions" className="ml-auto text-[12px] font-bold text-[#00C853]">
            VIEW →
          </Link>
        </div>
      </section>

      {/* LIVE WIN TICKER */}
      <section className="h-[44px] flex items-center bg-[#00C853] px-4">
        <span className="mr-2">💰</span>
        <span className="flex-1 text-[13px] font-semibold text-[#ffffff]">{winTicker}</span>
        <span className="ml-2">👉</span>
      </section>

      {/* RECENT BIG WINS */}
      <section className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-[#00C853]" />
          <h2 className="text-[16px] font-bold text-[#ffffff]">Recent Big Wins</h2>
        </div>
        <div className="flex gap-[10px] overflow-x-auto pb-2 scrollbar-hide">
          {bigWins.map((win, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[130px] h-[170px] rounded-xl bg-[#1e2530] overflow-hidden"
            >
              <div className={`h-[100px] w-full bg-gradient-to-br ${win.gradient}`} />
              <p className="px-2 mt-1 text-[11px] text-[#9aa0a6]">{win.phone}</p>
              <p className="px-2 text-[13px] font-bold text-[#00C853]">KES {win.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK ACCESS ICONS ROW */}
      <section className="h-[90px] px-4 py-2">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {quickAccess.map((item, i) => (
            <Link
              key={i}
              href={item.href || "#"}
              className="flex-shrink-0 flex flex-col items-center"
            >
              <div className="relative h-[56px] w-[56px] rounded-full bg-[#1e2530] flex items-center justify-center">
                <item.icon className="h-7 w-7 text-[#ffffff]" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-[#f5a623] px-1.5 py-0.5 text-[8px] font-bold text-[#ffffff] rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-1 text-[11px] text-[#ffffff] text-center">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SPECIAL OFFER BANNER */}
      <section className="mx-4 my-4 rounded-2xl bg-[#1e2530] p-4 relative">
        <span className="text-[10px] font-bold text-[#00C853] tracking-widest uppercase">
          SPECIAL OFFER
        </span>
        <h3 className="mt-1 text-[20px] font-extrabold text-[#ffffff] max-w-[60%]">
          Get 100% Boost Bonus
        </h3>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Gift className="h-16 w-16 text-[#00C853]" />
        </div>
        <Link
          href="/promotions"
          className="inline-flex items-center gap-2 mt-3 h-10 rounded-full bg-[#00C853] px-5 text-[14px] font-bold text-[#ffffff]"
        >
          Claim Now <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
