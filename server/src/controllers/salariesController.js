import { PrismaClient } from "@prisma/client";

// Reuse PrismaClient instance across the application
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable detailed logging for debugging
});

// Get Salaries
export const getSalaries = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';
    
    // Fetch salaries with optional search filter
    const salaries = await prisma.salaries.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    
    res.json(salaries);
  } catch (error) {
    console.error("Error retrieving salaries:", error);
    res.status(500).json({ message: "Error retrieving salaries", error: error.message });
  }
};

// Create Salary
export const createSalaries = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      salaryAmount,
      paidAmount,
      remainingAmount,
      startDate,
      endDate,
      timeStamp,
      petrolExpense,
      otherExpense,
    } = req.body;

    // Log incoming data for debugging
    console.log("Received data:", req.body);

    // Validate required fields
    if (!name || !email || !salaryAmount) {
      return res.status(400).json({ message: "Name, email, and salary amount are required" });
    }

    // Create new salary record
    const newSalary = await prisma.salaries.create({
      data: {
        name,
        email,
        phoneNumber,
        salaryAmount,
        paidAmount: paidAmount || 0,
        remainingAmount: remainingAmount || salaryAmount - (paidAmount || 0),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        timestamp: timeStamp || new Date().toISOString(),
        petrolExpense: petrolExpense || 0,
        otherExpense: otherExpense || 0,
      },
    });

    res.status(201).json(newSalary);
  } catch (error) {
    console.error("Error creating salary:", error);
    res.status(500).json({ message: "Error creating salary", error: error.message });
  }
};

// Delete Salary
export const deleteSalaries = async (req, res) => {
  const { userId } = req.params;
  console.log("Attempting to delete salary with ID:", userId);

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // First check if the salary exists
    const existingSalary = await prisma.salaries.findUnique({
      where: {
        userId: userId // Make sure this matches your schema's field name
      }
    });

    if (!existingSalary) {
      return res.status(404).json({
        message: `Salary with ID ${userId} not found`
      });
    }

    // Delete the salary
    const deletedSalary = await prisma.salaries.delete({
      where: {
        userId: userId // Make sure this matches your schema's field name
      }
    });

    console.log("Successfully deleted salary:", deletedSalary);
    res.status(200).json({
      message: "Salary deleted successfully",
      data: deletedSalary
    });

  } catch (error) {
    console.error("Error deleting salary:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return res.status(404).json({
        message: "Record to delete does not exist",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Failed to delete salary",
      error: error.message
    });
  }
};