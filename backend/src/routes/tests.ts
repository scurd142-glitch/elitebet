import express from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tests = await prisma.writingTest.findMany({ orderBy: { createdAt: "desc" } });
    return res.json({ success: true, tests });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(500).json({ success: false, error: "Unable to load tests" });
  }
});

const takeSchema = z.object({ answers: z.array(z.object({ questionId: z.string(), answer: z.string() })) });

router.post("/:id/take", requireAuth, async (req, res) => {
  try {
    const payload = takeSchema.parse(req.body);
    const id = String(req.params.id);
    const test = await prisma.writingTest.findUnique({ where: { id } });
    if (!test) return res.status(404).json({ success: false, error: "Test not found" });

    const questions = test.questions as Array<{ id: string; correctAnswer?: string; weight?: number }>;
    let score = 0;
    questions.forEach((question) => {
      const answer = payload.answers.find((item) => item.questionId === question.id)?.answer?.trim().toLowerCase() ?? "";
      if (question.correctAnswer && answer === String(question.correctAnswer).trim().toLowerCase()) {
        score += Number(question.weight ?? 1);
      }
    });

    const maxScore = questions.reduce((acc, question) => acc + Number(question.weight ?? 1), 0);
    const passed = maxScore > 0 ? score / maxScore >= Number(test.passScore) / 100 : false;
    const userId = (req as AuthRequest).user!.id;
    const result = await prisma.testResult.create({ data: { userId, testId: test.id, score, passed } });
    return res.json({ success: true, result, passed, score, maxScore });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return res.status(400).json({ success: false, error: "Unable to submit test" });
  }
});

export default router;
