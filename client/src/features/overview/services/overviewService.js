import { apiGet } from "@/servies/api";

/**
 * Overview/Sales Service - Fetches real sales analytics data
 */

export const fetchSalesOverview = async (storeId) => {
  try {
    const response = await apiGet(
      `/cart/store/${storeId}/history?limit=1000&page=1`,
    );
    return response.data || { bills: [], pagination: {} };
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
    return { bills: [], pagination: {} };
  }
};

export const fetchStoreAnalyticsSummary = async (storeId) => {
  try {
    const response = await apiGet(`/analytics/store/${storeId}/summary`);
    return response.data || {};
  } catch (error) {
    console.error("Failed to fetch analytics summary:", error);
    return {};
  }
};

export const fetchTopProducts = async (storeId) => {
  try {
    const response = await apiGet(`/analytics/store/${storeId}/products/top`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch top products:", error);
    return [];
  }
};

/**
 * Calculate sales metrics from bills data
 */
export const calculateSalesMetrics = (bills = []) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  let dailySales = 0;
  let weeklySales = 0;
  let monthlySales = 0;
  let yearlySales = 0;
  let totalOrders = bills.length;
  const productMap = {};

  bills.forEach((bill) => {
    const billDate = new Date(bill.updatedAt || bill.createdAt);
    const billAmount = bill.totalAmount || 0;

    yearlySales += billAmount;

    if (billDate >= monthStart) {
      monthlySales += billAmount;
    }

    if (billDate >= weekStart) {
      weeklySales += billAmount;
    }

    if (billDate >= today) {
      dailySales += billAmount;
    }

    // Track products for top product
    bill.products?.forEach((item) => {
      const productName = item.product?.name || item.productName || "Unknown";
      const quantity = item.quantity || 0;
      productMap[productName] = (productMap[productName] || 0) + quantity;
    });
  });

  const topProduct = Object.entries(productMap).reduce(
    (max, [name, qty]) => (qty > max.qty ? { name, qty } : max),
    { name: "N/A", qty: 0 },
  );

  const averageOrderValue = totalOrders > 0 ? yearlySales / totalOrders : 0;

  return {
    dailySales,
    weeklySales,
    monthlySales,
    yearlySales,
    totalSales: yearlySales,
    totalOrders,
    averageOrderValue,
    topProduct: topProduct.name,
  };
};

/**
 * Generate chart data from bills
 */
export const generateChartData = (bills = []) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);

  // Daily breakdown for last 7 days
  const dailyData = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().split("T")[0];
    dailyData[key] = 0;
  }

  bills.forEach((bill) => {
    const billDate = new Date(bill.updatedAt || bill.createdAt);
    if (billDate >= weekStart && billDate <= now) {
      const key = billDate.toISOString().split("T")[0];
      if (key in dailyData) {
        dailyData[key] += bill.totalAmount || 0;
      }
    }
  });

  // Weekly data for current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weeklyData = {
    "Week 1": 0,
    "Week 2": 0,
    "Week 3": 0,
    "Week 4": 0,
  };

  bills.forEach((bill) => {
    const billDate = new Date(bill.updatedAt || bill.createdAt);
    if (billDate >= monthStart && billDate <= now) {
      const dayOfMonth = billDate.getDate();
      let week;
      if (dayOfMonth <= 7) week = "Week 1";
      else if (dayOfMonth <= 14) week = "Week 2";
      else if (dayOfMonth <= 21) week = "Week 3";
      else week = "Week 4";
      weeklyData[week] += bill.totalAmount || 0;
    }
  });

  // Quarterly data for current year
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const quarterlyData = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  };

  bills.forEach((bill) => {
    const billDate = new Date(bill.updatedAt || bill.createdAt);
    if (billDate >= yearStart && billDate <= now) {
      const month = billDate.getMonth();
      const quarter = Math.floor(month / 3);
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      quarterlyData[quarters[quarter]] += bill.totalAmount || 0;
    }
  });

  return {
    dailyBreakdown: Object.values(dailyData),
    weeklyBreakdown: Object.values(weeklyData),
    quarterlyBreakdown: Object.values(quarterlyData),
  };
};
