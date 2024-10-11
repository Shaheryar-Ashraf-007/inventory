/*
  Warnings:

  - You are about to drop the column `PetrolExpense` on the `Salaries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Salaries" DROP COLUMN "PetrolExpense",
ADD COLUMN     "petrolExpense" INTEGER DEFAULT 0;
