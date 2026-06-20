import { PrismaClient, AccountStatus } from "@prisma/client";
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

  const adminEmail = "admin@elitebet.local";
  const passwordHash = await bcrypt.hash("ChangeMeInProduction!1", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      username: "admin",
      passwordHash,
      fullName: "Platform Administrator",
      country: "KE",
      phone: "254700000000",
      accountStatus: AccountStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      isVerified: true,
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
    create: { userId: adminUser.id, balance: 0, currency: "KES" },
  });

  await prisma.faq.deleteMany({ where: { category: "seed" } });
  await prisma.faq.createMany({
    data: [
      {
        question: "How do I deposit on EliteBet?",
        answer:
          "Go to Wallet or tap Deposit. Enter an amount (minimum KES 50) and pay via M-Pesa Paystack. Your balance updates after payment confirmation.",
        category: "seed",
        sortOrder: 1,
      },
      {
        question: "Can I withdraw my balance?",
        answer:
          "Withdrawals are not available on EliteBet. Deposited funds are used for simulation betting and entertainment only.",
        category: "seed",
        sortOrder: 2,
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log("Seed completed: roles, admin user, FAQ.");
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
