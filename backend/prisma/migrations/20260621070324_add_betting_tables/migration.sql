/*
  Warnings:

  - The values [JOB_CREATE,JOB_UPDATE,JOB_DELETE] on the enum `AdminLogAction` will be removed. If these variants are still used in the database, this will fail.
  - The values [JOB,ACHIEVEMENT] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUBSCRIPTION,JOB_COMMISSION,FEATURED_JOB,SPONSORED_LISTING,FREELANCER_UPGRADE,PREMIUM_BADGE] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [JOB_PAYOUT,MILESTONE,DAILY_REWARD] on the enum `WalletTransactionReason` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminLogAction_new" AS ENUM ('USER_BAN', 'USER_UNBAN', 'USER_ACTIVATE', 'USER_DEACTIVATE', 'WITHDRAWAL_APPROVE', 'WITHDRAWAL_REJECT', 'PAYMENT_VERIFY', 'CONTENT_MODERATION', 'SYSTEM_CONFIG', 'OTHER');
ALTER TABLE "AdminLog" ALTER COLUMN "action" TYPE "AdminLogAction_new" USING ("action"::text::"AdminLogAction_new");
ALTER TYPE "AdminLogAction" RENAME TO "AdminLogAction_old";
ALTER TYPE "AdminLogAction_new" RENAME TO "AdminLogAction";
DROP TYPE "public"."AdminLogAction_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('SYSTEM', 'PAYMENT', 'WITHDRAWAL', 'REFERRAL', 'SECURITY', 'BET', 'PROMOTION');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('ACCOUNT_ACTIVATION', 'DEPOSIT', 'ADVERTISING', 'OTHER');
ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "WalletTransactionReason_new" AS ENUM ('DEPOSIT', 'REFERRAL_BONUS', 'WITHDRAWAL', 'ACTIVATION_FEE', 'PLATFORM_FEE', 'ADJUSTMENT', 'BONUS', 'BET', 'WIN', 'TRANSFER', 'OTHER');
ALTER TABLE "WalletTransaction" ALTER COLUMN "reason" TYPE "WalletTransactionReason_new" USING ("reason"::text::"WalletTransactionReason_new");
ALTER TYPE "WalletTransactionReason" RENAME TO "WalletTransactionReason_old";
ALTER TYPE "WalletTransactionReason_new" RENAME TO "WalletTransactionReason";
DROP TYPE "public"."WalletTransactionReason_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promoCodeUsed" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'single',
    "selections" JSONB NOT NULL,
    "stake" DECIMAL(18,2) NOT NULL,
    "totalOdds" DECIMAL(18,2) NOT NULL,
    "potentialWin" DECIMAL(18,2) NOT NULL,
    "actualWin" DECIMAL(18,2),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AviatorRound" (
    "id" TEXT NOT NULL,
    "crashPoint" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AviatorRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AviatorBet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "stake" DECIMAL(18,2) NOT NULL,
    "cashoutMultiplier" DOUBLE PRECISION,
    "winAmount" DECIMAL(18,2),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AviatorBet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "bonusAmount" DECIMAL(18,2) NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 100,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device" TEXT,
    "browser" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "totalWon" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bet_userId_status_idx" ON "Bet"("userId", "status");

-- CreateIndex
CREATE INDEX "Bet_createdAt_idx" ON "Bet"("createdAt");

-- CreateIndex
CREATE INDEX "AviatorRound_createdAt_idx" ON "AviatorRound"("createdAt");

-- CreateIndex
CREATE INDEX "AviatorBet_userId_status_idx" ON "AviatorBet"("userId", "status");

-- CreateIndex
CREATE INDEX "AviatorBet_roundId_idx" ON "AviatorBet"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "PromoCode_code_idx" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "PromoCode_isActive_idx" ON "PromoCode"("isActive");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_loginAt_idx" ON "Session"("loginAt");

-- CreateIndex
CREATE INDEX "Leaderboard_weekStart_idx" ON "Leaderboard"("weekStart");

-- CreateIndex
CREATE INDEX "Leaderboard_totalWon_idx" ON "Leaderboard"("totalWon");

-- CreateIndex
CREATE UNIQUE INDEX "Leaderboard_userId_weekStart_key" ON "Leaderboard"("userId", "weekStart");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AviatorBet" ADD CONSTRAINT "AviatorBet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AviatorBet" ADD CONSTRAINT "AviatorBet_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "AviatorRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
