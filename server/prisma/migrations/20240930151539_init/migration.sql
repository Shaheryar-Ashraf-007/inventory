/*
  Warnings:

  - The primary key for the `ExpenseByCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ExpenseByCategory` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `ExpenseByCategory` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.
  - The primary key for the `ExpenseSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ExpenseSummary` table. All the data in the column will be lost.
  - The primary key for the `Purchase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Purchase` table. All the data in the column will be lost.
  - The primary key for the `PurchaseSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PurchaseSummary` table. All the data in the column will be lost.
  - The primary key for the `Sale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Sale` table. All the data in the column will be lost.
  - The primary key for the `SalesSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SalesSummary` table. All the data in the column will be lost.
  - You are about to drop the `Expense` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Salary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - The required column `expenseByCategoryId` was added to the `ExpenseByCategory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `expenseSummaryId` was added to the `ExpenseSummary` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `purchaseId` was added to the `Purchase` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `totalCost` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - The required column `purchaseSummaryId` was added to the `PurchaseSummary` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `saleId` was added to the `Sale` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `salesSummaryId` was added to the `SalesSummary` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "ExpenseByCategory" DROP CONSTRAINT "ExpenseByCategory_expenseSummaryId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_productId_fkey";

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_productId_fkey";

-- AlterTable
ALTER TABLE "ExpenseByCategory" DROP CONSTRAINT "ExpenseByCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "expenseByCategoryId" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE BIGINT,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "ExpenseByCategory_pkey" PRIMARY KEY ("expenseByCategoryId");

-- AlterTable
ALTER TABLE "ExpenseSummary" DROP CONSTRAINT "ExpenseSummary_pkey",
DROP COLUMN "id",
ADD COLUMN     "expenseSummaryId" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "ExpenseSummary_pkey" PRIMARY KEY ("expenseSummaryId");

-- AlterTable
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_pkey",
DROP COLUMN "id",
ADD COLUMN     "purchaseId" TEXT NOT NULL,
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchaseId");

-- AlterTable
ALTER TABLE "PurchaseSummary" DROP CONSTRAINT "PurchaseSummary_pkey",
DROP COLUMN "id",
ADD COLUMN     "purchaseSummaryId" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "PurchaseSummary_pkey" PRIMARY KEY ("purchaseSummaryId");

-- AlterTable
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_pkey",
DROP COLUMN "id",
ADD COLUMN     "saleId" TEXT NOT NULL,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Sale_pkey" PRIMARY KEY ("saleId");

-- AlterTable
ALTER TABLE "SalesSummary" DROP CONSTRAINT "SalesSummary_pkey",
DROP COLUMN "id",
ADD COLUMN     "salesSummaryId" TEXT NOT NULL,
ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "SalesSummary_pkey" PRIMARY KEY ("salesSummaryId");

-- DropTable
DROP TABLE "Expense";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Salary";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "salaries" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Products" (
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION,
    "stockQuantity" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "expenseId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("expenseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "salaries_email_key" ON "salaries"("email");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseByCategory" ADD CONSTRAINT "ExpenseByCategory_expenseSummaryId_fkey" FOREIGN KEY ("expenseSummaryId") REFERENCES "ExpenseSummary"("expenseSummaryId") ON DELETE RESTRICT ON UPDATE CASCADE;
