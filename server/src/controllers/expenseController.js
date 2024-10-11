import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpensesByCategory = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';

    const expenses = await prisma.expenses.findMany({
      where: {
        category: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }

    res.json(expenses);
  } catch (error) {
    console.error("Error retrieving expenses:", error.message);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { category, amount, timestamp } = req.body; // Removed expenseId

    // Validate required fields
    if (!category || amount == null) {
      return res.status(400).json({ message: "Category and amount are required" });
    }

    const expense = await prisma.expenses.create({
      data: {
        category,
        amount: parseFloat(amount), // Ensure amount is a number
        timestamp: timestamp || new Date(), // Default to now if not provided
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error.message);
    res.status(500).json({ message: "Error creating expense" });
  }
};

export const deleteExpense = async (req, res) => {
  const { expenseId } = req.params; 
  console.log("Deleting expense with ID:", expenseId); 

  if (!expenseId) {
      return res.status(400).json({ message: "Expense ID is required" });
  }

  try {
      const deletedExpense = await prisma.expenses.delete({
          where: { expenseId: expenseId }, // Ensure this matches your database schema
      });
      res.status(200).json(deletedExpense);
  } catch (error) {
      console.error("Error deleting expense:", error.message);
      // Handle specific error cases
      if (error.code === 'P2025') {
          return res.status(404).json({ message: "Expense not found" });
      }
      res.status(500).json({ message: "Failed to delete expense" });
  }
};