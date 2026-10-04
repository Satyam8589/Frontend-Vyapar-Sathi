import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getPurchaseAnalytics } from "../services/purchaseService";

export const usePurchaseAnalytics = () => {
  const { storeId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [range, setRange] = useState("30d");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    if (!storeId) return;

    try {
      if (isSilent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const params = { range };
      if (range === "custom") {
        if (customStartDate) params.startDate = customStartDate;
        if (customEndDate) params.endDate = customEndDate;
      }

      const res = await getPurchaseAnalytics(storeId, params);
      setData(res);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load purchase analytics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [storeId, range, customStartDate, customEndDate]);

  useEffect(() => {
    // Only fetch if not custom, or if custom and both dates are chosen
    if (range !== "custom" || (customStartDate && customEndDate)) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, range, customStartDate, customEndDate]);

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  /**
   * Export analytics data to CSV
   */
  const exportCsv = (type = "summary") => {
    if (!data) return;

    let csvContent = "";
    let filename = `purchase_analytics_${type}_${range}.csv`;

    if (type === "summary") {
      const summary = data.summary || {};
      const rows = [
        ["Metric", "Value"],
        ["Total Purchase (Gross)", summary.totalPurchase || 0],
        ["Purchase Orders", summary.purchaseOrders || 0],
        ["Amount Paid", summary.amountPaid || 0],
        ["Amount Due", summary.amountDue || 0],
        ["Returned Amount", summary.returnedAmount || 0],
        ["Net Purchase", summary.netPurchase || 0],
        ["Average Purchase", summary.averagePurchase || 0],
        ["Return Rate (%)", data.returnAnalysis?.returnRate || 0],
        ["Returned Quantity", data.returnAnalysis?.totalReturnedQuantity || 0],
        ["Return Count", data.returnAnalysis?.returnCount || 0],
      ];
      csvContent = rows.map((e) => e.map((cell) => `"${cell}"`).join(",")).join("\n");
    } else if (type === "suppliers") {
      const suppliers = data.supplierAnalysis || [];
      const headers = ["Supplier Name", "Phone", "Orders", "Purchase Value (INR)", "Paid (INR)", "Due (INR)", "Returned (INR)"];
      const rows = suppliers.map((s) => [
        s.sellerName || "Unknown",
        s.phone || "",
        s.purchaseCount || 0,
        s.totalPurchaseAmount || 0,
        s.amountPaid || 0,
        s.amountDue || 0,
        s.returnedAmount || 0,
      ]);
      csvContent = [headers, ...rows].map((e) => e.map((cell) => `"${cell}"`).join(",")).join("\n");
    } else if (type === "products") {
      const products = data.productAnalysis || [];
      const headers = ["Product Name", "SKU", "Category", "Purchased Quantity", "Purchase Value (INR)", "Returned Quantity", "Net Quantity"];
      const rows = products.map((p) => [
        p.name || "Unknown",
        p.sku || "",
        p.category || "",
        p.purchasedQuantity || 0,
        p.purchaseValue || 0,
        p.returnedQuantity || 0,
        p.netQuantity || 0,
      ]);
      csvContent = [headers, ...rows].map((e) => e.map((cell) => `"${cell}"`).join(",")).join("\n");
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    storeId,
    data,
    loading,
    refreshing,
    error,
    range,
    setRange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    fetchAnalytics,
    handleRefresh,
    exportCsv,
  };
};
