import { Router } from "express";
import { createExpense, deleteExpense, getExpensesByCategory } from "../controllers/expenseController";

const router = Router();

router.get("/", getExpensesByCategory);

router.post("/", createExpense);

// DELETE a product by ID
router.delete("/:expenseId", deleteExpense);

export default router;