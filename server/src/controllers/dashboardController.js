import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (req, res) => {
  try {
    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    console.log('Popular Products:', popularProducts);

    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log('Sales Summary:', salesSummary);

    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log('Purchase Summary:', purchaseSummary);

    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log('Expense Summary:', expenseSummary);

    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log('Raw Expense By Category Summary:', expenseByCategorySummaryRaw);

    const expenseByCategorySummary = expenseByCategorySummaryRaw.map((item) => ({
      ...item,
      amount: item.amount.toString(),
    }));

    res.json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    });
  } catch (error) {
    console.error("Error in getDashboardMetrics:", error);
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};