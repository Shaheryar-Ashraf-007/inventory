"use client";

import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import Header from "@/app/[components]/Header";

const CreateUsersModal = ({ isOpen, onClose, onCreate }) => {
  const [userData, setUserData] = useState({
    userId: v4(),
    name: "",
    email: "",
    phoneNumber: "",
    unitCost: 0,
    paidAmount: 0,
    quantity: 0,
    remainingAmount: 0,
    totalAmount: 0,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const total = userData.unitCost * userData.quantity;
    const remaining = total - userData.paidAmount;
    setUserData(prevData => ({
      ...prevData,
      totalAmount: total,
      remainingAmount: remaining
    }));
  }, [userData.unitCost, userData.quantity, userData.paidAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: name === "quantity" || name === "paidAmount" || name === "unitCost" 
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(userData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New User" />
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
            value={userData.name}
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
            value={userData.email}
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
            value={userData.phoneNumber}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Unit Cost */}
          <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700">
            Unit Cost
          </label>
          <input
            type="number"
            name="unitCost"
            placeholder="Unit Cost"
            onChange={handleChange}
            value={userData.unitCost}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Quantity */}
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            value={userData.quantity}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* Total Amount */}
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
            Total Amount
          </label>
          <input
            type="number"
            name="totalAmount"
            value={userData.totalAmount}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            readOnly
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
            value={userData.paidAmount}
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
            value={userData.remainingAmount}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            readOnly
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

export default CreateUsersModal;