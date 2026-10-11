"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useInventoryContext } from "@/features/inventory/context/inventoryContext";
import {
  fetchStoreComprehensiveOverview,
  fetchSalesOverview,
  calculateSalesMetrics,
  generateChartData,
} from "@/features/overview/services/overviewService";
import {
  OverviewHeader,
  OverviewMetricsCards,
  SalesPerformanceSection,
  SalesTrendsSection,
  InventorySummarySection,
  SuppliersAndPurchasesSection,
} from "@/features/overview/components";

/**
 * OverviewPage - Modular Store Overview Dashboard
 * Aggregates live metrics across Sales, Inventory, Products, Purchases, and Vendors.
 */
const OverviewPage = () => {
  const params = useParams();
  const routeStoreId = params?.storeId;
  const { currentStore } = useInventoryContext();
  const storeId = currentStore?._id || routeStoreId;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // High-level store overview state from unified backend API
  const [overview, setOverview] = useState(null);

  // Sales metrics state
  const [salesData, setSalesData] = useState({
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    yearlySales: 0,
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProduct: "N/A",
    topProductQty: 0,
    salesGrowth: { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
    ordersGrowth: { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
    aovGrowth: { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
  });

  // Chart datasets state
  const [chartData, setChartData] = useState({
    dailyBreakdown: [],
    dailyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weeklyBreakdown: [0, 0, 0, 0],
    quarterlyBreakdown: [0, 0, 0, 0],
  });

  const loadOverviewData = useCallback(
    async (isManualRefresh = false) => {
      if (!storeId) return;

      try {
        if (isManualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        // 1. Fetch comprehensive overview from backend API
        const comprehensiveData = await fetchStoreComprehensiveOverview(storeId);

        if (comprehensiveData && comprehensiveData.sales) {
          setOverview(comprehensiveData);

          // Populate sales metrics
          setSalesData({
            dailySales: comprehensiveData.sales.todaySales || 0,
            weeklySales: comprehensiveData.sales.weeklySales || 0,
            monthlySales: comprehensiveData.sales.monthlySales || 0,
            yearlySales: comprehensiveData.sales.yearlySales || 0,
            totalSales: comprehensiveData.sales.totalSales || 0,
            totalOrders: comprehensiveData.sales.totalOrders || 0,
            todayOrders: comprehensiveData.sales.todayOrders || 0,
            averageOrderValue: comprehensiveData.sales.averageOrderValue || 0,
            topProduct: comprehensiveData.products?.topProduct?.name || "N/A",
            topProductQty: comprehensiveData.products?.topProduct?.unitsSold || 0,
            salesGrowth: comprehensiveData.sales.salesGrowth || {
              value: 0,
              isPositive: true,
              isNeutral: true,
              text: "0% from last month",
            },
            ordersGrowth: comprehensiveData.sales.ordersGrowth || {
              value: 0,
              isPositive: true,
              isNeutral: true,
              text: "0% from last month",
            },
            aovGrowth: comprehensiveData.sales.aovGrowth || {
              value: 0,
              isPositive: true,
              isNeutral: true,
              text: "0% from last month",
            },
          });

          // Populate chart datasets
          if (comprehensiveData.sales.charts) {
            setChartData({
              dailyBreakdown: comprehensiveData.sales.charts.dailyBreakdown || [],
              dailyLabels: comprehensiveData.sales.charts.dailyLabels || [
                "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
              ],
              weeklyBreakdown: comprehensiveData.sales.charts.weeklyBreakdown || [0, 0, 0, 0],
              quarterlyBreakdown: comprehensiveData.sales.charts.quarterlyBreakdown || [0, 0, 0, 0],
            });
          }
        } else {
          // Fallback to legacy calculation if backend endpoint unavailable
          const legacyData = await fetchSalesOverview(storeId);
          const bills = legacyData.bills || [];

          const metrics = calculateSalesMetrics(bills);
          setSalesData(metrics);

          const charts = generateChartData(bills);
          setChartData(charts);
        }
      } catch (error) {
        console.error("Failed to load store overview data:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [storeId]
  );

  useEffect(() => {
    loadOverviewData();
  }, [loadOverviewData]);

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-base font-bold text-gray-800">Loading Store Overview</h3>
          <p className="text-xs text-gray-500 mt-1">Aggregating live sales, inventory, and procurement metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* 1. Header Section with Quick Navigation & Action Buttons */}
        <OverviewHeader
          storeId={storeId}
          storeName={currentStore?.name || overview?.store?.name || "Store"}
          onRefresh={() => loadOverviewData(true)}
          isRefreshing={refreshing}
        />

        {/* 2. Top Quick Stats Metrics Row */}
        <OverviewMetricsCards
          salesData={salesData}
          inventoryData={overview?.inventory}
          purchasesData={overview?.purchases}
          sellersData={overview?.sellers}
        />

        {/* 3. Realtime Revenue & Weekly Breakdown Chart */}
        <SalesPerformanceSection
          salesData={salesData}
          chartData={chartData}
        />

        {/* 4. Monthly & Annual Fiscal Trends */}
        <SalesTrendsSection
          salesData={salesData}
          chartData={chartData}
        />

        {/* 5. Inventory Stock Health & Restock Alerts */}
        <InventorySummarySection
          storeId={storeId}
          inventoryData={overview?.inventory}
          productsData={overview?.products}
        />

        {/* 6. Suppliers & Procurement + Best-Selling Products */}
        <SuppliersAndPurchasesSection
          storeId={storeId}
          purchasesData={overview?.purchases}
          sellersData={overview?.sellers}
          topProducts={overview?.products?.topSelling || []}
        />
      </div>
    </div>
  );
};

export default OverviewPage;