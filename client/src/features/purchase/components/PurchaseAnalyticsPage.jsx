"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Calendar,
  TrendingUp,
  Package,
  Users,
  CreditCard,
  RotateCcw,
  ShoppingBag,
  ArrowUpRight,
  AlertCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { usePurchaseAnalytics } from "../hooks/usePurchaseAnalytics";
import {
  PurchaseTrendChart,
  PurchaseOrderCountChart,
  TopSuppliersChart,
  PaymentStatusDonutChart,
} from "./PurchaseCharts";

const currencyFormat = (val) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="h-4 w-24 bg-slate-100 rounded" />
      <div className="h-8 w-8 bg-slate-100 rounded-xl" />
    </div>
    <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
    <div className="h-3 w-20 bg-slate-100 rounded" />
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse h-80 flex flex-col justify-between">
    <div className="h-5 w-40 bg-slate-200 rounded" />
    <div className="h-52 w-full bg-slate-100 rounded-xl" />
  </div>
);

export default function PurchaseAnalyticsPage() {
  const router = useRouter();
  const {
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
  } = usePurchaseAnalytics();

  // Sorting state for Products table
  const [productSortBy, setProductSortBy] = useState("purchasedQuantity"); // purchasedQuantity | purchaseValue | returnedQuantity | netQuantity
  const [productSortOrder, setProductSortOrder] = useState("desc");

  // Export dropdown state
  const [showExportMenu, setShowExportMenu] = useState(false);

  const summary = data?.summary || {};
  const returnAnalysis = data?.returnAnalysis || {};
  const paymentAnalysis = data?.paymentAnalysis || {};
  const supplierAnalysis = data?.supplierAnalysis || [];
  const productAnalysis = data?.productAnalysis || [];
  const topProductsByValue = data?.topProductsByValue || [];
  const purchaseTrend = data?.purchaseTrend || [];
  const recentPurchases = data?.recentPurchases || [];
  const largestPurchase = summary?.largestPurchase;

  // Sorted product list
  const sortedProducts = useMemo(() => {
    if (!productAnalysis.length) return [];
    return [...productAnalysis].sort((a, b) => {
      const valA = Number(a[productSortBy] || 0);
      const valB = Number(b[productSortBy] || 0);
      return productSortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [productAnalysis, productSortBy, productSortOrder]);

  const handleProductSort = (field) => {
    if (productSortBy === field) {
      setProductSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setProductSortBy(field);
      setProductSortOrder("desc");
    }
  };

  const hasPurchases = (summary?.purchaseOrders || 0) > 0;

  return (
    <div className="min-h-screen pb-12">
      <div className="w-full px-2 sm:px-4 md:px-6 py-4 max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <section className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Back to Purchases"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                  Analytics & Intelligence
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Purchase Analytics
              </h1>
            </div>
          </div>

          {/* Controls: Date Filter + Refresh + Export */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Range Selector */}
            <div className="relative inline-flex items-center">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="thisYear">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu((prev) => !prev)}
                className="px-3 py-2 text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {showExportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        exportCsv("summary");
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Export Summary KPI
                    </button>
                    <button
                      onClick={() => {
                        exportCsv("suppliers");
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Export Top Suppliers
                    </button>
                    <button
                      onClick={() => {
                        exportCsv("products");
                        setShowExportMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Export Top Products
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Custom Date Pickers (if Custom Range selected) */}
        {range === "custom" && (
          <section className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-wrap items-center gap-4 animate-in fade-in duration-200">
            <span className="text-xs sm:text-sm font-bold text-blue-900">Custom Date Range:</span>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Start:</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">End:</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
              />
            </div>
            <button
              onClick={() => fetchAnalytics()}
              disabled={!customStartDate || !customEndDate}
              className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Apply Filter
            </button>
          </section>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-800">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchAnalytics()}
              className="px-3 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonChart />
              <SkeletonChart />
            </div>
          </div>
        ) : !hasPurchases ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No purchase data available</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              There were no purchase transactions found for the selected period. Try picking another date range.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setRange("thisYear")}
                className="px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                View This Year
              </button>
              <button
                onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Go to Purchases
              </button>
            </div>
          </div>
        ) : (
          /* Analytics Content */
          <>
            {/* Top Summary Cards */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Total Purchase (Gross) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Purchase</span>
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currencyFormat(summary.totalPurchase)}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-2">
                  Gross invoice value
                </div>
              </div>

              {/* Purchase Orders */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Purchase Orders</span>
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {summary.purchaseOrders || 0}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-2">
                  Completed orders
                </div>
              </div>

              {/* Amount Paid */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Amount Paid</span>
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                    {currencyFormat(summary.amountPaid)}
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-2">
                  {summary.totalPurchase > 0
                    ? `${((summary.amountPaid / summary.totalPurchase) * 100).toFixed(0)}% paid`
                    : "0% paid"}
                </div>
              </div>

              {/* Amount Due */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Amount Due</span>
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                    {currencyFormat(summary.amountDue)}
                  </div>
                </div>
                <div className="text-[11px] text-rose-600 font-semibold mt-2">
                  {summary.amountDue > 0 ? "Pending payment" : "Fully settled"}
                </div>
              </div>

              {/* Returned Amount */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Returned Amount</span>
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
                    {currencyFormat(summary.returnedAmount)}
                  </div>
                </div>
                <div className="text-[11px] text-amber-700 font-semibold mt-2">
                  {returnAnalysis.returnRate || 0}% return rate
                </div>
              </div>

              {/* Net Purchase */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-blue-500/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-blue-100 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Net Purchase</span>
                    <div className="p-1.5 rounded-lg bg-white/20 text-white">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {currencyFormat(summary.netPurchase)}
                  </div>
                </div>
                <div className="text-[11px] text-blue-100 font-medium mt-2">
                  Gross − Returned
                </div>
              </div>
            </section>

            {/* KPI Secondary Row: Average Purchase & Largest Purchase */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Average Purchase Value */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Average Purchase Value
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {currencyFormat(summary.averagePurchase)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Per transaction across {summary.purchaseOrders} orders
                  </p>
                </div>
              </div>

              {/* Largest Purchase Highlight */}
              {largestPurchase ? (
                <div
                  onClick={() => router.push(`/storeDashboard/${storeId}/purchases/${largestPurchase._id}`)}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Largest Purchase
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                          Top Record
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                        {currencyFormat(largestPurchase.grandTotal)}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold text-slate-800">{largestPurchase.sellerName}</span> &bull; Inv:{" "}
                        <span className="font-mono text-slate-700">{largestPurchase.invoiceNumber}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>View Details</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm md:col-span-2 flex items-center text-slate-400 text-sm">
                  No purchases to highlight
                </div>
              )}
            </section>

            {/* Charts Section: Purchase Amount Trend + Purchase Orders Trend */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Purchase Amount Trend */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Purchase Trend</h2>
                    <p className="text-xs text-slate-500">Purchase & paid amount over time</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    {data?.dateRange?.isMonthly ? "Monthly" : "Daily"}
                  </span>
                </div>
                <PurchaseTrendChart trend={purchaseTrend} />
              </div>

              {/* Purchase Orders Trend */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Purchase Order Count</h2>
                    <p className="text-xs text-slate-500">Number of purchase transactions</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                    {summary.purchaseOrders} Total
                  </span>
                </div>
                <PurchaseOrderCountChart trend={purchaseTrend} />
              </div>
            </section>

            {/* Supplier Analysis & Top Supplier Chart */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Suppliers Visual Chart */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm lg:col-span-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-slate-900">Purchase by Supplier</h2>
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Top suppliers by total purchase value</p>
                  <TopSuppliersChart suppliers={supplierAnalysis} />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  Total suppliers evaluated: <span className="font-bold text-slate-800">{supplierAnalysis.length}</span>
                </div>
              </div>

              {/* Top Suppliers Table */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Top Suppliers Breakdown</h2>
                    <p className="text-xs text-slate-500">Order count, purchase amount, and due status</p>
                  </div>
                  <button
                    onClick={() => exportCsv("suppliers")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pl-2">Supplier</th>
                        <th className="pb-3 text-center">Orders</th>
                        <th className="pb-3 text-right">Purchase Value</th>
                        <th className="pb-3 text-right">Paid</th>
                        <th className="pb-3 text-right">Due</th>
                        <th className="pb-3 text-right pr-2">Returned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {supplierAnalysis.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-6 text-center text-slate-400">
                            No supplier data found
                          </td>
                        </tr>
                      ) : (
                        supplierAnalysis.map((s, idx) => (
                          <tr key={s.sellerId || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 pl-2 font-bold text-slate-800">
                              <div>{s.sellerName}</div>
                              {s.phone && <div className="text-[11px] text-slate-400 font-normal">{s.phone}</div>}
                            </td>
                            <td className="py-3 text-center font-semibold text-slate-700">
                              {s.purchaseCount}
                            </td>
                            <td className="py-3 text-right font-black text-slate-900">
                              {currencyFormat(s.totalPurchaseAmount)}
                            </td>
                            <td className="py-3 text-right font-semibold text-emerald-600">
                              {currencyFormat(s.amountPaid)}
                            </td>
                            <td className="py-3 text-right font-semibold text-rose-600">
                              {currencyFormat(s.amountDue)}
                            </td>
                            <td className="py-3 text-right font-semibold text-amber-600 pr-2">
                              {currencyFormat(s.returnedAmount)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Product-Wise Purchase Analysis & Top Products by Value */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Purchased Products Table (2 Columns) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Top Purchased Products</h2>
                    <p className="text-xs text-slate-500">
                      Click column headers to sort by Quantity, Value, Returned, or Net
                    </p>
                  </div>
                  <button
                    onClick={() => exportCsv("products")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 pl-2">Product</th>
                        <th
                          onClick={() => handleProductSort("purchasedQuantity")}
                          className="pb-3 text-right cursor-pointer hover:text-blue-600"
                        >
                          Purchased {productSortBy === "purchasedQuantity" ? (productSortOrder === "asc" ? "↑" : "↓") : ""}
                        </th>
                        <th
                          onClick={() => handleProductSort("purchaseValue")}
                          className="pb-3 text-right cursor-pointer hover:text-blue-600"
                        >
                          Value {productSortBy === "purchaseValue" ? (productSortOrder === "asc" ? "↑" : "↓") : ""}
                        </th>
                        <th
                          onClick={() => handleProductSort("returnedQuantity")}
                          className="pb-3 text-right cursor-pointer hover:text-blue-600"
                        >
                          Returned {productSortBy === "returnedQuantity" ? (productSortOrder === "asc" ? "↑" : "↓") : ""}
                        </th>
                        <th
                          onClick={() => handleProductSort("netQuantity")}
                          className="pb-3 text-right pr-2 cursor-pointer hover:text-blue-600"
                        >
                          Net Qty {productSortBy === "netQuantity" ? (productSortOrder === "asc" ? "↑" : "↓") : ""}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sortedProducts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-slate-400">
                            No product records found
                          </td>
                        </tr>
                      ) : (
                        sortedProducts.map((p, idx) => (
                          <tr key={p.productId || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 pl-2 font-bold text-slate-800">
                              <div>{p.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {p.sku || p.category || "General"}
                              </div>
                            </td>
                            <td className="py-3 text-right font-semibold text-slate-700">
                              {p.purchasedQuantity}
                            </td>
                            <td className="py-3 text-right font-black text-slate-900">
                              {currencyFormat(p.purchaseValue)}
                            </td>
                            <td className="py-3 text-right font-semibold text-rose-600">
                              {p.returnedQuantity || 0}
                            </td>
                            <td className="py-3 text-right font-bold text-emerald-700 pr-2">
                              {p.netQuantity}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products by Value (Ranked Card) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm lg:col-span-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-1">Highest Value Products</h2>
                  <p className="text-xs text-slate-500 mb-4">Products consuming the most purchase funds</p>

                  <div className="space-y-3.5">
                    {topProductsByValue.slice(0, 6).map((item, idx) => {
                      const totalPurch = summary.totalPurchase || 1;
                      const pct = Math.min(100, ((item.purchaseValue / totalPurch) * 100).toFixed(1));

                      return (
                        <div key={item.productId || idx} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 truncate max-w-[170px]">
                              {idx + 1}. {item.name}
                            </span>
                            <span className="font-black text-slate-900">
                              {currencyFormat(item.purchaseValue)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{item.purchasedQuantity} units</span>
                            <span>{pct}% of purchases</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  Focus restocking & price negotiation on high-value products.
                </div>
              </div>
            </section>

            {/* Payment Analytics & Return Analytics */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Analytics */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-slate-900">Payment Analytics</h2>
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Paid vs pending purchase obligations</p>

                  <PaymentStatusDonutChart paymentAnalysis={paymentAnalysis} />

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase">Paid</div>
                      <div className="text-sm font-black text-emerald-900 mt-0.5">
                        {currencyFormat(paymentAnalysis.statusAmounts?.paid)}
                      </div>
                      <div className="text-[10px] text-emerald-600">
                        {paymentAnalysis.statusCounts?.paid || 0} orders
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="text-[10px] font-bold text-amber-700 uppercase">Partial</div>
                      <div className="text-sm font-black text-amber-900 mt-0.5">
                        {currencyFormat(paymentAnalysis.statusAmounts?.partial)}
                      </div>
                      <div className="text-[10px] text-amber-600">
                        {paymentAnalysis.statusCounts?.partial || 0} orders
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                      <div className="text-[10px] font-bold text-rose-700 uppercase">Unpaid</div>
                      <div className="text-sm font-black text-rose-900 mt-0.5">
                        {currencyFormat(paymentAnalysis.statusAmounts?.unpaid)}
                      </div>
                      <div className="text-[10px] text-rose-600">
                        {paymentAnalysis.statusCounts?.unpaid || 0} orders
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Intelligence & Breakdown */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-bold text-slate-900">Return Intelligence</h2>
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Stock reversal and return metrics</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Returned Amount
                      </span>
                      <div className="text-xl font-black text-slate-900 mt-0.5">
                        {currencyFormat(returnAnalysis.totalReturnedAmount)}
                      </div>
                      <span className="text-xs font-semibold text-rose-600 mt-0.5 inline-block">
                        {returnAnalysis.returnRate || 0}% Return Rate
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Returned Quantity
                      </span>
                      <div className="text-xl font-black text-slate-900 mt-0.5">
                        {returnAnalysis.totalReturnedQuantity || 0} units
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 inline-block">
                        Across {returnAnalysis.returnCount || 0} return actions
                      </span>
                    </div>
                  </div>

                  {/* Return Reasons Breakdown */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Return Reasons</span>
                    {returnAnalysis.reasonBreakdown && returnAnalysis.reasonBreakdown.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {returnAnalysis.reasonBreakdown.map((r, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-xs font-medium text-rose-800 flex items-center gap-1.5"
                          >
                            <span className="font-bold">{r.reason}:</span>
                            <span>{r.count}x</span>
                            <span className="font-bold text-rose-900">({currencyFormat(r.amount)})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl text-center">
                        No return reasons recorded in this period.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Purchases Table */}
            <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Purchases</h2>
                  <p className="text-xs text-slate-500">Latest purchase orders in the chosen period</p>
                </div>
                <button
                  onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>View All Purchases</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Invoice No</th>
                      <th className="pb-3">Supplier</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-center">Items</th>
                      <th className="pb-3 text-right">Grand Total</th>
                      <th className="pb-3 text-right">Paid</th>
                      <th className="pb-3 text-right">Due</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentPurchases.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-6 text-center text-slate-400">
                          No recent purchases found
                        </td>
                      </tr>
                    ) : (
                      recentPurchases.map((p) => (
                        <tr
                          key={p._id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => router.push(`/storeDashboard/${storeId}/purchases/${p._id}`)}
                        >
                          <td className="py-3 pl-2 font-bold text-slate-900 font-mono">
                            {p.invoiceNumber}
                          </td>
                          <td className="py-3 font-semibold text-slate-700">
                            {p.sellerName}
                          </td>
                          <td className="py-3 text-slate-500 text-xs">
                            {new Date(p.purchaseDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 text-center font-medium text-slate-600">
                            {p.itemsCount}
                          </td>
                          <td className="py-3 text-right font-black text-slate-900">
                            {currencyFormat(p.grandTotal)}
                          </td>
                          <td className="py-3 text-right font-bold text-emerald-600">
                            {currencyFormat(p.paidAmount)}
                          </td>
                          <td className="py-3 text-right font-bold text-rose-600">
                            {currencyFormat(p.dueAmount)}
                          </td>
                          <td className="py-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.paymentStatus === "paid"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : p.paymentStatus === "partial"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {p.paymentStatus?.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-right pr-2">
                            <Link
                              href={`/storeDashboard/${storeId}/purchases/${p._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <span>View</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
