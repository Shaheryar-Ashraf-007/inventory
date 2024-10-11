"use client";

import React, { useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/[components]/Header";

const CreateSalariesModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    userId: v4(),
    name: "",
    email: "",
    phoneNumber: "",
    salaryAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    startDate: "",
    endDate: "",
    timestamp: new Date().toISOString(),
    otherExpense: 0,
    petrolExpense: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "salaryAmount" || name === "paidAmount" || name === "remainingAmount" || name === "otherExpense" || name === "petrolExpense"
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Salary" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* Name */}
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Email */}
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Phone Number */}
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
            value={formData.phoneNumber}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Salary Amount */}
          <label htmlFor="salaryAmount" className="block text-sm font-medium text-gray-700">
            Salary Amount
          </label>
          <input
            type="number"
            name="salaryAmount"
            placeholder="Salary Amount"
            onChange={handleChange}
            value={formData.salaryAmount}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Paid Amount */}
          <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700">
            Paid Amount
          </label>
          <input
            type="number"
            name="paidAmount"
            placeholder="Paid Amount"
            onChange={handleChange}
            value={formData.paidAmount}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Remaining Amount */}
          <label htmlFor="remainingAmount" className="block text-sm font-medium text-gray-700">
            Remaining Amount
          </label>
          <input
            type="number"
            name="remainingAmount"
            placeholder="Remaining Amount"
            onChange={handleChange}
            value={formData.remainingAmount}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Start Date */}
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            value={formData.startDate}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* End Date */}
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            value={formData.endDate}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Other Expense */}
          <label htmlFor="otherExpense" className="block text-sm font-medium text-gray-700">
            Other Expense
          </label>
          <input
            type="number"
            name="otherExpense"
            placeholder="Other Expense"
            onChange={handleChange}
            value={formData.otherExpense}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Petrol Expense */}
          <label htmlFor="petrolExpense" className="block text-sm font-medium text-gray-700">
            Petrol Expense
          </label>
          <input
            type="number"
            name="petrolExpense"
            placeholder="Petrol Expense"
            onChange={handleChange}
            value={formData.petrolExpense}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Action Buttons */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
            <button
              onClick={onClose}
              type="button"
              className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSalariesModal;