"use client";

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import CardExpenseSummary from "./CardExpenseSummary";
import CardPopularProducts from "./CardPopularProducts";
import CardPurchaseSummary from "./CardPurchaseSummary";
import CardSalesSummary from "./CardSalesSummary";
import StatCard from "./StatCard";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard`;
        console.log("Fetching data from:", url); 

        const response = await fetch(url, { 
          method: 'GET',

          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Log the received data
        setDashboardData(data);
        setIsLoading(false);
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        setError("Failed to load dashboard data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts data={dashboardData.popularProducts} />
      <CardSalesSummary data={dashboardData.salesSummary} />
      <CardPurchaseSummary data={dashboardData.purchaseSummary} />
      <CardExpenseSummary data={dashboardData.expenseSummary} />
      <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange="01 - 30 October 2024"
        details={[
          {
            title: "Sales",
            amount: dashboardData.salesSummary.totalSales,
            changePercentage: dashboardData.salesSummary.changePercentage,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: dashboardData.salesSummary.totalDiscount,
            changePercentage: dashboardData.salesSummary.discountPercentage,
            IconComponent: TrendingDown,
          },
          
        ]}
      />

<StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange="01 - 30 October 2024"
        details={[
          {
            title: "Customer Growth",
            amount: "175.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: "10.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />

<StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange="01 - 30 October 2024"
        details={[
          {
            title: "Dues",
            amount: "250.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: "147",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
