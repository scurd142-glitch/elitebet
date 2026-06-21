"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Settings, MessageSquare, XCircle } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import toast from "react-hot-toast";

type GameState = "betting" | "flying" | "crashed";

// Proper random crash point generation
function generateCrashPoint(): number {
  const r = Math.random();
  if (r < 0.01) return 1.00;
  const crash = Math.max(1.00, (100 / (1 - r)) * 0.97 / 100);
  return Math.round(crash * 100) / 100;
}

// Generate fake players
function generateFakePlayers(count: number) {
  const players = [];
  for (let i = 0; i < count; i++) {
    players.push({
      phone: `07X${Math.random().toString(36).substring(2, 5).toUpperCase()}XXX`,
      bet: Math.floor(Math.random() * 5000) + 100,
      cashoutMultiplier: Math.random() > 0.5 ? (Math.random() * 10 + 1).toFixed(2) : null,
      crashed: Math.random() > 0.7,
    });
  }
  return players;
}

export default function AviatorPage() {
  const { user, balance, refreshBalance } = useAuth();
  const [gameState, setGameState] = useState<GameState>("betting");
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [history, setHistory] = useState<number[]>([]);
  const [fakePlayers, setFakePlayers] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [bet1Amount, setBet1Amount] = useState(100);
  const [bet2Amount, setBet2Amount] = useState(100);
  const [bet2Enabled, setBet2Enabled] = useState(false);
  const [currentBet1, setCurrentBet1] = useState<any>(null);
  const [currentBet2, setCurrentBet2] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize history with some fake data and start game
  useEffect(() => {
    const fakeHistory = Array.from({ length: 30 }, () => generateCrashPoint());
    setHistory(fakeHistory);
    setFakePlayers(generateFakePlayers(12));
    
    // Start the game loop
    startCountdown();
    
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Canvas animation
  const drawCanvas = useCallback((currentMultiplier: number, isCrashed: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, width, height);

    // Draw radial lines pattern (starburst background)
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    for (let i = 0; i < 360; i += 15) {
      const angle = (i * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(
        width / 2 + Math.cos(angle) * width,
        height / 2 + Math.sin(angle) * height
      );
      ctx.stroke();
    }

    // Draw curve trail
    if (currentMultiplier > 1) {
      ctx.beginPath();
      ctx.strokeStyle = isCrashed ? "#e63946" : "#ff6b9d";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      const progress = Math.min((currentMultiplier - 1) / 10, 1);
      const startX = 50;
      const startY = height - 50;
      const endX = width - 50;
      const endY = 50;

      ctx.moveTo(startX, startY);

      // Draw exponential curve
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const curveProgress = Math.pow(t, 0.5);
        const x = startX + (endX - startX) * curveProgress;
        const y = startY - (startY - endY) * curveProgress;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    // Draw plane
    if (!isCrashed && currentMultiplier > 1) {
      const progress = Math.min((currentMultiplier - 1) / 10, 1);
      const startX = 50;
      const startY = height - 50;
      const endX = width - 50;
      const endY = 50;
      const curveProgress = Math.pow(progress, 0.5);
      const planeX = startX + (endX - startX) * curveProgress;
      const planeY = startY - (startY - endY) * curveProgress;

      // Draw plane (red aircraft)
      ctx.fillStyle = "#e63946";
      ctx.beginPath();
      ctx.moveTo(planeX, planeY - 10);
      ctx.lineTo(planeX + 20, planeY);
      ctx.lineTo(planeX, planeY + 10);
      ctx.lineTo(planeX + 5, planeY);
      ctx.closePath();
      ctx.fill();

      // Draw plane body
      ctx.fillStyle = "#ff6b9d";
      ctx.beginPath();
      ctx.ellipse(planeX + 10, planeY, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw multiplier text
    ctx.fillStyle = isCrashed ? "#e63946" : "#ffffff";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${currentMultiplier.toFixed(2)}x`, width / 2, height / 2);

    // Draw CRASHED text
    if (isCrashed) {
      ctx.fillStyle = "#e63946";
      ctx.font = "bold 36px Arial";
      ctx.fillText("CRASHED!", width / 2, height / 2 + 50);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;

    drawCanvas(multiplier, gameState === "crashed");

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [multiplier, gameState, drawCanvas]);

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
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    let currentMult = 1.0;

    const animate = () => {
      currentMult += 0.05;
      setMultiplier(currentMult);
      drawCanvas(currentMult, false);

      if (currentMult >= newCrashPoint) {
        setGameState("crashed");
        setMultiplier(newCrashPoint);
        drawCanvas(newCrashPoint, true);
        
        // Update history
        setHistory((prev) => [newCrashPoint, ...prev].slice(0, 30));
        
        // Update fake players
        setFakePlayers(generateFakePlayers(12));
        
        // Reset bets
        setCurrentBet1(null);
        setCurrentBet2(null);
        
        // Start next round
        setTimeout(() => {
          setGameState("betting");
          setMultiplier(1.0);
          startCountdown();
        }, 3000);
        
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handlePlaceBet1 = () => {
    if (!user) return toast.error("Please login to play");
    if (bet1Amount > balance) return toast.error("Insufficient balance");
    if (gameState !== "betting") return toast.error("Betting phase closed");

    setCurrentBet1({ amount: bet1Amount });
    toast.success("Bet #1 placed!");
  };

  const handleCashout1 = () => {
    if (!currentBet1) return;
    if (gameState !== "flying") return;

    const winAmount = currentBet1.amount * multiplier;
    toast.success(`Cashout #1 at ${multiplier.toFixed(2)}x! Won KES ${winAmount.toFixed(2)}`);
    setCurrentBet1(null);
  };

  const handlePlaceBet2 = () => {
    if (!user) return toast.error("Please login to play");
    if (bet2Amount > balance) return toast.error("Insufficient balance");
    if (gameState !== "betting") return toast.error("Betting phase closed");

    setCurrentBet2({ amount: bet2Amount });
    toast.success("Bet #2 placed!");
  };

  const handleCashout2 = () => {
    if (!currentBet2) return;
    if (gameState !== "flying") return;

    const winAmount = currentBet2.amount * multiplier;
    toast.success(`Cashout #2 at ${multiplier.toFixed(2)}x! Won KES ${winAmount.toFixed(2)}`);
    setCurrentBet2(null);
  };

  const getHistoryColor = (point: number) => {
    if (point >= 20) return "bg-[#f5c518]";
    if (point >= 5) return "bg-[#00a651]";
    if (point >= 2) return "bg-[#9b59b6]";
    return "bg-[#e63946]";
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333] bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#e63946] italic">Aviator</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-[#00a651]">KES {balance.toFixed(2)}</span>
          <Settings className="h-5 w-5 text-[#888888]" />
          <MessageSquare className="h-5 w-5 text-[#888888]" />
        </div>
      </div>

      {/* LIVE Badge Row */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <span className="bg-[#00a651] px-2 py-0.5 text-xs font-bold text-[#ffffff] rounded">LIVE</span>
          <span className="text-sm font-semibold text-[#ffffff]">Bet Rush</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#f5c518]">→</span>
        </div>
      </div>

      {/* Room Tabs */}
      <div className="flex gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-[#333333]">
        {["Room #1", "Room #2", "Room #3"].map((room, i) => (
          <button
            key={i}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
              i === 0 ? "bg-[#00a651] text-[#ffffff]" : "bg-[#222222] text-[#888888]"
            }`}
          >
            {room}
            <X className="h-3 w-3" />
          </button>
        ))}
      </div>

      {/* Game Canvas */}
      <div className="relative flex-1" style={{ minHeight: "50vh" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ minHeight: "50vh" }}
        />
        
        {/* Countdown Overlay */}
        {gameState === "betting" && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/50">
            <div className="text-6xl font-bold text-[#f5c518]">{countdown}</div>
          </div>
        )}
      </div>

      {/* Round History */}
      {showHistory && (
        <div className="border-t border-[#333333] bg-[#1a1a1a] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#ffffff]">Round History</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-[#888888] hover:text-[#ffffff]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((point, i) => (
              <div
                key={i}
                className={`px-2 py-1 rounded text-xs font-bold text-[#ffffff] ${getHistoryColor(point)}`}
              >
                {point.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Players */}
      <div className="border-t border-[#333333] bg-[#1a1a1a] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#ffffff]">Live Players</h3>
        <div className="space-y-2">
          {fakePlayers.map((player, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-[#ffffff]">{player.phone}</span>
              <span className="text-[#888888]">KES {player.bet}</span>
              <span className={player.cashoutMultiplier ? "text-[#00a651]" : player.crashed ? "text-[#e63946]" : "text-[#f5c518]"}>
                {player.cashoutMultiplier ? `${player.cashoutMultiplier}x` : player.crashed ? "✗" : "Playing..."}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Betting Panel */}
      <div className="border-t border-[#333333] bg-[#1a1a1a] p-4 space-y-3">
        {/* Bet Panel 1 */}
        <div className="rounded-xl border border-[#333333] bg-[#222222] p-4">
          <div className="flex gap-2 mb-3">
            <button className="flex-1 py-1 text-xs font-semibold text-[#ffffff] bg-[#00a651] rounded">Bet</button>
            <button className="flex-1 py-1 text-xs font-semibold text-[#888888] bg-[#333333] rounded">Auto</button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setBet1Amount(Math.max(10, bet1Amount - 50))}
              className="w-10 h-10 rounded-lg bg-[#333333] text-[#ffffff] font-bold"
            >
              −
            </button>
            <div className="text-2xl font-bold text-[#f5c518] font-mono">{bet1Amount}</div>
            <button
              onClick={() => setBet1Amount(bet1Amount + 50)}
              className="w-10 h-10 rounded-lg bg-[#333333] text-[#ffffff] font-bold"
            >
              +
            </button>
          </div>
          <div className="flex gap-2 mb-3">
            {[100, 250, 1000, 25000].map((amount) => (
              <button
                key={amount}
                onClick={() => setBet1Amount(amount)}
                className="flex-1 py-1 text-xs font-semibold text-[#ffffff] bg-[#333333] rounded hover:bg-[#444444]"
              >
                {amount}
              </button>
            ))}
          </div>
          {gameState === "betting" && !currentBet1 ? (
            <button
              onClick={handlePlaceBet1}
              className="w-full py-3 bg-[#00a651] text-[#ffffff] font-bold rounded-lg hover:bg-[#008c45]"
            >
              Bet {bet1Amount} KES
            </button>
          ) : gameState === "flying" && currentBet1 ? (
            <button
              onClick={handleCashout1}
              className="w-full py-3 bg-[#f5c518] text-[#111111] font-bold rounded-lg hover:bg-[#d4a818]"
            >
              Cash Out {(currentBet1.amount * multiplier).toFixed(2)} KES
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-[#333333] text-[#888888] font-bold rounded-lg"
            >
              {gameState === "crashed" ? "Crashed" : currentBet1 ? "Waiting..." : "Betting Closed"}
            </button>
          )}
        </div>

        {/* Bet Panel 2 */}
        {bet2Enabled && (
          <div className="rounded-xl border border-[#333333] bg-[#222222] p-4 relative">
            <button
              onClick={() => setBet2Enabled(false)}
              className="absolute top-2 right-2 text-[#888888] hover:text-[#e63946]"
            >
              <XCircle className="h-5 w-5" />
            </button>
            <div className="flex gap-2 mb-3">
              <button className="flex-1 py-1 text-xs font-semibold text-[#ffffff] bg-[#00a651] rounded">Bet</button>
              <button className="flex-1 py-1 text-xs font-semibold text-[#888888] bg-[#333333] rounded">Auto</button>
            </div>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setBet2Amount(Math.max(10, bet2Amount - 50))}
                className="w-10 h-10 rounded-lg bg-[#333333] text-[#ffffff] font-bold"
              >
                −
              </button>
              <div className="text-2xl font-bold text-[#f5c518] font-mono">{bet2Amount}</div>
              <button
                onClick={() => setBet2Amount(bet2Amount + 50)}
                className="w-10 h-10 rounded-lg bg-[#333333] text-[#ffffff] font-bold"
              >
                +
              </button>
            </div>
            <div className="flex gap-2 mb-3">
              {[100, 250, 1000, 25000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBet2Amount(amount)}
                  className="flex-1 py-1 text-xs font-semibold text-[#ffffff] bg-[#333333] rounded hover:bg-[#444444]"
                >
                  {amount}
                </button>
              ))}
            </div>
            {gameState === "betting" && !currentBet2 ? (
              <button
                onClick={handlePlaceBet2}
                className="w-full py-3 bg-[#00a651] text-[#ffffff] font-bold rounded-lg hover:bg-[#008c45]"
              >
                Bet {bet2Amount} KES
              </button>
            ) : gameState === "flying" && currentBet2 ? (
              <button
                onClick={handleCashout2}
                className="w-full py-3 bg-[#f5c518] text-[#111111] font-bold rounded-lg hover:bg-[#d4a818]"
              >
                Cash Out {(currentBet2.amount * multiplier).toFixed(2)} KES
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 bg-[#333333] text-[#888888] font-bold rounded-lg"
              >
                {gameState === "crashed" ? "Crashed" : currentBet2 ? "Waiting..." : "Betting Closed"}
              </button>
            )}
          </div>
        )}

        {!bet2Enabled && (
          <button
            onClick={() => setBet2Enabled(true)}
            className="w-full py-3 border-2 border-dashed border-[#333333] text-[#888888] font-bold rounded-lg hover:border-[#00a651] hover:text-[#00a651]"
          >
            + Add Bet
          </button>
        )}
      </div>
    </div>
  );
}
