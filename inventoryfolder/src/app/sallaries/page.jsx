"use client";

import React, { useState, useMemo } from 'react';
import { useGetSalariesQuery, useCreateSalariesMutation, useDeleteSalariesMutation } from '@/state/api.js';
import Header from "@/app/[components]/Header";
import CreateSalariesModal from './CreateSalariesModal.jsx';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@mui/material/Button';
import * as XLSX from 'xlsx';

const Salaries = () => {
  const { data: rawSalaries, isError, isLoading, error, refetch } = useGetSalariesQuery();
  const [createSalaries] = useCreateSalariesMutation();
  const [deleteSalaries] = useDeleteSalariesMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const summaryData = useMemo(() => {
    if (!rawSalaries) return {
      totalSalary: 0,
      totalPaid: 0,
      totalPetrolExpense: 0,
      totalOtherExpense: 0,
      totalRemaining: 0,
      employeeCount: 0,
      employees: {},
      monthWise: {}
    };

    return rawSalaries.reduce((acc, salary) => {
      const salaryAmount = Number(salary.salaryAmount) || 0;
      const paidAmount = Number(salary.paidAmount) || 0;
      const petrolExpense = Number(salary.petrolExpense) || 0;
      const otherExpense = Number(salary.otherExpense) || 0;

      const totalDeductions = paidAmount + petrolExpense + otherExpense;

      acc.totalSalary += salaryAmount;
      acc.totalPaid += paidAmount;
      acc.totalPetrolExpense += petrolExpense;
      acc.totalOtherExpense += otherExpense;
      acc.totalRemaining += (salaryAmount - totalDeductions);
      acc.employeeCount += 1; // Count each employee

      const employeeName = salary.name || "Unknown";
      if (!acc.employees[employeeName]) {
        acc.employees[employeeName] = { totalSalary: 0, totalPaid: 0, totalRemaining: 0 };
      }
      acc.employees[employeeName].totalSalary += salaryAmount;
      acc.employees[employeeName].totalPaid += paidAmount;
      acc.employees[employeeName].totalRemaining += (salaryAmount - totalDeductions);

      // Process month-wise summary
      const month = new Date(salary.startDate).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc.monthWise[month]) {
        acc.monthWise[month] = { totalSalary: 0, totalPaid: 0, totalRemaining: 0, employees: {} };
      }
      acc.monthWise[month].totalSalary += salaryAmount;
      acc.monthWise[month].totalPaid += paidAmount;
      acc.monthWise[month].totalRemaining += (salaryAmount - totalDeductions);

      // Associate employee names with the month
      if (!acc.monthWise[month].employees[employeeName]) {
        acc.monthWise[month].employees[employeeName] = { totalSalary: 0, totalPaid: 0, totalRemaining: 0 };
      }
      acc.monthWise[month].employees[employeeName].totalSalary += salaryAmount;
      acc.monthWise[month].employees[employeeName].totalPaid += paidAmount;
      acc.monthWise[month].employees[employeeName].totalRemaining += (salaryAmount - totalDeductions);

      return acc;
    }, {
      totalSalary: 0,
      totalPaid: 0,
      totalPetrolExpense: 0,
      totalOtherExpense: 0,
      totalRemaining: 0,
      employeeCount: 0,
      employees: {},
      monthWise: {}
    });
  }, [rawSalaries]);

  const columns = useMemo(() => [
    { field: "serial", headerName: "S.No", width: 70, sortable: false },
    { field: "userId", headerName: "ID", width: 220, sortable: true },
    { field: "name", headerName: "Employee Name", width: 200, sortable: true },
    { field: "email", headerName: "Email", width: 220, sortable: true },
    { field: "salaryAmount", headerName: "Salary Amount", width: 150, sortable: true },
    { field: "paidAmount", headerName: "Paid Amount", width: 150, sortable: true },
    { field: "remainingAmount", headerName: "Remaining Amount", width: 180, sortable: true },
    { field: "startDate", headerName: "Start Date", width: 120, sortable: true },
    { field: "endDate", headerName: "End Date", width: 120, sortable: true },
    { field: "petrolExpense", headerName: "Petrol Expense", width: 150, sortable: true },
    { field: "otherExpense", headerName: "Other Expense", width: 150, sortable: true },
    { field: "timestamp", headerName: "Date/Time", width: 180, sortable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button 
          className='text-blue-500'
          onClick={() => handleDeleteSalaries(params.row.userId)}
        >
          Delete
        </button>
      ),
    },
  ], []);

  const handleCreateSalaries = async (salariesData) => {
    try {
      const { name, email, phoneNumber, salaryAmount, paidAmount, petrolExpense, otherExpense } = salariesData;

      const formattedStartDate = new Date(salariesData.startDate).toISOString();
      const formattedEndDate = new Date(salariesData.endDate).toISOString();

      if (!name || !email || !salaryAmount) {
        throw new Error("Name, email, and salary amount are required");
      }

      const totalDeductions = (Number(paidAmount) || 0) + (Number(petrolExpense) || 0) + (Number(otherExpense) || 0);
      const remainingAmount = Number(salaryAmount) - totalDeductions;

      const result = await createSalaries({
        name,
        email,
        phoneNumber,
        salaryAmount: Number(salaryAmount),
        paidAmount: Number(paidAmount),
        petrolExpense: petrolExpense ? Number(petrolExpense) : undefined,
        otherExpense: otherExpense ? String(otherExpense) : undefined,
        remainingAmount,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        timestamp: new Date().toISOString(),
      }).unwrap();

      console.log("Salary created successfully:", result);
      setIsModalOpen(false);
      setErrorMessage("");
      refetch();
    } catch (error) {
      console.error("Detailed error:", error);
      setErrorMessage(error.response ? `Failed to create salary: ${error.data?.message || error.message}` : "Network error. Please check your connection and try again.");
    }
  };

  const handleDeleteSalaries = async (userId) => {
    if (!userId) {
      console.error("No userId provided for deletion");
      setErrorMessage("Cannot delete salary: Invalid user ID");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this salary?");
    if (!confirmDelete) return;

    try {
      await deleteSalaries(userId).unwrap();
      console.log(`Successfully deleted salary for user: ${userId}`);
      setErrorMessage("");
      refetch();
    } catch (error) {
      console.error("Failed to delete salary:", error);
      let errorMessage = error.data?.message || error.message || "An unknown error occurred";

      switch (error.status) {
        case 404:
          errorMessage = "Salary record not found";
          break;
        case 400:
          errorMessage = "Invalid request: " + errorMessage;
          break;
        case 500:
          errorMessage = "Server error: " + errorMessage;
          break;
      }

      setErrorMessage(`Failed to delete salary: ${errorMessage}`);
    }
  };

  const salaries = useMemo(() => {
    if (!rawSalaries) return [];
    return rawSalaries.map((salary, index) => ({
      serial: index + 1,
      userId: salary.userId || 'N/A',
      name: salary.name || 'N/A',
      email: salary.email != null ? salary.email : "N/A",
      salaryAmount: salary.salaryAmount != null ? salary.salaryAmount : "N/A",
      paidAmount: salary.paidAmount != null ? salary.paidAmount : "N/A",
      remainingAmount: salary.remainingAmount != null ? salary.remainingAmount : "N/A",
      startDate: salary.startDate,
      endDate: salary.endDate,
      petrolExpense: salary.petrolExpense != null ? salary.petrolExpense : "N/A",
      otherExpense: salary.otherExpense != null ? salary.otherExpense : "N/A",
      timestamp: salary.timestamp ? new Date(salary.timestamp).toLocaleString() : 'N/A',
    }));
  }, [rawSalaries]);

  // Excel export function
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salaries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salaries");
    XLSX.writeFile(wb, "Salaries.xlsx");
  };

  const LoadingComponent = () => (
    <div className="py-4 text-center">Loading...</div>
  );

  const ErrorComponent = ({ error }) => (
    <div className="text-center text-red-500 py-4">
      Failed to fetch salaries: {error.message}
    </div>
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent error={error} />;

  return (
    <div className="flex flex-col p-4">
      <Header name="Salaries" />
      <div className="flex justify-between mb-4">
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Create Salary
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
            rows={salaries}
            columns={columns}
            getRowId={(row) => row.userId}
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      </ErrorBoundary>
      <CreateSalariesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateSalaries} 
      />
      
      {/* Overall Summary */}
      {summaryData && (
        <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Overall Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Paid Amount</p>
              <p className="text-lg font-semibold text-green-600">Rs {summaryData.totalPaid.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Remaining Amount</p>
              <p className="text-lg font-semibold text-orange-600">Rs {summaryData.totalRemaining.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Total Salaries</p>
              <p className="text-xl font-bold text-blue-600">Rs {summaryData.totalSalary.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Total Employees</p>
              <p className="text-xl font-bold text-purple-600">{summaryData.employeeCount}</p>
            </div>
          </div>

          {/* Employee-wise Summary */}
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Employee-wise Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(summaryData.employees).map(([employeeName, data]) => (
              <div key={employeeName} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold">{employeeName}</p>
                <p className="text-sm text-gray-600">Total Salary: Rs {data.totalSalary.toFixed(2)}</p>
                <p className="text-sm text-green-600">Total Paid: Rs {data.totalPaid.toFixed(2)}</p>
                <p className="text-sm text-orange-600">Remaining: Rs {data.totalRemaining.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Month-wise Summary */}
          <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Month-wise Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(summaryData.monthWise).map(([month, data]) => (
              <div key={month} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold">{month}</p>
                <p className="text-sm text-gray-600">Total Salaries: Rs {data.totalSalary.toFixed(2)}</p>
                <p className="text-sm text-green-600">Total Paid: Rs {data.totalPaid.toFixed(2)}</p>
                <p className="text-sm text-orange-600">Remaining: Rs {data.totalRemaining.toFixed(2)}</p>
                <h3 className="font-semibold mt-2">Employee Contributions:</h3>
                <ul className="list-disc pl-5">
                  {Object.entries(data.employees).map(([employeeName, employeeData]) => (
                    <li key={employeeName} className="text-sm text-gray-600">
                      {employeeName}: Total Salary Rs {employeeData.totalSalary.toFixed(2)}, Total Paid Rs {employeeData.totalPaid.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Salaries;