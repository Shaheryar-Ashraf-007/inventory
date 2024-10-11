import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req, res) => {
  try {
    const search = req.query.search?.toString() || '';
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params; // Extract ID from request parameters
  console.log("Deleting product with ID:", productId); // Log the ID

  // Check if ID is valid
  if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
  }

  // Proceed with deletion logic...
  try {
      const deletedProduct = await prisma.products.delete({
          where: { productId: productId }, // Ensure this matches your database schema
      });
      res.status(200).json(deletedProduct);
  } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
  }
};