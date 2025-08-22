-- AlterTable
ALTER TABLE "Debt" ADD COLUMN     "approachingAlertSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dueAlertSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SupplierDebt" ADD COLUMN     "approachingAlertSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dueAlertSent" BOOLEAN NOT NULL DEFAULT false;
