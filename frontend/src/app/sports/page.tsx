"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Wallet, Search, X } from "lucide-react";
import { getOdds, type Match } from "@/lib/odds-api";
import { useAuth } from "@/components/providers/auth-provider";

export default function SportsPage() {
  const { user, balance } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBets, setSelectedBets] = useState<any[]>([]);
  const [stake, setStake] = useState(100);

  useEffect(() => {
    async function loadOdds() {
      try {
        const data = await getOdds("soccer_epl");
        setMatches(data);
      } catch (error) {
        console.error("Failed to load odds:", error);
      } finally {
        setLoading(false);
      }
    }
    loadOdds();
  }, []);

  const handleSelectBet = (match: Match, selection: string, odds: number) => {
    const existingIndex = selectedBets.findIndex((b) => b.match.id === match.id);
    if (existingIndex >= 0) {
      const updated = [...selectedBets];
      updated[existingIndex] = { match, selection, odds };
      setSelectedBets(updated);
    } else {
      setSelectedBets([...selectedBets, { match, selection, odds }]);
    }
  };

  const handleRemoveBet = (matchId: string) => {
    setSelectedBets(selectedBets.filter((b) => b.match.id !== matchId));
  };

  const calculateTotalOdds = () => {
    if (selectedBets.length === 0) return 1;
    return selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
  };

  const calculatePotentialWin = () => {
    return calculateTotalOdds() * stake;
  };

  const getOddsForSelection = (match: Match, selection: string) => {
    const bookmaker = match.bookmakers[0];
    const market = bookmaker?.markets.find((m) => m.key === "h2h");
    const outcome = market?.outcomes.find((o) => o.name === selection);
    return outcome?.price || 0;
  };

  const isSelected = (matchId: string, selection: string) => {
    return selectedBets.some((b) => b.match.id === matchId && b.selection === selection);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e1a]">
        <div className="text-[#6b7280]">Loading odds...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0e1a] pb-24">
      {/* PAGE HEADER */}
      <header className="flex h-[56px] items-center justify-between bg-[#0d1117] px-4">
        <Link href="/" className="flex items-center gap-[6px]">
          <ArrowLeft className="h-5 w-5 text-[#ffffff]" />
          <span className="text-[15px] text-[#ffffff]">Back</span>
        </Link>
        <span className="text-[16px] font-bold text-[#ffffff]">Sports</span>
        <div className="flex items-center gap-4">
          <Search className="h-6 w-6 text-[#ffffff]" />
          <span className="font-bold text-[#00C853]">{balance.toFixed(2)} KES</span>
          <Wallet className="h-6 w-6 text-[#ffffff]" />
        </div>
      </header>

      {/* SPORTS TABS */}
      <div className="flex h-[44px] gap-2 overflow-x-auto border-b border-[#1e2530] px-4 py-3">
        {["Soccer", "Basketball", "Tennis", "Cricket"].map((sport) => (
          <button
            key={sport}
            className={`h-8 whitespace-nowrap rounded-full px-[14px] text-[13px] font-semibold ${
              sport === "Soccer" ? "bg-[#ffffff] text-[#000000]" : "bg-[#1e2530] text-[#9aa0a6]"
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* MATCH LIST */}
      <div className="flex-1 space-y-3 p-4">
        {matches.map((match) => {
          const bookmaker = match.bookmakers[0];
          const market = bookmaker?.markets.find((m) => m.key === "h2h");
          const outcomes = market?.outcomes || [];
          
          return (
            <div key={match.id} className="rounded-xl border border-[#1e2530] bg-[#1a1f2e] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#00C853]">{match.sport_title}</span>
                <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                  <Clock className="h-3 w-3" />
                  {new Date(match.commence_time).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#ffffff]">{match.home_team}</p>
                </div>
                <div className="px-4 text-sm font-bold text-[#6b7280]">VS</div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-semibold text-[#ffffff]">{match.away_team}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {outcomes.map((outcome) => (
                  <button
                    key={outcome.name}
                    onClick={() => handleSelectBet(match, outcome.name, outcome.price)}
                    className={`rounded-lg py-3 text-sm font-semibold transition-colors ${
                      isSelected(match.id, outcome.name)
                        ? "bg-[#00C853] text-[#ffffff]"
                        : "bg-[#2d3448] text-[#ffffff] hover:bg-[#3d4460]"
                    }`}
                  >
                    <div className="text-xs text-[#6b7280]">{outcome.name}</div>
                    <div className="text-lg font-bold">{outcome.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* BETSLIP */}
      {selectedBets.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#1e2530] bg-[#1a1f2e] p-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#ffffff]">Betslip ({selectedBets.length})</h3>
              <button
                onClick={() => setSelectedBets([])}
                className="text-xs text-[#ef4444]"
              >
                Clear All
              </button>
            </div>

            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
              {selectedBets.map((bet) => (
                <div
                  key={bet.match.id}
                  className="flex items-center justify-between rounded-lg bg-[#2d3448] p-3"
                >
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#ffffff]">
                      {bet.match.home_team} vs {bet.match.away_team}
                    </p>
                    <p className="text-xs text-[#6b7280]">
                      {bet.selection} @ {bet.odds.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveBet(bet.match.id)}
                    className="text-[#ef4444]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Stake Input */}
            <div className="mb-3">
              <label className="mb-2 block text-xs font-semibold text-[#6b7280]">Stake (KES)</label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                min={10}
                className="w-full rounded-lg bg-[#2d3448] px-4 py-3 text-[#ffffff] outline-none focus:ring-2 focus:ring-[#00C853]"
              />
            </div>

            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">Total Odds:</span>
              <span className="font-bold text-[#f5a623]">
                {calculateTotalOdds().toFixed(2)}
              </span>
            </div>

            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">Potential Win:</span>
              <span className="font-bold text-[#00C853]">
                KES {calculatePotentialWin().toFixed(2)}
              </span>
            </div>

            <button
              className="w-full rounded-xl bg-[#00C853] py-4 font-bold text-[#ffffff] hover:bg-[#00a651] transition-colors"
            >
              Place Bet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
