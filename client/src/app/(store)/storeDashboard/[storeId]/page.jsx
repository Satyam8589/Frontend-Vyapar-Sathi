"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

// In-memory cache across tab/route navigation
const overviewMemoryCache = new Map();

const getCachedOverview = (id) => {
  if (!id || typeof window === "undefined") return null;
  if (overviewMemoryCache.has(id)) {
    return overviewMemoryCache.get(id);
  }
  try {
    const stored = sessionStorage.getItem(`vyapar_overview_${id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      overviewMemoryCache.set(id, parsed);
      return parsed;
    }
  } catch (e) {
    // Ignore storage parse errors
  }
  return null;
};

const setCachedOverview = (id, data) => {
  if (!id || !data) return;
  overviewMemoryCache.set(id, data);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`vyapar_overview_${id}`, JSON.stringify(data));
    } catch (e) {
      // Ignore storage quota errors
    }
  }
};

/**
 * OverviewPage - Modular Store Overview Dashboard
 * Aggregates live metrics across Sales, Inventory, Products, Purchases, and Vendors.
 * Silently refreshes and updates live metrics without blocking the user interface.
 */
const OverviewPage = () => {
  const params = useParams();
  const routeStoreId = params?.storeId;
  const { currentStore } = useInventoryContext();
  const storeId = currentStore?._id || routeStoreId;

  const [refreshing, setRefreshing] = useState(false);

  // Initialize overview state from cache for instant rendering
  const [overview, setOverview] = useState(() => getCachedOverview(storeId));

  // Sales metrics state
  const [salesData, setSalesData] = useState(() => {
    const cached = getCachedOverview(storeId);
    if (cached?.sales) {
      return {
        dailySales: cached.sales.todaySales || 0,
        weeklySales: cached.sales.weeklySales || 0,
        monthlySales: cached.sales.monthlySales || 0,
        yearlySales: cached.sales.yearlySales || 0,
        totalSales: cached.sales.totalSales || 0,
        totalOrders: cached.sales.totalOrders || 0,
        todayOrders: cached.sales.todayOrders || 0,
        averageOrderValue: cached.sales.averageOrderValue || 0,
        topProduct: cached.products?.topProduct?.name || "N/A",
        topProductQty: cached.products?.topProduct?.unitsSold || 0,
        salesGrowth: cached.sales.salesGrowth || { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
        ordersGrowth: cached.sales.ordersGrowth || { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
        aovGrowth: cached.sales.aovGrowth || { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
      };
    }
    return {
      dailySales: 0,
      weeklySales: 0,
      monthlySales: 0,
      yearlySales: 0,
      totalSales: 0,
      totalOrders: 0,
      todayOrders: 0,
      averageOrderValue: 0,
      topProduct: "N/A",
      topProductQty: 0,
      salesGrowth: { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
      ordersGrowth: { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
      aovGrowth: { value: 0, isPositive: true, isNeutral: true, text: "0% from last month" },
    };
  });

  // Chart datasets state
  const [chartData, setChartData] = useState(() => {
    const cached = getCachedOverview(storeId);
    if (cached?.sales?.charts) {
      return {
        dailyBreakdown: cached.sales.charts.dailyBreakdown || [],
        dailyLabels: cached.sales.charts.dailyLabels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        weeklyBreakdown: cached.sales.charts.weeklyBreakdown || [0, 0, 0, 0],
        quarterlyBreakdown: cached.sales.charts.quarterlyBreakdown || [0, 0, 0, 0],
      };
    }
    return {
      dailyBreakdown: [],
      dailyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weeklyBreakdown: [0, 0, 0, 0],
      quarterlyBreakdown: [0, 0, 0, 0],
    };
  });

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const applyOverviewData = useCallback((comprehensiveData) => {
    if (!comprehensiveData || !isMountedRef.current) return;

    setOverview(comprehensiveData);

    if (comprehensiveData.sales) {
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
    }
  }, []);

  // Internal silent data fetcher
  const loadOverviewData = useCallback(
    async ({ isManualRefresh = false } = {}) => {
      if (!storeId) return;

      try {
        if (isManualRefresh && isMountedRef.current) {
          setRefreshing(true);
        }

        // Fetch comprehensive overview silently from backend API
        const comprehensiveData = await fetchStoreComprehensiveOverview(storeId);

        if (comprehensiveData && comprehensiveData.sales) {
          applyOverviewData(comprehensiveData);
          setCachedOverview(storeId, comprehensiveData);
        } else {
          // Fallback calculation if backend endpoint is unavailable
          const legacyData = await fetchSalesOverview(storeId);
          const bills = legacyData.bills || [];

          const metrics = calculateSalesMetrics(bills);
          const charts = generateChartData(bills);

          if (!isMountedRef.current) return;

          setSalesData(metrics);
          setChartData(charts);

          const fallbackOverview = {
            sales: {
              todaySales: metrics.dailySales,
              weeklySales: metrics.weeklySales,
              monthlySales: metrics.monthlySales,
              yearlySales: metrics.yearlySales,
              totalSales: metrics.totalSales,
              totalOrders: metrics.totalOrders,
              todayOrders: 0,
              averageOrderValue: metrics.averageOrderValue,
              salesGrowth: metrics.salesGrowth,
              ordersGrowth: metrics.ordersGrowth,
              aovGrowth: metrics.aovGrowth,
              charts,
            },
            inventory: {
              totalQuantity: 0,
              totalValue: 0,
              totalCostValue: 0,
              lowStockCount: 0,
              outOfStockCount: 0,
              inStockCount: 0,
            },
            products: {
              totalProducts: 0,
              totalCategories: 0,
              topProduct: { name: metrics.topProduct, unitsSold: metrics.topProductQty },
              criticalStock: [],
              topSelling: [],
            },
            purchases: {
              totalAmount: 0,
              dueAmount: 0,
              totalPurchases: 0,
              monthlyPurchases: 0,
              monthlyPurchasesCount: 0,
            },
            sellers: {
              totalSellers: 0,
              activeSellers: 0,
              totalDue: 0,
            },
          };

          setOverview(fallbackOverview);
          setCachedOverview(storeId, fallbackOverview);
        }
      } catch (error) {
        console.warn("Silent overview refresh completed with error:", error);
      } finally {
        if (isMountedRef.current) {
          setRefreshing(false);
        }
      }
    },
    [storeId, applyOverviewData]
  );

  // Silently refresh whenever user enters the overview page or tab gains focus
  useEffect(() => {
    if (!storeId) return;

    // Immediately hydrate from memory/sessionStorage if not already set
    const cached = getCachedOverview(storeId);
    if (cached) {
      applyOverviewData(cached);
    }

    // Silently revalidate data internally in background
    loadOverviewData();

    // Silently revalidate when user switches back to this tab
    const handleFocus = () => {
      loadOverviewData();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [storeId, loadOverviewData, applyOverviewData]);

  return (
    <div className="min-h-screen py-2 sm:py-3 px-2 sm:px-4">
      <div className="w-full max-w-7xl mx-auto space-y-3.5">
        {/* 1. Header Section with Quick Navigation & Action Buttons */}
        <OverviewHeader
          storeId={storeId}
          storeName={currentStore?.name || overview?.store?.name || "Store"}
          onRefresh={() => loadOverviewData({ isManualRefresh: true })}
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