"use client";

import { useCreateProductsMutation, useGetProductsQuery, useDeleteProductMutation } from "@/state/api.js"; 
import { PlusCircleIcon, SearchIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/[components]/Header";
import Ratings from "@/app/[components]/Ratings";
import CreateProductModal from "./CreateProductModal";
import * as XLSX from 'xlsx';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: products, isLoading, isError, refetch } = useGetProductsQuery(searchTerm);
  const [createProduct, { isError: createProductError }] = useCreateProductsMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData) => {
    setIsCreatingProduct(true);
    try {
      await createProduct(productData).unwrap();
      setIsModalOpen(false);
      setErrorMessage("");
      refetch(); 
    } catch (error) {
      console.error("Failed to create product:", error);
      setErrorMessage("Failed to create product");
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      setErrorMessage("Invalid product ID");
      return;
    }
  
    try {
      setDeletingProductId(productId);
      console.log('Attempting to delete product with ID:', productId);
      await deleteProduct(productId).unwrap();
      console.log("delete successfully")
      refetch();
      setErrorMessage(""); 
    } catch (error) {
      console.error('Delete error details:', error);
      setErrorMessage(error?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingProductId(false);
    }
  };

  // Excel export function
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Products.xlsx");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="py-4 text-center text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500 py-4">
          Failed to fetch products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-300 rounded-lg shadow-md overflow-hidden bg-white">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <div className="flex space-x-2">
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            onClick={() => setIsModalOpen(true)}
            disabled={isCreatingProduct}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" /> 
            {isCreatingProduct ? 'Creating...' : 'Create Product'}
          </button>
          <button
            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            onClick={exportToExcel}
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            No products found. Try a different search term or create a new product.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className="border rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <div className="flex flex-col items-center">
                <h3 className="text-lg text-gray-900 font-semibold mt-3">{product.name}</h3>
                <p className="text-gray-800 text-xl font-semibold">Rs {product.price.toFixed(2)}</p>
                <div className="text-sm text-gray-600 mt-1">
                  Stock: {product.stockQuantity}
                </div>
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <Ratings rating={product.rating} />
                  </div>
                )}
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteProduct(product.productId)}
                  disabled={deletingProductId === product.productId}
                  className={`mt-4 flex items-center ${
                    deletingProductId === product.productId
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white font-bold py-2 px-4 rounded-lg transition duration-300`}
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  {deletingProductId === product.productId ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
        isCreating={isCreatingProduct}
        error={createProductError}
      />
    </div>
  );
};

export default Products;