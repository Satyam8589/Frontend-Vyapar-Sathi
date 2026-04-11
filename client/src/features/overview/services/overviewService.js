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
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  let dailySales = 0;
  let weeklySales = 0;
  let monthlySales = 0;
  let yearlySales = 0;
  let totalOrders = bills.length;
  const productMap = {};

  bills.forEach((bill) => {
    const billDate = new Date(bill.completedAt || bill.updatedAt || bill.createdAt);
    const billAmount = Number(bill.totalAmount ?? bill.totalPrice ?? 0);

    yearlySales += billAmount;

    if (billDate >= monthStart) {
      monthlySales += billAmount;
    }

    if (billDate >= sevenDaysAgo) {
      weeklySales += billAmount;
    }

    if (billDate >= today) {
      dailySales += billAmount;
    }

    const items = bill.products || bill.items || [];
    items.forEach((item) => {
      const productName = item.product?.name || item.nameSnapshot || "Unknown Product";
      const quantity = Number(item.quantity || 0);
      productMap[productName] = (productMap[productName] || 0) + quantity;
    });
  });

  const topProduct = Object.entries(productMap).reduce(
    (max, [name, qty]) => (qty > max.qty ? { name, qty } : max),
    { name: "N/A", qty: 0 },
  );

  return {
    dailySales,
    weeklySales,
    monthlySales,
    yearlySales,
    totalSales: yearlySales,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? yearlySales / totalOrders : 0,
    topProduct: topProduct.name,
    topProductQty: topProduct.qty,
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
  const dailyData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const label = date.toLocaleDateString("en-IN", { weekday: "short" });
    const startTime = date.getTime();
    const endTime = startTime + 24 * 60 * 60 * 1000;
    
    const amount = bills.reduce((sum, bill) => {
      const billDate = new Date(bill.completedAt || bill.updatedAt || bill.createdAt).getTime();
      if (billDate >= startTime && billDate < endTime) {
        return sum + Number(bill.totalAmount ?? bill.totalPrice ?? 0);
      }
      return sum;
    }, 0);
    
    dailyData.push({ label, amount });
  }

  // Weekly data for current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weeklyData = { "Week 1": 0, "Week 2": 0, "Week 3": 0, "Week 4": 0 };

  bills.forEach((bill) => {
    const billDate = new Date(bill.completedAt || bill.updatedAt || bill.createdAt);
    const billAmount = Number(bill.totalAmount ?? bill.totalPrice ?? 0);

    if (billDate >= monthStart) {
      const dayOfMonth = billDate.getDate();
      let week = dayOfMonth <= 7 ? "Week 1" : dayOfMonth <= 14 ? "Week 2" : dayOfMonth <= 21 ? "Week 3" : "Week 4";
      weeklyData[week] += billAmount;
    }
  });

  // Quarterly data for current year
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const quarterlyData = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };

  bills.forEach((bill) => {
    const billDate = new Date(bill.completedAt || bill.updatedAt || bill.createdAt);
    const billAmount = Number(bill.totalAmount ?? bill.totalPrice ?? 0);

    if (billDate >= yearStart) {
      const quarter = Math.floor(billDate.getMonth() / 3);
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      quarterlyData[quarters[quarter]] += billAmount;
    }
  });

  return {
    dailyBreakdown: dailyData.map(d => d.amount),
    dailyLabels: dailyData.map(d => d.label),
    weeklyBreakdown: Object.values(weeklyData),
    quarterlyBreakdown: Object.values(quarterlyData),
  };
};
