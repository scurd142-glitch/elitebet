import {
  PrismaClient,
  JobCategory,
  JobStatus,
  WriterRank,
  AccountStatus,
} from "@prisma/client";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const roles = ["USER", "ADMIN", "MODERATOR", "SUPPORT"];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `Seeded role: ${name}` },
    });
  }

  const achievements = [
    { slug: "first-job", name: "First Assignment", description: "Complete your first job.", xpReward: 50 },
    { slug: "streak-7", name: "Week Warrior", description: "Maintain a 7-day activity streak.", xpReward: 120 },
    { slug: "top-earner", name: "Rising Earner", description: "Reach $100 in verified earnings.", xpReward: 200 },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  const adminEmail = "admin@writersnite.local";
  const passwordHash = await bcrypt.hash("ChangeMeInProduction!1", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      username: "admin",
      passwordHash,
      fullName: "Platform Administrator",
      country: "US",
      accountStatus: AccountStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      referralCode: `ADM${randomBytes(4).toString("hex").toUpperCase()}`,
    },
  });

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "ADMIN" } });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  await prisma.wallet.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id, balance: 0, currency: "USD" },
  });

  await prisma.userGamification.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id, rank: WriterRank.ELITE_WRITER, xpPoints: 0, levelNumeric: 99 },
  });

  await prisma.faq.deleteMany({ where: { category: "seed" } });
  await prisma.faq.createMany({
    data: [
      {
        question: "How do I activate my WRITERSNITE account?",
        answer:
          "After registration, pay the one-time activation fee via Paystack (M-Pesa or Card), Stripe, or PayPal. Your account unlocks immediately after payment confirmation.",
        category: "seed",
        sortOrder: 1,
      },
      {
        question: "How do withdrawals work?",
        answer:
          "Request a payout from your wallet. Our team reviews fraud signals, then we release funds via Paystack, PayPal, or bank transfer where supported.",
        category: "seed",
        sortOrder: 2,
      },
    ],
  });

  const sampleTitle = "Sample SEO Article (Internal QA)";
  const existingJob = await prisma.job.findFirst({ where: { title: sampleTitle } });
  if (!existingJob) {
    await prisma.job.create({
      data: {
        title: sampleTitle,
        description: "Seed job for local development. Replace in production admin workflows.",
        category: JobCategory.ARTICLE_WRITING,
        budget: 45,
        currency: "USD",
        status: JobStatus.OPEN,
        featured: false,
        sponsored: false,
        createdById: adminUser.id,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seed completed: roles, achievements, admin user, FAQ, sample job.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
