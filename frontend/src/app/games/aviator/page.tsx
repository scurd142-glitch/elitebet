"use client";

import { useEffect, useState, useRef } from "react";
import { Plane, Play, X, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

type GameState = "betting" | "flying" | "crashed";

export default function AviatorPage() {
  const { user, balance, refreshBalance } = useAuth();
  const [gameState, setGameState] = useState<GameState>("betting");
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [betAmount, setBetAmount] = useState(100);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [currentBet, setCurrentBet] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [fakePlayers, setFakePlayers] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(5);
  const socketRef = useRef<Socket | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize Socket.io connection
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

    socketRef.current.on("connect", () => {
      console.log("Connected to Aviator game");
      socketRef.current?.emit("join-aviator");
    });

    socketRef.current.on("multiplier-update", ({ multiplier, status }: { multiplier: number; status: string }) => {
      setMultiplier(multiplier);
      if (status === "crashed") {
        setGameState("crashed");
        setCurrentBet(null);
      }
    });

    socketRef.current.on("round-start", ({ crashPoint }: { crashPoint: number }) => {
      setCrashPoint(crashPoint);
      setGameState("betting");
      setMultiplier(1.0);
      setCurrentBet(null);
      startCountdown();
    });

    socketRef.current.on("cashout", ({ userId, multiplier, amount }: any) => {
      if (userId === user?.id) {
        toast.success(`Cashed out at ${multiplier.toFixed(2)}x! Won KES ${amount.toFixed(2)}`);
        refreshBalance();
      }
    });

    // Load initial data
    loadHistory();
    loadFakePlayers();

    // Start game loop (in production, this would be server-controlled)
    startGameLoop();

    return () => {
      socketRef.current?.disconnect();
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [user]);

  const startCountdown = () => {
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setGameState("flying");
          startFlying();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startFlying = () => {
    let currentMult = 1.0;
    const flyInterval = setInterval(() => {
      currentMult += 0.1;
      setMultiplier(currentMult);
      
      if (currentMult >= crashPoint) {
        clearInterval(flyInterval);
        setGameState("crashed");
        updateHistory(crashPoint);
        setTimeout(() => {
          // Start new round
          const newCrashPoint = Math.max(1, (100 / (Math.random() * 100)) * 0.97);
          setCrashPoint(newCrashPoint);
          setGameState("betting");
          setMultiplier(1.0);
          startCountdown();
        }, 3000);
      }
    }, 100);
  };

  const startGameLoop = () => {
    // Initial start
    const initialCrashPoint = Math.max(1, (100 / (Math.random() * 100)) * 0.97);
    setCrashPoint(initialCrashPoint);
    startCountdown();
  };

  const loadHistory = async () => {
    const res = await api.getAviatorHistory();
    if (res.success && res.data) setHistory(res.data.history);
  };

  const loadFakePlayers = async () => {
    const res = await api.getFakePlayers();
    if (res.success && res.data) setFakePlayers(res.data.players);
  };

  const updateHistory = (point: number) => {
    setHistory((prev) => [{ crashPoint: point, createdAt: new Date() }, ...prev].slice(0, 10));
  };

  const handlePlaceBet = async () => {
    if (!user) return toast.error("Please login to play");
    if (betAmount > balance) return toast.error("Insufficient balance");
    if (gameState !== "betting") return toast.error("Betting phase closed");

    const res = await api.placeAviatorBet({ amount: betAmount });

    if (res.success && res.data) {
      setCurrentBet(res.data.bet);
      refreshBalance();
      toast.success("Bet placed!");
    } else {
      toast.error(res.message || "Failed to place bet");
    }
  };

  const handleCashout = async () => {
    if (!currentBet) return;
    if (gameState !== "flying") return;

    const res = await api.cashoutAviator({ betId: currentBet.id, multiplier });

    if (res.success && res.data) {
      toast.success(`Cashed out at ${multiplier.toFixed(2)}x! Won KES ${res.data.winAmount.toFixed(2)}`);
      setCurrentBet(null);
      refreshBalance();
    } else {
      toast.error(res.message || "Failed to cashout");
    }
  };

  const getHistoryColor = (point: number) => {
    return point >= 2 ? "bg-[#00a651]" : "bg-[#e63946]";
  };

  return (
    <div className="min-h-screen bg-[#111111] p-4">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#f5c518]">Aviator</h1>
          <div className="text-sm text-[#888888]">Balance: KES {balance.toFixed(2)}</div>
        </div>

        {/* Game Area */}
        <div className="relative overflow-hidden rounded-2xl border border-[#333333] bg-[#1a1a1a] p-6">
          {/* Multiplier Display */}
          <div className="mb-8 flex flex-col items-center">
            <div className={`text-6xl font-bold font-mono ${gameState === "crashed" ? "text-[#e63946]" : "text-[#00a651]"}`}>
              {gameState === "betting" ? countdown : multiplier.toFixed(2)}x
            </div>
            {gameState === "betting" && <div className="text-sm text-[#888888]">Starting in...</div>}
            {gameState === "crashed" && <div className="text-sm text-[#e63946]">CRASHED!</div>}
          </div>

          {/* Rocket Animation */}
          <div className="relative h-48">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333333]" />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-100"
              style={{
                bottom: `${Math.min((multiplier - 1) * 10, 180)}px`,
              }}
            >
              <Plane
                className={`h-12 w-12 ${gameState === "flying" ? "text-[#f5c518] animate-pulse" : "text-[#888888]"}`}
                style={{ transform: "rotate(-45deg)" }}
              />
            </div>
          </div>

          {/* Fake Players Panel */}
          <div className="mt-8 rounded-xl bg-[#222222] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#888888]">Live Players</h3>
            <div className="space-y-2">
              {fakePlayers.map((player, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-[#ffffff]">{player.name}</span>
                  <span className="font-mono text-[#00a651]">KES {player.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Round History */}
        <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#888888]">Round History</h3>
          <div className="flex gap-2">
            {history.map((round, idx) => (
              <div
                key={idx}
                className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-xs font-bold text-[#ffffff] ${getHistoryColor(round.crashPoint)}`}
              >
                {round.crashPoint.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>

        {/* Betting Controls */}
        <div className="rounded-xl border border-[#333333] bg-[#1a1a1a] p-4">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-[#888888]">Bet Amount (KES)</label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full rounded-lg bg-[#222222] px-4 py-2 text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#00a651]"
                min="10"
                step="10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-[#888888]">Auto Cashout (x)</label>
              <input
                type="number"
                value={autoCashout}
                onChange={(e) => setAutoCashout(Number(e.target.value))}
                className="w-full rounded-lg bg-[#222222] px-4 py-2 text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#00a651]"
                min="1.1"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex gap-4">
            {gameState === "betting" && !currentBet ? (
              <button
                onClick={handlePlaceBet}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00a651] py-3 font-semibold text-[#ffffff] hover:bg-[#008c45] transition-colors"
              >
                <Play className="h-5 w-5" />
                Place Bet
              </button>
            ) : gameState === "flying" && currentBet ? (
              <button
                onClick={handleCashout}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#f5c518] py-3 font-semibold text-[#111111] hover:bg-[#d4a818] transition-colors"
              >
                <TrendingUp className="h-5 w-5" />
                Cashout ({multiplier.toFixed(2)}x)
              </button>
            ) : (
              <button
                disabled
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#333333] py-3 font-semibold text-[#888888]"
              >
                {gameState === "crashed" ? "Crashed" : currentBet ? "Waiting..." : "Betting Closed"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
