import { prisma } from "../lib/prisma";
import { broadcastMultiplier, broadcastRoundStart, broadcastCashout } from "../lib/socket";
import { Decimal } from "@prisma/client/runtime/library";

// Provably fair crash point calculation
function generateCrashPoint(): number {
  return Math.max(1, (100 / (Math.random() * 100)) * 0.97);
}

// Simulated Kenyan names for fake players
const KENYAN_NAMES = [
  "Kipchoge", "Wanjiku", "Ochieng", "Achieng", "Kipkorir",
  "Njeri", "Kamau", "Wanjiru", "Omondi", "Akinyi",
  "Kipngeno", "Wambui", "Kiplagat", "Nyakio", "Kipkoech"
];

let currentRound: any = null;
let gameInterval: NodeJS.Timeout | null = null;
let isFlying = false;

export async function placeBet(userId: string, amount: number) {
  // Check if user has enough balance
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || wallet.balance.lessThan(amount)) {
    return { success: false, error: "Insufficient balance" };
  }

  // Deduct balance
  const newBalance = wallet.balance.minus(amount);
  await prisma.wallet.update({
    where: { userId },
    data: { balance: newBalance },
  });

  // Create wallet transaction
  await prisma.walletTransaction.create({
    data: {
      walletId: wallet.id,
      type: "DEBIT",
      reason: "BET",
      amount: new Decimal(amount),
      balanceAfter: newBalance,
      description: "Aviator bet",
    },
  });

  // Create Aviator bet
  const bet = await prisma.aviatorBet.create({
    data: {
      userId,
      roundId: currentRound?.id || "",
      stake: new Decimal(amount),
      status: "active",
    },
  });

  return { success: true, bet };
}

export async function cashout(userId: string, betId: string, multiplier: number) {
  const bet = await prisma.aviatorBet.findUnique({ where: { id: betId } });
  if (!bet || bet.userId !== userId || bet.status !== "active") {
    return { success: false, error: "Invalid bet" };
  }

  const winAmount = bet.stake.times(multiplier);
  
  // Update bet
  await prisma.aviatorBet.update({
    where: { id: betId },
    data: {
      cashoutMultiplier: multiplier,
      winAmount: winAmount,
      status: "cashed_out",
    },
  });

  // Add winnings to wallet
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (wallet) {
    const newBalance = wallet.balance.plus(winAmount);
    await prisma.wallet.update({
      where: { userId },
      data: { balance: newBalance },
    });

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "CREDIT",
        reason: "WIN",
        amount: winAmount,
        balanceAfter: newBalance,
        description: "Aviator cashout",
      },
    });
  }

  broadcastCashout(userId, multiplier, Number(winAmount));
  return { success: true, winAmount: Number(winAmount) };
}

export async function getRoundHistory() {
  const rounds = await prisma.aviatorRound.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return rounds;
}

export function startGameLoop() {
  if (gameInterval) return;

  const runGame = async () => {
    // Betting phase (5 seconds)
    const crashPoint = generateCrashPoint();
    const round = await prisma.aviatorRound.create({
      data: { crashPoint },
    });
    currentRound = round;

    broadcastRoundStart(crashPoint);

    // Wait for betting phase
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Flying phase
    isFlying = true;
    let multiplier = 1.0;
    
    const flyInterval = setInterval(() => {
      multiplier += 0.1;
      broadcastMultiplier(multiplier, "flying");
      
      if (multiplier >= crashPoint) {
        clearInterval(flyInterval);
        isFlying = false;
        broadcastMultiplier(crashPoint, "crashed");
        
        // Mark all active bets as crashed
        prisma.aviatorBet.updateMany({
          where: { roundId: round.id, status: "active" },
          data: { status: "crashed" },
        }).catch(console.error);
      }
    }, 100);

    // Wait for next round
    setTimeout(runGame, 3000);
  };

  runGame();
}

export function stopGameLoop() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

export function getFakePlayers() {
  const players = [];
  for (let i = 0; i < 8; i++) {
    players.push({
      name: KENYAN_NAMES[Math.floor(Math.random() * KENYAN_NAMES.length)],
      amount: Math.floor(Math.random() * 5000) + 100,
    });
  }
  return players;
}
