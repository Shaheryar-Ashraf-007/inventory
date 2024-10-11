/*
  Warnings:

  - Added the required column `otherExpense` to the `Salaries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Salaries" ADD COLUMN     "PetrolExpense" INTEGER,
ADD COLUMN     "otherExpense" TEXT NOT NULL;
