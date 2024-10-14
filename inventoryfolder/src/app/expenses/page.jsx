"use client";

import React, { useState } from 'react';
import { useGetExpensesByCategoryQuery, useCreateExpenseMutation, useDeleteExpenseMutation } from '@/state/api';
import Header from "@/app/[components]/Header";
import CreateExpenseModal from './CreateExpenseModal.jsx';
import { DataGrid } from "@mui/x-data-grid";
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

const columns = (handleDeleteExpense) => [
  { field: "serial", headerName: "S.No", width: 70 },
  { field: "expenseId", headerName: "ID", width: 220 },
  { field: "category", headerName: "Category", width: 200 },
  { field: "amount", headerName: "Amount", width: 110, type: 'number' },
  { field: "timestamp", headerName: "Date/Time", width: 180 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <Button 
        className='bg-red-500 text-white'
        onClick={() => handleDeleteExpense(params.row.expenseId)}
      >
        Delete
      </Button>
    ),
  },
];

const Expenses = () => {
  const { data: rawExpenses, isError, isLoading, error, refetch } = useGetExpensesByCategoryQuery();
  const [createExpense] = useCreateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateExpense = async (expenseData) => {
    try {
      console.log("Creating expense with data:", expenseData);
      await createExpense(expenseData).unwrap();
      setIsModalOpen(false);
      setErrorMessage("");
      refetch();
    } catch (error) {
      console.error("Failed to create expense:", error);
      setErrorMessage("Failed to create expense");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(expenseId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete expense:", error);
        if (error.status === 404) {
          setErrorMessage("Expense not found. It may have already been deleted.");
        } else {
          setErrorMessage("Failed to delete expense. Please try again.");
        }
      }
    }
  };

  const expenses = React.useMemo(() => {
    if (!rawExpenses || !Array.isArray(rawExpenses)) return [];
    return rawExpenses.map((expense, index) => ({
      serial: index + 1,
      expenseId: expense.expenseId || expense.id || expense._id,
      category: expense.category || 'Uncategorized',
      amount: expense.amount != null ? expense.amount : 0,
      timestamp: expense.timestamp ? new Date(expense.timestamp).toLocaleString() : 'N/A',
    }));
  }, [rawExpenses]);

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryWiseTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = new Date(expense.timestamp).toLocaleString('default', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "Expenses.xlsx");
  };

  const LoadingComponent = () => (
    <div className="py-4 text-center">Loading...</div>
  );

  const ErrorComponent = ({ error }) => (
    <div className="text-center text-red-500 py-4">
      Failed to fetch expenses: {error.message}
    </div>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent error={error} />;

  return (
    <div className="flex flex-col p-4">
      <Header name="Expenses" />
      <div className="flex justify-between mb-4">
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Create Expense
        </Button>
        <button
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
      <ErrorBoundary FallbackComponent={({ error }) => <div>Error: {error.message}</div>}>
        {expenses.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No expenses found. Create a new expense to get started.
          </div>
        ) : (
          <DataGrid
            rows={expenses}
            columns={columns(handleDeleteExpense)} 
            getRowId={(row) => row.expenseId}
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          />
        )}
      </ErrorBoundary>

      <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Total Expenses</h2>
        <p className="text-lg font-bold text-green-600">Rs {totalAmount.toFixed(2)}</p>
      </div>

      {Object.keys(categoryWiseTotals).length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Category-wise Totals</h2>
          <ul className="list-disc pl-5">
            {Object.entries(categoryWiseTotals).map(([category, amount]) => (
              <li key={category} className="flex justify-between">
                <span className="text-gray-600">{category}</span>
                <span className="font-bold">Rs {amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(monthlyTotals).length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Summary</h2>
          <ul className="list-disc pl-5">
            {Object.entries(monthlyTotals).map(([month, amount]) => (
              <li key={month} className="flex justify-between">
                <span className="text-gray-600">{month}</span>
                <span className="font-bold">Rs {amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CreateExpenseModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateExpense} 
      />
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default Expenses;