"use client";

import { useState } from "react";
import Link from "next/link";
import { Football, Clock, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";

const MATCHES = [
  {
    id: "1",
    league: "Ligi Kuu",
    homeTeam: "Gor Mahia",
    awayTeam: "AFC Leopards",
    homeOdds: 2.5,
    drawOdds: 3.2,
    awayOdds: 2.8,
    startTime: "2024-06-21T15:00:00",
    status: "upcoming",
  },
  {
    id: "2",
    league: "Ligi Kuu",
    homeTeam: "Tusker FC",
    awayTeam: "KCB",
    homeOdds: 1.8,
    drawOdds: 3.5,
    awayOdds: 4.2,
    startTime: "2024-06-21T18:00:00",
    status: "upcoming",
  },
  {
    id: "3",
    league: "English Premier League",
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    homeOdds: 2.1,
    drawOdds: 3.4,
    awayOdds: 3.3,
    startTime: "2024-06-22T17:00:00",
    status: "upcoming",
  },
  {
    id: "4",
    league: "La Liga",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    homeOdds: 2.3,
    drawOdds: 3.2,
    awayOdds: 3.1,
    startTime: "2024-06-22T20:00:00",
    status: "upcoming",
  },
  {
    id: "5",
    league: "Serie A",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    homeOdds: 2.0,
    drawOdds: 3.3,
    awayOdds: 3.7,
    startTime: "2024-06-23T19:00:00",
    status: "upcoming",
  },
];

export default function SportsPage() {
  const { user } = useAuth();
  const [selectedBets, setSelectedBets] = useState<any[]>([]);

  const handleSelectBet = (matchId: string, selection: string, odds: number) => {
    const match = MATCHES.find((m) => m.id === matchId);
    if (!match) return;

    const existingIndex = selectedBets.findIndex((b) => b.matchId === matchId);
    if (existingIndex >= 0) {
      const updated = [...selectedBets];
      updated[existingIndex] = { matchId, selection, odds, match };
      setSelectedBets(updated);
    } else {
      setSelectedBets([...selectedBets, { matchId, selection, odds, match }]);
    }
  };

  const handleRemoveBet = (matchId: string) => {
    setSelectedBets(selectedBets.filter((b) => b.matchId !== matchId));
  };

  const calculatePotentialWin = () => {
    if (selectedBets.length === 0) return 0;
    const totalOdds = selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
    return totalOdds * 100; // Assuming 100 KES stake
  };

  return (
    <div className="min-h-screen bg-[#111111] pb-24">
      <div className="mx-auto max-w-4xl space-y-4 p-4">
        <h1 className="text-2xl font-bold text-[#f5c518]">Sports Betting</h1>

        {/* Match List */}
        <div className="space-y-3">
          {MATCHES.map((match) => (
            <div key={match.id} className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#00a651]">{match.league}</span>
                <div className="flex items-center gap-1 text-xs text-[#888888]">
                  <Clock className="h-3 w-3" />
                  {new Date(match.startTime).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#ffffff]">{match.homeTeam}</p>
                </div>
                <div className="px-4 text-sm font-bold text-[#888888]">VS</div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold text-[#ffffff]">{match.awayTeam}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSelectBet(match.id, "home", match.homeOdds)}
                  className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                    selectedBets.find((b) => b.matchId === match.id && b.selection === "home")
                      ? "bg-[#00a651] text-[#ffffff]"
                      : "bg-[#222222] text-[#ffffff] hover:bg-[#333333]"
                  }`}
                >
                  1
                  <div className="text-xs text-[#888888]">{match.homeOdds.toFixed(2)}</div>
                </button>
                <button
                  onClick={() => handleSelectBet(match.id, "draw", match.drawOdds)}
                  className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                    selectedBets.find((b) => b.matchId === match.id && b.selection === "draw")
                      ? "bg-[#00a651] text-[#ffffff]"
                      : "bg-[#222222] text-[#ffffff] hover:bg-[#333333]"
                  }`}
                >
                  X
                  <div className="text-xs text-[#888888]">{match.drawOdds.toFixed(2)}</div>
                </button>
                <button
                  onClick={() => handleSelectBet(match.id, "away", match.awayOdds)}
                  className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                    selectedBets.find((b) => b.matchId === match.id && b.selection === "away")
                      ? "bg-[#00a651] text-[#ffffff]"
                      : "bg-[#222222] text-[#ffffff] hover:bg-[#333333]"
                  }`}
                >
                  2
                  <div className="text-xs text-[#888888]">{match.awayOdds.toFixed(2)}</div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Betslip */}
        {selectedBets.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 border-t border-[#333333] bg-[#1a1a1a] p-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#ffffff]">Betslip ({selectedBets.length})</h3>
                <button
                  onClick={() => setSelectedBets([])}
                  className="text-xs text-[#e63946]"
                >
                  Clear All
                </button>
              </div>

              <div className="mb-3 space-y-2">
                {selectedBets.map((bet) => (
                  <div
                    key={bet.matchId}
                    className="flex items-center justify-between rounded-lg bg-[#222222] p-2"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#ffffff]">
                        {bet.match.homeTeam} vs {bet.match.awayTeam}
                      </p>
                      <p className="text-xs text-[#888888]">
                        {bet.selection.toUpperCase()} @ {bet.odds.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveBet(bet.matchId)}
                      className="text-[#e63946]"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-[#888888]">Total Odds:</span>
                <span className="font-bold text-[#f5c518]">
                  {selectedBets.reduce((acc, bet) => acc * bet.odds, 1).toFixed(2)}
                </span>
              </div>

              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-[#888888]">Potential Win (100 KES):</span>
                <span className="font-bold text-[#00a651]">
                  KES {calculatePotentialWin().toFixed(2)}
                </span>
              </div>

              <button
                className="w-full rounded-lg bg-[#00a651] py-3 font-semibold text-[#ffffff] hover:bg-[#008c45] transition-colors"
              >
                Place Bet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
