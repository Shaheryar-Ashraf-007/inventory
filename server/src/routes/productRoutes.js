import { Router } from "express";
import { createProduct, deleteProduct, getProducts } from "../controllers/productController.js";

const router = Router();

// GET all products
router.get("/", getProducts);

// POST create a new product
router.post("/", createProduct);

// DELETE a product by ID
router.delete("/:productId", deleteProduct);
export default router;