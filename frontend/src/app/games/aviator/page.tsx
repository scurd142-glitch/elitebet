"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { io, type Socket } from "socket.io-client";
import { ArrowLeft, Wallet, Menu, MessageSquare, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { getSocketUrl } from "@/lib/api-config";

type GamePhase = "betting" | "flying" | "crashed";
type PlayerTab = "all" | "previous" | "top";

type ActiveBet = { id: string; stake: number };

const QUICK_AMOUNTS = [100, 200, 500, 20000];

function historyColor(point: number) {
  if (point >= 10) return "text-[#00C853]";
  if (point >= 2) return "text-[#a855f7]";
  return "text-[#ef4444]";
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

    // Deep dark purple-black background
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) / 2);
    gradient.addColorStop(0, "#1a0030");
    gradient.addColorStop(1, "#0a0014");
    ctx.fillStyle = crashed && flashRef.current ? "#3a1111" : gradient;
    ctx.fillRect(0, 0, w, h);

    // Radial sunray lines from bottom-left
    ctx.strokeStyle = "#2a1a4a";
    ctx.lineWidth = 1;
    for (let i = 0; i < 360; i += 15) {
      const angle = (i * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(cx + Math.cos(angle) * w, cy + Math.sin(angle) * h);
      ctx.stroke();
    }

    const progress = Math.min((mult - 1) / 9, 1);
    const startX = 60;
    const startY = h - 60;
    const endX = w - 60;
    const endY = 60;

    // Pink/red gradient fill under curve
    if (mult > 1) {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * progress;
        const cp = Math.pow(t, 0.55);
        const x = startX + (endX - startX) * cp;
        const y = startY - (startY - endY) * cp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(endX, startY);
      ctx.closePath();
      const fillGradient = ctx.createLinearGradient(startX, startY, endX, endY);
      fillGradient.addColorStop(0, "rgba(255,45,85,0.3)");
      fillGradient.addColorStop(1, "rgba(255,45,85,0.0)");
      ctx.fillStyle = fillGradient;
      ctx.fill();
    }

    // Animated flight line
    if (mult > 1) {
      ctx.beginPath();
      ctx.strokeStyle = crashed ? "#ef4444" : "#ff2d55";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#ff2d55";
      ctx.shadowBlur = 10;
      ctx.moveTo(startX, startY);
      for (let i = 0; i <= 100; i++) {
        const t = (i / 100) * progress;
        const cp = Math.pow(t, 0.55);
        const x = startX + (endX - startX) * cp;
        const y = startY - (startY - endY) * cp;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Arrowhead at tip
      const cp = Math.pow(progress, 0.55);
      const planeX = startX + (endX - startX) * cp;
      const planeY = startY - (startY - endY) * cp;
      const angle = Math.atan2(endY - startY, endX - startX);

      ctx.save();
      ctx.translate(planeX, planeY);
      ctx.rotate(angle);
      ctx.fillStyle = "#ff2d55";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-12, -6);
      ctx.lineTo(-12, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Multiplier text
    ctx.fillStyle = crashed ? "#ef4444" : "#ffffff";
    ctx.font = "bold 72px Inter, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 20;
    ctx.fillText(`${mult.toFixed(2)}x`, cx, cy - 20);
    ctx.shadowBlur = 0;

    // Player avatars bottom-right
    ctx.fillStyle = "#ffffff";
    ctx.font = "13px Inter, Arial";
    ctx.textAlign = "right";
    ctx.fillText("2,656", w - 80, h - 30);
    
    // Draw 3 overlapping circles
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w - 30 - (i * 20), h - 30, 14, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? "#ff2d55" : i === 1 ? "#a855f7" : "#00C853";
      ctx.fill();
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

    let buttonLabel = `Bet`;
    let buttonSubLabel = `${amount.toFixed(2)} KES`;
    let buttonClass = "bg-[#00C853] text-[#ffffff] hover:opacity-90";
    let buttonAction: () => void = () => { void placeBet(panel); };
    let disabled = false;

    if (phase === "flying" && activeBet) {
      buttonLabel = "Cash Out";
      buttonSubLabel = `${(activeBet.stake * multiplier).toFixed(2)} KES`;
      buttonClass = "bg-[#f5a623] text-[#ffffff] hover:opacity-90";
      buttonAction = () => { void cashout(panel); };
    } else if (phase !== "betting" || activeBet) {
      buttonLabel = phase === "crashed" ? "Next Round" : activeBet ? "Bet Placed" : "Wait";
      buttonSubLabel = "";
      buttonClass = "bg-[#2d3448] text-[#6b7280]";
      disabled = true;
    }

    return (
      <div className="rounded-xl border border-[#1e2530] bg-[#1a1f2e] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex rounded-lg bg-[#252b3d] p-1">
            <button className="px-3 py-1 text-sm font-semibold rounded-md bg-[#3d4460] text-[#ffffff]">Bet</button>
            <button className="px-3 py-1 text-sm font-semibold rounded-md text-[#6b7280]">Auto</button>
          </div>
          {panel === 2 && (
            <button type="button" onClick={() => setBet2Enabled(false)} className="h-7 w-7 rounded-md bg-[#2d3448] flex items-center justify-center">
              <Minus className="h-4 w-4 text-[#6b7280]" />
            </button>
          )}
        </div>
        
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => setAmount(Math.max(10, amount - 50))} className="h-10 w-10 rounded-full bg-[#2d3448] font-bold text-[#ffffff] text-xl">−</button>
          <div className="font-mono text-2xl font-bold text-[#ffffff]">{amount}</div>
          <button type="button" onClick={() => setAmount(amount + 50)} className="h-10 w-10 rounded-full bg-[#2d3448] font-bold text-[#ffffff] text-xl">+</button>
        </div>
        
        <div className="mb-3 grid grid-cols-2 gap-2">
          {QUICK_AMOUNTS.slice(0, 4).map((q) => (
            <button key={q} type="button" onClick={() => setAmount(q)} className="rounded-lg bg-[#2d3448] py-2 text-sm font-semibold text-[#6b7280]">
              {q >= 1000 ? `${q / 1000}K` : q}
            </button>
          ))}
        </div>
        
        <button type="button" disabled={disabled} onClick={buttonAction} className={`w-full h-19 rounded-xl py-4 font-bold ${buttonClass} disabled:opacity-60`}>
          <div className="text-lg">{buttonLabel}</div>
          {buttonSubLabel && <div className="text-xl">{buttonSubLabel}</div>}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0e1a] pb-20">
      {/* PAGE HEADER */}
      <header className="flex h-[56px] items-center justify-between bg-[#0d1117] px-4">
        <Link href="/" className="flex items-center gap-[6px]">
          <ArrowLeft className="h-5 w-5 text-[#ffffff]" />
          <span className="text-[15px] text-[#ffffff]">Back</span>
        </Link>
        <span className="text-[16px] font-bold text-[#ffffff]">Aviator</span>
        <button className="flex h-10 items-center gap-2 rounded-full bg-[#00C853] px-5 text-[15px] font-bold text-[#ffffff]">
          <Wallet className="h-4 w-4" />
          Deposit
        </button>
      </header>

      {/* AVIATOR SUBHEADER */}
      <div className="flex h-[48px] items-center justify-between px-4">
        <span className="text-[24px] font-black italic text-[#ff2d55]">Aviator</span>
        <div className="flex items-center gap-[14px]">
          <span className="font-bold text-[#00C853]">{balance.toFixed(2)} KES</span>
          <Menu className="h-[22px] w-[22px] text-[#9aa0a6]" />
          <MessageSquare className="h-[22px] w-[22px] text-[#9aa0a6]" />
        </div>
      </div>

      {/* MULTIPLIER HISTORY ROW */}
      <div className="flex h-[40px] items-center gap-[18px] overflow-x-auto px-3 py-1">
        {history.map((point, i) => (
          <span key={`${point}-${i}`} className={`shrink-0 text-[14px] font-extrabold ${historyColor(point)}`}>
            {point.toFixed(2)}x
          </span>
        ))}
        <button className="h-7 w-7 shrink-0 rounded bg-[#2d3448] text-[#6b7280]">...</button>
      </div>

      {/* LIVE INDICATOR */}
      <div className="flex h-[28px] items-center justify-between px-3">
        <span className="rounded bg-[#00C853] px-2 py-0.5 text-[11px] font-bold text-[#ffffff]">LIVE</span>
        <span className="text-[11px] text-[#6b7280]">{roundId ? `Round ${roundId.slice(-6)}` : "Connecting…"}</span>
      </div>

      {/* GAME CANVAS */}
      <div className="relative" style={{ height: "300px" }}>
        <canvas ref={canvasRef} className="h-full w-full" />
        {phase === "betting" && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a0014]/40">
            <span className="text-6xl font-bold text-[#f5a623]">{countdown}</span>
          </div>
        )}
      </div>

      {/* BET PANEL */}
      <div className="space-y-3 border-t border-[#1e2530] bg-[#1a1f2e] p-4">
        {renderBetPanel(1)}
        {bet2Enabled ? renderBetPanel(2) : (
          <button type="button" onClick={() => setBet2Enabled(true)} className="w-full rounded-xl border border-dashed border-[#2d3448] py-3 text-sm font-semibold text-[#6b7280]">
            + Add Bet #2
          </button>
        )}
      </div>

      {/* BOTTOM TABS */}
      <div className="flex h-[48px] items-center gap-6 border-t border-[#1e2530] bg-[#0d1117] px-4">
        {(["all", "previous", "top"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setPlayerTab(tab)}
            className={`text-sm font-semibold ${playerTab === tab ? "text-[#00C853]" : "text-[#6b7280]"}`}
          >
            {tab === "all" ? "All Bets" : tab}
          </button>
        ))}
      </div>

      {/* PLAYERS PANEL */}
      <div className="flex-1 overflow-y-auto bg-[#0d1117] p-4">
        <div className="space-y-2">
          {players.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2d3448] text-[10px] font-bold text-[#ffffff]">
                  {p.name?.[0] ?? "P"}
                </span>
                <span className="text-[#ffffff]">{p.phone}</span>
              </div>
              <span className="text-[#6b7280]">KES {p.amount}</span>
              <span className={p.cashoutMultiplier ? "text-[#00C853]" : "text-[#6b7280]"}>
                {p.cashoutMultiplier ? `${p.cashoutMultiplier}x` : "—"}
              </span>
              <span className="text-[#00C853]">{p.winAmount ? `KES ${p.winAmount}` : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
