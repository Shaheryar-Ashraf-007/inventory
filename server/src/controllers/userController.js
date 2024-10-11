import { PrismaClient } from "@prisma/client";

// Reuse PrismaClient instance across the application
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable detailed logging for debugging
});

// Get Users
export const getUsers = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';
    
    // Fetch users with optional search filter
    const users = await prisma.users.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive', // Optional: case insensitive search
        },
      },
    });
    
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
};

// Create User
export const createUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      paidAmount,
      unitCost,
      quantity,
      remainingAmount,
      timestamp,
    } = req.body;

    // Log incoming data for debugging
    console.log("Received data:", req.body);

    // Validate required fields
    if (!name || !email || !paidAmount) {
      return res.status(400).json({ message: "Name, email, and paid amount are required" });
    }

    const calculatedTotalAmount = parseFloat(unitCost) * parseFloat(quantity);
    const calculatedRemainingAmount = calculatedTotalAmount - parseFloat(paidAmount || 0);

    // Create new user record
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        phoneNumber,
        paidAmount: parseFloat(paidAmount || 0),
        unitCost: parseFloat(unitCost),
        quantity: parseInt(quantity),
        totalAmount: calculatedTotalAmount,
        remainingAmount: calculatedRemainingAmount,
        timestamp: timestamp || new Date().toISOString(),
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Add a Different Email:", error);
    res.status(500).json({ message: "Add a different Email", error: error.message });
  }
};

// Delete User
export const deleteUsers = async (req, res) => {
  const { userId } = req.params; // Ensure your routing is set to pass userId in params
  console.log("Attempting to delete user with ID:", userId);

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // First check if the user exists
    const existingUser = await prisma.users.findUnique({
      where: {
        userId: userId, // Ensure this matches your schema's field name
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        message: `User with ID ${userId} not found`,
      });
    }

    // Delete the user
    const deletedUser = await prisma.users.delete({
      where: {
        userId: userId, // Ensure this matches your schema's field name
      }
    });

    console.log("Successfully deleted user:", deletedUser);
    res.status(200).json({
      message: "User deleted successfully",
      data: deletedUser,
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2025') {
      return res.status(404).json({
        message: "Record to delete does not exist",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};