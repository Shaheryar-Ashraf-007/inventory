"use client";

import React, { useState, useMemo } from 'react';
import { useGetUsersQuery, useCreateUsersMutation, useDeleteUsersMutation } from '@/state/api.js';
import Header from "@/app/[components]/Header";
import CreateUsersModal from './CreateUsersModal.jsx';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

const Users = () => {
  const { data: rawUsers, isError, isLoading, error, refetch } = useGetUsersQuery();
  const [createUsers] = useCreateUsersMutation();
  const [deleteUsers] = useDeleteUsersMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const columns = useMemo(() => [
    { field: "serial", headerName: "S.No", width: 70, sortable: false },
    { field: "userId", headerName: "ID", width: 220, sortable: true },
    { field: "name", headerName: "Employee Name", width: 200, sortable: true },
    { field: "email", headerName: "Email", width: 220, sortable: true },
    { field: "phoneNumber", headerName: "Phone Number", width: 150, sortable: true },
    { field: "unitCost", headerName: "Unit Cost", width: 150, sortable: true },
    { field: "quantity", headerName: "Quantity", width: 180, sortable: true },
    { field: "paidAmount", headerName: "Paid Amount", width: 150, sortable: true },
    { field: "remainingAmount", headerName: "Remaining Amount", width: 180, sortable: true },
    { field: "timestamp", headerName: "Date/Time", width: 180, sortable: true },
    { field: "totalAmount", headerName: "Total Amount", width: 180, sortable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button 
          className='text-blue-500'
          onClick={() => handleDeleteUsers(params.row.userId)}
        >
          Delete
        </button>
      ),
    },
  ], []);

  const users = useMemo(() => {
    if (!rawUsers) return [];
    return rawUsers.map((user, index) => ({
      serial: index + 1,
      userId: user.userId || 'N/A',
      name: user.name || 'N/A',
      email: user.email ?? "N/A",
      phoneNumber: user.phoneNumber ?? "N/A",
      unitCost: user.unitCost ?? "N/A",
      quantity: user.quantity ?? 'N/A',
      paidAmount: user.paidAmount ?? "N/A",
      remainingAmount: user.remainingAmount ?? "N/A",
      totalAmount: user.totalAmount ?? "N/A",
      timestamp: user.timestamp ? new Date(user.timestamp).toLocaleString() : 'N/A',
    }));
  }, [rawUsers]);

  // Calculate overall summary totals
  const summaryData = useMemo(() => {
    if (!users?.length) return null;

    return users.reduce((acc, user) => {
      return {
        totalQuantity: acc.totalQuantity + (Number(user.quantity) || 0),
        totalPaidAmount: acc.totalPaidAmount + (Number(user.paidAmount) || 0),
        totalRemainingAmount: acc.totalRemainingAmount + (Number(user.remainingAmount) || 0),
        grandTotal: acc.grandTotal + (Number(user.totalAmount) || 0),
        totalUsers: acc.totalUsers + 1 // Count total users
      };
    }, {
      totalQuantity: 0,
      totalPaidAmount: 0,
      totalRemainingAmount: 0,
      grandTotal: 0,
      totalUsers: 0,
    });
  }, [users]);

  // Calculate name-wise summary
  const nameWiseSummary = useMemo(() => {
    if (!users?.length) return [];

    const summaryByName = users.reduce((acc, user) => {
      const name = user.name;
      if (!acc[name]) {
        acc[name] = {
          totalPaidAmount: 0,
          totalRemainingAmount: 0,
          totalAmount: 0,
          transactions: 0
        };
      }

      acc[name].totalPaidAmount += Number(user.paidAmount) || 0;
      acc[name].totalRemainingAmount += Number(user.remainingAmount) || 0;
      acc[name].totalAmount += Number(user.totalAmount) || 0;
      acc[name].transactions += 1;

      return acc;
    }, {});

    return Object.entries(summaryByName)
      .map(([name, data]) => ({
        name,
        ...data
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount); // Sort by total amount descending
  }, [users]);

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    if (!users?.length) return [];

    const summaryByMonth = users.reduce((acc, user) => {
      const month = new Date(user.timestamp).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = {};
      }
      if (!acc[month][user.name]) {
        acc[month][user.name] = {
          totalPaidAmount: 0,
          totalRemainingAmount: 0,
          totalAmount: 0,
        };
      }

      acc[month][user.name].totalPaidAmount += Number(user.paidAmount) || 0;
      acc[month][user.name].totalRemainingAmount += Number(user.remainingAmount) || 0;
      acc[month][user.name].totalAmount += Number(user.totalAmount) || 0;

      return acc;
    }, {});

    return Object.entries(summaryByMonth).map(([month, users]) => ({
      month,
      users: Object.entries(users).map(([name, data]) => ({ name, ...data }))
    }));
  }, [users]);

  const handleCreateUsers = async (userData) => {
    try {
      const { name, email, phoneNumber, paidAmount, quantity, unitCost } = userData;

      // Calculate total amount
      const totalAmount = quantity * unitCost;

      const result = await createUsers({
        name,
        email,
        phoneNumber,
        quantity: Number(quantity),
        unitCost: Number(unitCost),
        paidAmount: Number(paidAmount),
        totalAmount: Number(totalAmount),
        remainingAmount: Number(totalAmount - paidAmount),
        timestamp: new Date().toISOString(),
      }).unwrap();

      console.log("User created successfully:", result);
      setIsModalOpen(false);
      setErrorMessage("");
      refetch();
    } catch (error) {
      console.error("Detailed error:", error);
      setErrorMessage(error.data?.message || error.message || "An error occurred while creating the user");
    }
  };

  const handleDeleteUsers = async (userId) => {
    if (!userId) {
      console.error("No userId provided for deletion");
      setErrorMessage("Cannot delete user: Invalid user ID");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUsers(userId).unwrap();
      console.log(`Successfully deleted user: ${userId}`);
      setErrorMessage("");
      refetch();
    } catch (error) {
      console.error("Failed to delete user:", error);
      setErrorMessage(error.data?.message || error.message || "An error occurred while deleting the user");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "Users.xlsx");
  };

  if (isLoading) return <div className="py-4 text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 py-4">Error: {error.message}</div>;

  return (
    <div className="flex flex-col p-4">
      <Header name="Users" />
      <div className="flex justify-between mb-4">
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Create User
        </Button>
        <button
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <ErrorBoundary FallbackComponent={({ error }) => <div>Error: {error.message}</div>}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.userId}
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>

        {/* Overall Summary Section */}
        {summaryData && (
          <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Overall Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-lg font-semibold text-gray-800">{summaryData.totalUsers}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Quantity</p>
                <p className="text-lg font-semibold text-gray-800">{summaryData.totalQuantity}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Paid Amount</p>
                <p className="text-lg font-semibold text-green-600">${summaryData.totalPaidAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Remaining Amount</p>
                <p className="text-lg font-semibold text-orange-600">${summaryData.totalRemainingAmount.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Grand Total</p>
                <p className="text-xl font-bold text-blue-600">${summaryData.grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Name-wise Summary Section */}
        {nameWiseSummary.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Name-wise Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Remaining
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nameWiseSummary.map((summary, index) => (
                    <tr key={summary.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {summary.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {summary.transactions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        Rs {summary.totalPaidAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                        Rs {summary.totalRemainingAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                        Rs {summary.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Summary Section */}
        {monthlySummary.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Remaining
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlySummary.map(({ month, users }) => (
                    users.map((userSummary) => (
                      <tr key={`${month}-${userSummary.name}`} className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {userSummary.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          Rs {userSummary.totalPaidAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                          Rs {userSummary.totalRemainingAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                          Rs {userSummary.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </ErrorBoundary>
      <CreateUsersModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateUsers} 
      />
    </div>
  );
};

export default Users;