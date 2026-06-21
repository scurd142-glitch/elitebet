import { Router } from "express";
import { requireAuth, type AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { toNumber } from "../utils/money";

const router = Router();

router.get("/mine", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthRequest).user!.id;

    const [sportsBets, aviatorBets] = await Promise.all([
      prisma.bet.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.aviatorBet.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { round: true },
      }),
    ]);

    const formattedSports = sportsBets.map((b) => ({
      id: b.id,
      type: b.type,
      gameType: "sports",
      selections: b.selections,
      stake: toNumber(b.stake),
      totalOdds: toNumber(b.totalOdds),
      potentialWin: toNumber(b.potentialWin),
      actualWin: b.actualWin ? toNumber(b.actualWin) : 0,
      status: b.status,
      createdAt: b.createdAt.toISOString(),
    }));

    const formattedAviator = aviatorBets.map((b) => ({
      id: b.id,
      type: "single",
      gameType: "aviator",
      selections: [
        {
          match: `Aviator Round`,
          selection: b.cashoutMultiplier
            ? `Cashout @ ${Number(b.cashoutMultiplier).toFixed(2)}x`
            : b.status === "crashed"
              ? "Crashed"
              : "Active",
          odds: b.cashoutMultiplier ? Number(b.cashoutMultiplier) : 0,
        },
      ],
      stake: toNumber(b.stake),
      totalOdds: b.cashoutMultiplier ? Number(b.cashoutMultiplier) : 0,
      potentialWin: b.winAmount ? toNumber(b.winAmount) : 0,
      actualWin: b.winAmount ? toNumber(b.winAmount) : 0,
      status:
        b.status === "cashed_out"
          ? "won"
          : b.status === "crashed"
            ? "lost"
            : "pending",
      createdAt: b.createdAt.toISOString(),
    }));

    const bets = [...formattedSports, ...formattedAviator].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.json({ success: true, data: { bets } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: { message: "Failed to load bets" } });
  }
});

export default router;
