"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Settings, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { getSocketUrl } from "@/lib/api-config";

type GamePhase = "betting" | "flying" | "crashed";
type PlayerTab = "all" | "previous" | "top";

type ActiveBet = { id: string; stake: number };

const QUICK_AMOUNTS = [100, 200, 500, 20000];

function historyColor(point: number) {
  if (point >= 20) return "bg-[#f5c518] text-[#111111]";
  if (point >= 5) return "bg-[#00a651] text-[#ffffff]";
  if (point >= 2) return "bg-[#9b59b6] text-[#ffffff]";
  return "bg-[#e63946] text-[#ffffff]";
}

export default function AviatorPage() {
  const { user, balance, refreshBalance } = useAuth();
  const [phase, setPhase] = useState<GamePhase>("betting");
  const [multiplier, setMultiplier] = useState(1);
  const [countdown, setCountdown] = useState(5);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [playerTab, setPlayerTab] = useState<PlayerTab>("all");
  const [bet1Amount, setBet1Amount] = useState(100);
  const [bet2Amount, setBet2Amount] = useState(100);
  const [bet2Enabled, setBet2Enabled] = useState(false);
  const [activeBet1, setActiveBet1] = useState<ActiveBet | null>(null);
  const [activeBet2, setActiveBet2] = useState<ActiveBet | null>(null);
  const [roundId, setRoundId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const flashRef = useRef(false);

  const drawCanvas = useCallback((mult: number, crashed: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = crashed && flashRef.current ? "#3a1111" : "#111111";
    ctx.fillRect(0, 0, w, h);

    // Starburst
    ctx.strokeStyle = "#1c1c1c";
    ctx.lineWidth = 1;
    for (let i = 0; i < 360; i += 12) {
      const angle = (i * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * w, cy + Math.sin(angle) * h);
      ctx.stroke();
    }

    const progress = Math.min((mult - 1) / 9, 1);
    const startX = 60;
    const startY = h - 60;
    const endX = w - 60;
    const endY = 60;

    // Red curve trail
    if (mult > 1) {
      ctx.beginPath();
      ctx.strokeStyle = crashed ? "#e63946" : "#ff4d6d";
      ctx.lineWidth = 3;
      ctx.moveTo(startX, startY);
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * progress;
        const cp = Math.pow(t, 0.55);
        const x = startX + (endX - startX) * cp;
        const y = startY - (startY - endY) * cp;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Plane position
    if (!crashed || mult <= 1) {
      const cp = Math.pow(progress, 0.55);
      const planeX = startX + (endX - startX) * cp;
      const planeY = startY - (startY - endY) * cp;
      const angle = -0.4 - progress * 0.3;

      ctx.save();
      ctx.translate(planeX, planeY);
      ctx.rotate(angle);
      ctx.fillStyle = "#e63946";
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(28, 0);
      ctx.lineTo(0, 12);
      ctx.lineTo(6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ff6b9d";
      ctx.beginPath();
      ctx.ellipse(14, 0, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = crashed ? "#e63946" : "#ffffff";
    ctx.font = "bold 56px Inter, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${mult.toFixed(2)}x`, cx, cy - 20);

    if (crashed) {
      ctx.font = "bold 28px Inter, Arial";
      ctx.fillText(`CRASHED! ${mult.toFixed(2)}x`, cx, cy + 36);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      drawCanvas(multiplier, phase === "crashed");
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawCanvas, multiplier, phase]);

  useEffect(() => {
    drawCanvas(multiplier, phase === "crashed");
  }, [multiplier, phase, drawCanvas]);

  useEffect(() => {
    api.getAviatorHistory().then((res) => {
      if (res.success && res.data?.history) {
        setHistory(res.data.history.map((h) => h.crashPoint).slice(0, 10));
      }
    });
    api.getFakePlayers().then((res) => {
      if (res.success && res.data?.players) setPlayers(res.data.players);
    });

    const socketUrl = getSocketUrl();
    if (!socketUrl) return;

    const socket = io(socketUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("join-aviator");

    socket.on("game-phase", (payload: {
      phase: GamePhase;
      roundId: string;
      countdown?: number;
      multiplier?: number;
      crashPoint?: number;
    }) => {
      setRoundId(payload.roundId);
      setPhase(payload.phase);
      if (payload.countdown !== undefined) setCountdown(payload.countdown);
      if (payload.multiplier !== undefined) setMultiplier(payload.multiplier);

      if (payload.phase === "betting") {
        setActiveBet1(null);
        setActiveBet2(null);
        setCrashPoint(null);
        api.getFakePlayers().then((r) => r.success && r.data && setPlayers(r.data.players));
      }

      if (payload.phase === "crashed" && payload.crashPoint) {
        setCrashPoint(payload.crashPoint);
        setMultiplier(payload.crashPoint);
        flashRef.current = true;
        setTimeout(() => { flashRef.current = false; }, 300);
        setHistory((prev) => [payload.crashPoint!, ...prev].slice(0, 10));
        setActiveBet1(null);
        setActiveBet2(null);
        refreshBalance();
      }
    });

    socket.on("multiplier-update", (payload: { multiplier: number; status: string }) => {
      setMultiplier(payload.multiplier);
      if (payload.status === "crashed") setPhase("crashed");
      else if (payload.status === "flying") setPhase("flying");
    });

    return () => {
      socket.emit("leave-aviator");
      socket.disconnect();
    };
  }, [refreshBalance]);

  async function placeBet(panel: 1 | 2) {
    if (!user) return toast.error("Please login to play");
    const amount = panel === 1 ? bet1Amount : bet2Amount;
    if (amount > balance) return toast.error("Insufficient balance");
    if (phase !== "betting") return toast.error("Betting closed");

    const res = await api.placeAviatorBet({ amount });
    if (!res.success || !res.data) {
      toast.error(res.message ?? "Failed to place bet");
      return;
    }
    const bet = { id: res.data.id, stake: res.data.stake ?? amount };
    if (panel === 1) setActiveBet1(bet);
    else setActiveBet2(bet);
    await refreshBalance();
    toast.success(`Bet #${panel} placed!`);
  }

  async function cashout(panel: 1 | 2) {
    const bet = panel === 1 ? activeBet1 : activeBet2;
    if (!bet || phase !== "flying") return;

    const res = await api.cashoutAviator({ betId: bet.id, multiplier });
    if (!res.success) {
      toast.error(res.message ?? "Cashout failed");
      return;
    }
    toast.success(`Cashed out @ ${multiplier.toFixed(2)}x — KES ${(res.data?.winAmount ?? 0).toFixed(2)}`);
    if (panel === 1) setActiveBet1(null);
    else setActiveBet2(null);
    await refreshBalance();
  }

  function renderBetPanel(panel: 1 | 2) {
    const amount = panel === 1 ? bet1Amount : bet2Amount;
    const setAmount = panel === 1 ? setBet1Amount : setBet2Amount;
    const activeBet = panel === 1 ? activeBet1 : activeBet2;

    let buttonLabel = `Bet ${amount.toFixed(2)} KES`;
    let buttonClass = "bg-[#00a651] text-[#ffffff] hover:opacity-90";
    let buttonAction: () => void = () => { void placeBet(panel); };
    let disabled = false;

    if (phase === "flying" && activeBet) {
      buttonLabel = `Cash Out ${(activeBet.stake * multiplier).toFixed(2)} KES`;
      buttonClass = "bg-[#f5c518] text-[#111111] hover:opacity-90";
      buttonAction = () => { void cashout(panel); };
    } else if (phase !== "betting" || activeBet) {
      buttonLabel = phase === "crashed" ? "Next Round" : activeBet ? "Bet Placed" : "Betting Closed";
      buttonClass = "bg-[#333333] text-[#888888]";
      disabled = true;
    }

    return (
      <div className="rounded-xl border border-[#333333] bg-[#222222] p-4">
        <p className="mb-2 text-xs font-semibold text-[#888888]">Bet #{panel}</p>
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => setAmount(Math.max(10, amount - 50))} className="h-10 w-10 rounded-lg bg-[#333333] font-bold text-[#ffffff]">−</button>
          <div className="font-mono text-2xl font-bold text-[#f5c518]">{amount}</div>
          <button type="button" onClick={() => setAmount(amount + 50)} className="h-10 w-10 rounded-lg bg-[#333333] font-bold text-[#ffffff]">+</button>
        </div>
        <div className="mb-3 flex gap-2">
          {QUICK_AMOUNTS.map((q) => (
            <button key={q} type="button" onClick={() => setAmount(q)} className="flex-1 rounded bg-[#333333] py-1 text-xs font-semibold text-[#ffffff]">
              {q >= 1000 ? `${q / 1000}K` : q}
            </button>
          ))}
        </div>
        <button type="button" disabled={disabled} onClick={buttonAction} className={`w-full rounded-lg py-3 font-bold ${buttonClass} disabled:opacity-60`}>
          {buttonLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#111111] pb-20">
      <div className="flex items-center justify-between border-b border-[#333333] bg-[#1a1a1a] px-4 py-2">
        <span className="text-xl font-bold italic text-[#e63946]">Aviator</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#f5c518]">KES {balance.toFixed(2)}</span>
          <Settings className="h-5 w-5 text-[#888888]" />
          <MessageSquare className="h-5 w-5 text-[#888888]" />
        </div>
      </div>

      {/* Round history — top bar */}
      <div className="flex gap-2 overflow-x-auto border-b border-[#333333] bg-[#1a1a1a] px-3 py-2">
        {history.map((point, i) => (
          <span key={`${point}-${i}`} className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${historyColor(point)}`}>
            {point.toFixed(2)}x
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-1.5">
        <span className="rounded bg-[#00a651] px-2 py-0.5 text-[10px] font-bold text-[#ffffff]">LIVE</span>
        <span className="text-xs text-[#888888]">{roundId ? `Round ${roundId.slice(-6)}` : "Connecting…"}</span>
      </div>

      {/* Canvas — compact */}
      <div className="relative" style={{ height: "42vh" }}>
        <canvas ref={canvasRef} className="h-full w-full" />
        {phase === "betting" && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/40">
            <span className="text-6xl font-bold text-[#f5c518]">{countdown}</span>
          </div>
        )}
      </div>

      {/* Betting panels */}
      <div className="space-y-3 border-t border-[#333333] bg-[#1a1a1a] p-3">
        {renderBetPanel(1)}
        {bet2Enabled ? renderBetPanel(2) : (
          <button type="button" onClick={() => setBet2Enabled(true)} className="w-full rounded-lg border border-dashed border-[#333333] py-3 text-sm font-semibold text-[#888888]">
            + Add Bet #2
          </button>
        )}
      </div>

      {/* Players panel */}
      <div className="border-t border-[#333333] bg-[#1a1a1a] p-3">
        <div className="mb-3 flex gap-4">
          {(["all", "previous", "top"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setPlayerTab(tab)}
              className={`text-xs font-semibold capitalize ${playerTab === tab ? "text-[#00a651]" : "text-[#888888]"}`}
            >
              {tab === "all" ? "All Bets" : tab}
            </button>
          ))}
        </div>
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {players.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#333333] text-[10px] font-bold text-[#ffffff]">
                  {p.name?.[0] ?? "P"}
                </span>
                <span className="text-[#ffffff]">{p.phone}</span>
              </div>
              <span className="text-[#888888]">KES {p.amount}</span>
              <span className={p.cashoutMultiplier ? "text-[#00a651]" : "text-[#888888]"}>
                {p.cashoutMultiplier ? `${p.cashoutMultiplier}x` : "—"}
              </span>
              <span className="text-[#00a651]">{p.winAmount ? `KES ${p.winAmount}` : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
