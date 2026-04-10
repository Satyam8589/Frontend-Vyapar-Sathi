"use client";

import { useEffect, useState } from "react";
import { useInventoryContext } from "@/features/inventory/context/inventoryContext";
import {
  fetchSalesOverview,
  calculateSalesMetrics,
  generateChartData,
} from "@/features/overview/services/overviewService";

const OverviewPage = () => {
  const { currentStore } = useInventoryContext();
  const [salesData, setSalesData] = useState({
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    yearlySales: 0,
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProduct: "N/A",
  });
  const [chartData, setChartData] = useState({
    dailyBreakdown: [],
    weeklyBreakdown: [],
    quarterlyBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      if (!currentStore?._id) return;

      try {
        setLoading(true);
        // Fetch real sales data from backend
        const overviewData = await fetchSalesOverview(currentStore._id);
        const bills = overviewData.bills || [];

        // Calculate metrics from real data
        const metrics = calculateSalesMetrics(bills);
        setSalesData(metrics);

        // Generate chart data
        const charts = generateChartData(bills);
        setChartData(charts);
      } catch (error) {
        console.error("Failed to fetch overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, [currentStore]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Store Overview
          </h1>
          <p className="text-gray-600">
            Welcome back, {currentStore?.name || "Store"}. Here's your sales
            performance.
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sales Card */}
          <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Sales
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(salesData.totalSales)}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">
              ↑ 12% from last month
            </p>
          </div>

          {/* Total Orders Card */}
          <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {salesData.totalOrders.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">
              ↑ 8% from last month
            </p>
          </div>

          {/* Avg Order Value Card */}
          <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Avg Order Value
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(salesData.averageOrderValue)}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">
              ↑ 5% from last month
            </p>
          </div>

          {/* Top Product Card */}
          <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Top Product
                </p>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                  {salesData.topProduct}
                </h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 font-medium">
              245 units sold this month
            </p>
          </div>
        </div>

        {/* Sales by Period */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Sales Cards */}
          <div className="space-y-6">
            {/* Daily Sales */}
            <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Today's Sales
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formatCurrency(salesData.dailySales)}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-end gap-1">
                  {chartData.dailyBreakdown.length > 0
                    ? chartData.dailyBreakdown.map((value, idx) => {
                        const maxValue = Math.max(
                          ...chartData.dailyBreakdown,
                          1,
                        );
                        const heightPercent = (value / maxValue) * 100;
                        return (
                          <div
                            key={idx}
                            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                            style={{
                              height: `${Math.max(heightPercent * 1.5, 20)}px`,
                            }}
                            title={`${formatCurrency(value)}`}
                          ></div>
                        );
                      })
                    : [65, 40, 85, 45, 70, 55, 80].map((height, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                          style={{ height: `${height * 0.5}px` }}
                        ></div>
                      ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Last 7 days
                </p>
              </div>
            </div>

            {/* Weekly Sales */}
            <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    This Week
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formatCurrency(salesData.weeklySales)}
                  </h2>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, idx) => {
                      const maxValue = Math.max(...chartData.dailyBreakdown, 1);
                      const value = chartData.dailyBreakdown[idx] || 0;
                      const heightPercent = (value / maxValue) * 100;
                      return (
                        <div key={idx} className="text-center">
                          <div
                            className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t mb-1"
                            style={{
                              height: `${Math.max(heightPercent * 1.2, 15)}px`,
                            }}
                            title={`${formatCurrency(value)}`}
                          ></div>
                          <p className="text-xs text-gray-500">{day}</p>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Monthly & Yearly */}
          <div className="space-y-6">
            {/* Monthly Sales */}
            <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    This Month
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formatCurrency(salesData.monthlySales)}
                  </h2>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M16 2v4"></path>
                    <path d="M8 2v4"></path>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="space-y-3">
                  {[
                    { label: "Week 1", idx: 0 },
                    { label: "Week 2", idx: 1 },
                    { label: "Week 3", idx: 2 },
                    { label: "Week 4", idx: 3 },
                  ].map((week) => {
                    const value = chartData.weeklyBreakdown[week.idx] || 0;
                    const maxValue = Math.max(...chartData.weeklyBreakdown, 1);
                    const percentage =
                      maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div key={week.idx}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-medium text-gray-600">
                            {week.label}
                          </p>
                          <p className="text-xs font-bold text-gray-900">
                            {formatCurrency(value)}
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Yearly Sales */}
            <div className="bg-gradient-to-br from-slate-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    This Year
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formatCurrency(salesData.yearlySales)}
                  </h2>
                </div>
                <div className="p-3 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { month: "Q1", idx: 0 },
                    { month: "Q2", idx: 1 },
                    { month: "Q3", idx: 2 },
                    { month: "Q4", idx: 3 },
                  ].map((quarter) => {
                    const value =
                      chartData.quarterlyBreakdown[quarter.idx] || 0;
                    const maxValue = Math.max(
                      ...chartData.quarterlyBreakdown,
                      1,
                    );
                    const barHeight =
                      maxValue > 0 ? (value / maxValue) * 80 : 20;
                    return (
                      <div key={quarter.idx} className="text-center">
                        <p className="text-xs font-medium text-gray-600 mb-2">
                          {quarter.month}
                        </p>
                        <div
                          className="w-full bg-gradient-to-t from-rose-500 to-rose-400 rounded-t mx-auto"
                          style={{
                            height: `${Math.max(barHeight, 30)}px`,
                            width: "100%",
                          }}
                        ></div>
                        <p className="text-xs text-gray-600 mt-2">
                          {formatCurrency(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
