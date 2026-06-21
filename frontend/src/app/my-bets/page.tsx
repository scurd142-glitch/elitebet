"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import type { MyBetItem } from "@/types/user";

export default function MyBetsPage() {
  const { user } = useAuth();
  const [bets, setBets] = useState<MyBetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "settled">("all");

  useEffect(() => {
    if (!user) return;
    api.getMyBets().then((res) => {
      if (res.success && res.data) setBets(res.data.bets);
      setLoading(false);
    });
  }, [user]);

  const filteredBets = bets.filter((bet) => {
    if (filter === "all") return true;
    if (filter === "active") return bet.status === "pending";
    return bet.status !== "pending";
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "text-[#00a651] bg-[#00a651]/10";
      case "lost":
        return "text-[#e63946] bg-[#e63946]/10";
      case "pending":
        return "text-[#f5c518] bg-[#f5c518]/10";
      default:
        return "text-[#888888] bg-[#888888]/10";
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <h1 className="text-2xl font-bold text-[#f5c518]">My Bets</h1>

        <div className="flex gap-2 border-b border-[#333333]">
          {(["all", "active", "settled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-2 text-sm font-medium capitalize transition-colors ${
                filter === tab ? "border-b-2 border-[#00a651] text-[#ffffff]" : "text-[#888888]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-[#888888]">Loading bets…</p>
        ) : (
          <div className="space-y-3">
            {filteredBets.length === 0 ? (
              <p className="text-center text-[#888888]">No bets found</p>
            ) : (
              filteredBets.map((bet) => (
                <div key={bet.id} className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-[#888888]">
                      {new Date(bet.createdAt).toLocaleString()}
                      {bet.gameType ? ` · ${bet.gameType}` : ""}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusColor(bet.status)}`}>
                      {bet.status}
                    </span>
                  </div>
                  <div className="mb-3 space-y-2">
                    {bet.selections.map((selection, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="text-[#ffffff]">{selection.match}</p>
                        <p className="text-[#888888]">
                          {selection.selection}
                          {selection.odds > 0 ? ` @ ${selection.odds.toFixed(2)}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#333333] pt-3 text-sm">
                    <div>
                      <p className="text-[#888888]">Stake</p>
                      <p className="font-semibold text-[#ffffff]">KES {bet.stake.toFixed(2)}</p>
                    </div>
                    {bet.totalOdds > 0 && (
                      <div className="text-center">
                        <p className="text-[#888888]">Odds</p>
                        <p className="font-semibold text-[#f5c518]">{bet.totalOdds.toFixed(2)}x</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-[#888888]">{bet.status === "won" ? "Won" : "Return"}</p>
                      <p className={`font-semibold ${bet.status === "won" ? "text-[#00a651]" : "text-[#ffffff]"}`}>
                        KES {(bet.status === "won" ? bet.actualWin : bet.potentialWin).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
