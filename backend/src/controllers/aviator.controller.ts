import { prisma } from "../lib/prisma";
import { broadcastMultiplier, broadcastGamePhase } from "../lib/socket";
import { Decimal } from "@prisma/client/runtime/library";

const KENYAN_NAMES = [
  "Kipchoge", "Wanjiku", "Ochieng", "Achieng", "Kipkorir",
  "Njeri", "Kamau", "Wanjiru", "Omondi", "Akinyi",
  "Kipngeno", "Wambui", "Kiplagat", "Nyakio", "Kipkoech",
];

export function generateCrashPoint(): number {
  const r = Math.random();
  if (r < 0.01) return 1.0;
  const crash = Math.max(1.0, ((100 / (1 - r)) * 0.97) / 100);
  return Math.round(crash * 100) / 100;
}

let currentRound: { id: string; crashPoint: number } | null = null;
let gamePhase: "betting" | "flying" | "crashed" = "betting";
let gameLoopRunning = false;
let currentMultiplier = 1.0;

export function getGameState() {
  return {
    phase: gamePhase,
    roundId: currentRound?.id ?? null,
    multiplier: currentMultiplier,
    countdown: gamePhase === "betting" ? 5 : 0,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function placeBet(userId: string, amount: number) {
  if (gamePhase !== "betting" || !currentRound) {
    return { success: false, error: "Betting is closed for this round" };
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || wallet.balance.lessThan(amount)) {
    return { success: false, error: "Insufficient balance" };
  }

  const newBalance = wallet.balance.minus(amount);
  await prisma.wallet.update({ where: { userId }, data: { balance: newBalance } });

  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: "DEBIT",
      reason: "BET",
      amount: new Decimal(amount),
      balanceAfter: newBalance,
      actorUserId: userId,
      description: "Aviator bet",
    },
  });

  const bet = await prisma.aviatorBet.create({
    data: {
      userId,
      roundId: currentRound.id,
      stake: new Decimal(amount),
      status: "active",
    },
  });

  return { success: true, bet: { id: bet.id, stake: amount, roundId: currentRound.id } };
}

export async function cashout(userId: string, betId: string, multiplier: number) {
  if (gamePhase !== "flying") {
    return { success: false, error: "Cannot cash out now" };
  }

  const bet = await prisma.aviatorBet.findUnique({ where: { id: betId } });
  if (!bet || bet.userId !== userId || bet.status !== "active") {
    return { success: false, error: "Invalid bet" };
  }

  const winAmount = bet.stake.times(multiplier);

  await prisma.aviatorBet.update({
    where: { id: betId },
    data: {
      cashoutMultiplier: multiplier,
      winAmount,
      status: "cashed_out",
    },
  });

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (wallet) {
    const newBalance = wallet.balance.plus(winAmount);
    await prisma.wallet.update({ where: { userId }, data: { balance: newBalance } });
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "CREDIT",
        reason: "WIN",
        amount: winAmount,
        balanceAfter: newBalance,
        actorUserId: userId,
        description: `Aviator cashout @ ${multiplier.toFixed(2)}x`,
      },
    });
  }

  return { success: true, winAmount: Number(winAmount) };
}

export async function getRoundHistory() {
  return prisma.aviatorRound.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

export function startGameLoop() {
  if (gameLoopRunning) return;
  gameLoopRunning = true;

  const runRound = async () => {
    const crashPoint = generateCrashPoint();
    const round = await prisma.aviatorRound.create({ data: { crashPoint } });
    currentRound = { id: round.id, crashPoint };
    gamePhase = "betting";
    currentMultiplier = 1.0;

    broadcastGamePhase({ phase: "betting", roundId: round.id, countdown: 5, multiplier: 1.0 });

    for (let c = 5; c > 0; c--) {
      broadcastGamePhase({ phase: "betting", roundId: round.id, countdown: c, multiplier: 1.0 });
      await sleep(1000);
    }

    gamePhase = "flying";
    currentMultiplier = 1.0;
    broadcastGamePhase({ phase: "flying", roundId: round.id, multiplier: 1.0 });

    while (currentMultiplier < crashPoint) {
      await sleep(100);
      currentMultiplier = Math.round((currentMultiplier + 0.01) * 100) / 100;
      broadcastMultiplier(currentMultiplier, "flying");
    }

    gamePhase = "crashed";
    currentMultiplier = crashPoint;
    broadcastMultiplier(crashPoint, "crashed");
    broadcastGamePhase({ phase: "crashed", roundId: round.id, crashPoint, multiplier: crashPoint });

    await prisma.aviatorBet.updateMany({
      where: { roundId: round.id, status: "active" },
      data: { status: "crashed" },
    });

    await sleep(2000);
    runRound();
  };

  runRound().catch((err) => {
    console.error("Aviator game loop error:", err);
    gameLoopRunning = false;
  });
}

export function getFakePlayers() {
  return Array.from({ length: 12 }, () => ({
    name: KENYAN_NAMES[Math.floor(Math.random() * KENYAN_NAMES.length)],
    phone: `07${Math.floor(Math.random() * 9)}${Math.random().toString().slice(2, 5)}****${Math.floor(Math.random() * 900 + 100)}`,
    amount: Math.floor(Math.random() * 5000) + 100,
    cashoutMultiplier: Math.random() > 0.55 ? Number((Math.random() * 8 + 1.1).toFixed(2)) : null,
    winAmount: 0,
  })).map((p) => ({
    ...p,
    winAmount: p.cashoutMultiplier ? Math.round(p.amount * p.cashoutMultiplier) : 0,
  }));
}
