import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚠️  WARNING: This will delete ALL users and related data!");
  console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Starting database cleanup...");

  const tables = [
    { name: "WalletTransaction", model: prisma.walletTransaction },
    { name: "Withdrawal", model: prisma.withdrawal },
    { name: "Payment", model: prisma.payment },
    { name: "Wallet", model: prisma.wallet },
    { name: "Referral", model: prisma.referral },
    { name: "Notification", model: prisma.notification },
    { name: "AdminLog", model: prisma.adminLog },
    { name: "SupportTicket", model: prisma.supportTicket },
    { name: "RefreshToken", model: prisma.refreshToken },
    { name: "OtpVerification", model: prisma.otpVerification },
    { name: "UserRole", model: prisma.userRole },
    { name: "User", model: prisma.user },
  ];

  let totalDeleted = 0;

  for (const table of tables) {
    try {
      const result = await table.model.deleteMany({});
      const count = result.count;
      totalDeleted += count;
      if (count > 0) {
        console.log(`✓ Deleted ${count} records from ${table.name}`);
      }
    } catch (error) {
      console.log(`⚠ Skipped ${table.name}: ${(error as Error).message}`);
    }
  }

  console.log(`\n✅ Database cleanup complete! Total records deleted: ${totalDeleted}`);
  console.log("\n💡 Run 'npm run seed' to re-create seed data (admin user, roles, etc.)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during cleanup:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
