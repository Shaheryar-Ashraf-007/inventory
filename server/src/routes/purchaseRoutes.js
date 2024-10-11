import { Router } from "express";
import { createPurchase, deletePurchase, getPurchases } from "../controllers/productController.js";

const router = Router();

// GET all products
router.get("/", getPurchases);

// POST create a new product
router.post("/", createPurchase);

// DELETE a product by ID
router.delete("/:purchaseId", deletePurchase);
export default router;