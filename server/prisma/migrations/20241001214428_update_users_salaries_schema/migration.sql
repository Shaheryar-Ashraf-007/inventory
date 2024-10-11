/*
  Warnings:

  - You are about to drop the `salaries` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- DropTable
DROP TABLE "salaries";

-- CreateTable
CREATE TABLE "Salaries" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "salaryAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salaries_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Salaries_email_key" ON "Salaries"("email");
