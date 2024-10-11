"use client";

import React from 'react';
import { useGetProductsQuery } from "@/state/api";
import Header from "@/app/[components]/Header";
import { DataGrid } from "@mui/x-data-grid";
import { ErrorBoundary } from 'react-error-boundary';

const columns = [
  { field: "serialNo", headerName: "S.No", width: 70 },
  { field: "productId", headerName: "ID", width: 220 },
  { field: "name", headerName: "Product Name", width: 200 },
  { field: "price", headerName: "Price", width: 110 },
  { field: "rating", headerName: "Rating", width: 110 },
  { field: "stockQuantity", headerName: "Stock Quantity", width: 150 },
  { field: "category", headerName: "Category", width: 150 }, // Added category column
];

const ErrorFallback = ({ error }) => (
  <div className="text-center text-red-500 py-4">
    Error: {error.message}
  </div>
);

const LoadingComponent = () => (
  <div className="py-4 text-center">Loading...</div>
);

const ErrorComponent = () => (
  <div className="text-center text-red-500 py-4">
    Failed to fetch products
  </div>
);

const DataGridComponent = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <>
      <DataGrid
        rows={products}
        columns={columns}
        getRowId={(row) => row.productId}
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
      <InventorySummary products={products} />
    </>
  );
};

const InventorySummary = ({ products }) => {
  const totalAmount = products.reduce((sum, product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.stockQuantity) || 0;
    return sum + (price * quantity);
  }, 0);

  // Calculate category-wise summary
  const categorySummary = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = { totalAmount: 0, stockQuantity: 0 };
    }
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.stockQuantity) || 0;
    acc[category].totalAmount += price * quantity;
    acc[category].stockQuantity += quantity;
    return acc;
  }, {});

  // Calculate monthly summary (assuming products have a 'createdAt' field)
  const monthlySummary = products.reduce((acc, product) => {
    const createdAt = product.createdAt ? new Date(product.createdAt) : new Date();
    const month = createdAt.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    const price = parseFloat(product.price) || 0;
    const quantity = parseInt(product.stockQuantity) || 0;
    acc[month] += price * quantity;
    return acc;
  }, {});

  return (
    <div className="mt-8">
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Inventory Summary</h2>
        <div className="text-right font-bold mb-4">
          Total Inventory Amount: Rs {totalAmount.toFixed(2)}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Product-wise Amount:</h3>
          <ul className="list-disc list-inside">
            {products.map((product) => {
              const price = parseFloat(product.price) || 0;
              const quantity = parseInt(product.stockQuantity) || 0;
              const productAmount = (price * quantity).toFixed(2);
              return (
                <li key={product.productId}>
                  {product.name}: Rs {productAmount}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Category-wise Summary</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Category</th>
              <th className="px-4 py-2 text-left text-gray-600">Stock Quantity</th>
              <th className="px-4 py-2 text-left text-gray-600">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categorySummary).map(([name, { stockQuantity, totalAmount }]) => (
              <tr key={name} className="hover:bg-gray-100">
                <td className="px-4 py-2">{name}</td>
                <td className="px-4 py-2">{stockQuantity}</td>
                <td className="px-4 py-2">Rs {totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Summary</h2>
        <ul className="list-disc pl-5">
          {Object.entries(monthlySummary).map(([month, amount]) => (
            <li key={month} className="flex justify-between">
              <span className="text-gray-600">{month}</span>
              <span className="font-bold">Rs {amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { data: rawProducts, isError, isLoading } = useGetProductsQuery();

  const products = React.useMemo(() => {
    if (!rawProducts) return [];
    return rawProducts.map((product, index) => ({
      serialNo: index + 1,
      productId: product.productId || product.id || product._id,
      name: product.name || 'No Name',
      price: product.price != null ? product.price : 'N/A',
      rating: product.rating != null ? product.rating : 'N/A',
      stockQuantity: product.stockQuantity != null ? product.stockQuantity : 'N/A',
      category: product.name || 'Uncategorized', // Added category field
      createdAt: product.createdAt || new Date().toISOString(), // Added createdAt field
    }));
  }, [rawProducts]);

  console.log('Products:', products); // For debugging

  if (isLoading) return <LoadingComponent />;
  if (isError || !products) return <ErrorComponent />;

  return (
    <div className="flex flex-col">
      <Header name="Inventory" />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DataGridComponent products={products} />
      </ErrorBoundary>
    </div>
  );
};

export default Inventory;