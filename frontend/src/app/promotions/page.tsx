"use client";

import { Gift, Percent, Star, Zap } from "lucide-react";

const PROMOTIONS = [
  {
    id: "1",
    title: "100% Welcome Bonus",
    description: "Get a 100% bonus on your first deposit up to KES 10,000!",
    icon: Gift,
    color: "from-green-600 to-teal-600",
    type: "Welcome",
    validUntil: "2024-12-31",
  },
  {
    id: "2",
    title: "Weekly Cashback",
    description: "Get 10% cashback on your weekly losses. Min cashback KES 100.",
    icon: Percent,
    color: "from-purple-600 to-pink-600",
    type: "Cashback",
    validUntil: "Ongoing",
  },
  {
    id: "3",
    title: "Aviator Booster",
    description: "Double your winnings on Aviator every Friday between 6PM-9PM!",
    icon: Zap,
    color: "from-orange-600 to-red-600",
    type: "Special",
    validUntil: "Every Friday",
  },
  {
    id: "4",
    title: "VIP Loyalty Program",
    description: "Earn points for every bet and redeem for exclusive rewards.",
    icon: Star,
    color: "from-yellow-600 to-amber-600",
    type: "VIP",
    validUntil: "Ongoing",
  },
  {
    id: "5",
    title: "Refer a Friend",
    description: "Earn KES 500 for every friend you refer who makes a deposit.",
    icon: Gift,
    color: "from-blue-600 to-indigo-600",
    type: "Referral",
    validUntil: "Ongoing",
  },
];

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <h1 className="text-2xl font-bold text-[#f5c518]">Promotions & Bonuses</h1>

        {/* Featured Promotion */}
        <div className="rounded-2xl bg-gradient-to-r from-[#00a651] to-[#008c45] p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-full bg-[#ffffff]/20 p-3">
              <Gift className="h-8 w-8 text-[#ffffff]" />
            </div>
            <div className="flex-1">
              <span className="inline-block rounded-full bg-[#ffffff]/20 px-3 py-1 text-xs font-bold text-[#ffffff] mb-2">
                FEATURED
              </span>
              <h3 className="text-xl font-bold text-[#ffffff] mb-2">
                100% Welcome Bonus
              </h3>
              <p className="text-sm text-[#ffffff]/80 mb-4">
                New players get 100% bonus on first deposit up to KES 10,000. Start with double the fun!
              </p>
              <button className="rounded-full bg-[#ffffff] px-6 py-2 text-sm font-bold text-[#00a651] hover:bg-[#f5f5f5] transition-colors">
                Claim Now
              </button>
            </div>
          </div>
        </div>

        {/* All Promotions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-[#ffffff]">All Promotions</h2>
          {PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 rounded-full bg-gradient-to-br ${promo.color} p-3`}>
                  <promo.icon className="h-6 w-6 text-[#ffffff]" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-[#222222] px-2 py-0.5 text-xs font-semibold text-[#888888]">
                      {promo.type}
                    </span>
                    <span className="text-xs text-[#888888]">Valid until: {promo.validUntil}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#ffffff] mb-1">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-[#888888]">{promo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Terms */}
        <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[#ffffff]">Terms & Conditions</h3>
          <ul className="space-y-1 text-xs text-[#888888]">
            <li>• Bonuses are subject to wagering requirements</li>
            <li>• One bonus per person/household/IP address</li>
            <li>• EliteBet reserves the right to modify or cancel promotions</li>
            <li>• Please read full terms for each promotion before claiming</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
