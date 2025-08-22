-- AlterTable
ALTER TABLE "TransactionItem" ADD COLUMN     "hasWarranty" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "warrantyDescription" TEXT,
ADD COLUMN     "warrantyDurationMonths" INTEGER,
ADD COLUMN     "warrantyEndDate" TIMESTAMP(3),
ADD COLUMN     "warrantyStartDate" TIMESTAMP(3);
