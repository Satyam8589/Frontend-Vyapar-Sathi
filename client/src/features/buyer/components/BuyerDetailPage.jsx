"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getBuyerPurchases, updateBuyer, deleteBuyer, updateBuyerSale, deleteBuyerSale } from "../services/buyerService";
import BuyerFormModal from "./BuyerFormModal";
import { PurchasedItemsCell } from "./PurchasedItemsModal";
import { downloadBillPDF, printBillPDF } from "@/features/InventoryBilling/utils/pdfGenerator";
import { showSuccess, showError } from "@/utils/toast";

const currencyFormat = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0);

export default function BuyerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId;
  const buyerId = params.buyerId;

  const [buyerData, setBuyerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit Buyer modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit Sale modal
  const [editSaleItem, setEditSaleItem] = useState(null);
  const [saleForm, setSaleForm] = useState({ paymentStatus: "paid", paidAmount: 0, paymentMethod: "cash" });
  const [saleLoading, setSaleLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!storeId || !buyerId) return;
    try {
      setLoading(true);
      const data = await getBuyerPurchases(storeId, buyerId);
      setBuyerData(data);
      setError("");
    } catch (err) {
      console.error("[BUYER_DETAIL] Fetch error:", err);
      setError(err.message || "Failed to load buyer details");
    } finally {
      setLoading(false);
    }
  }, [storeId, buyerId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleEditBuyerSubmit = async (formData) => {
    try {
      setActionLoading(true);
      await updateBuyer(storeId, buyerId, formData);
      setIsEditModalOpen(false);
      showSuccess("Buyer information updated successfully!");
      fetchDetails();
    } catch (err) {
      showError(err.message || "Failed to update buyer");
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBuyerClick = async () => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;
    try {
      await deleteBuyer(storeId, buyerId);
      showSuccess("Buyer deleted successfully");
      router.push(`/storeDashboard/${storeId}/buyers`);
    } catch (err) {
      showError(err.message || "Failed to delete buyer");
    }
  };

  const handleOpenEditSale = (sale) => {
    setEditSaleItem(sale);
    setSaleForm({
      paymentStatus: sale.paymentStatus || "paid",
      paidAmount: sale.paidAmount ?? sale.totalAmount ?? 0,
      paymentMethod: sale.paymentMethod || sale.paymentId?.split("-")[0] || "cash",
    });
  };

  const handleSaveSaleSubmit = async (e) => {
    e.preventDefault();
    if (!editSaleItem) return;
    try {
      setSaleLoading(true);
      await updateBuyerSale(storeId, editSaleItem._id, saleForm);
      showSuccess("Transaction updated successfully!");
      setEditSaleItem(null);
      fetchDetails();
    } catch (err) {
      showError(err.message || "Failed to update transaction");
    } finally {
      setSaleLoading(false);
    }
  };

  const handleDeleteSaleClick = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this purchase transaction?")) return;
    try {
      await deleteBuyerSale(storeId, saleId);
      showSuccess("Transaction deleted successfully");
      fetchDetails();
    } catch (err) {
      showError(err.message || "Failed to delete transaction");
    }
  };

  const buyer = buyerData?.buyer;
  const purchases = buyerData?.purchases || [];

  if (loading) {
    return (
      <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
        <div className="h-10 bg-slate-200 rounded-xl animate-pulse w-48" />
        <div className="h-44 bg-white rounded-2xl border border-slate-100 p-6 animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="min-h-screen p-6 max-w-7xl mx-auto text-center py-16">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4">
          ⚠
        </div>
        <h2 className="text-xl font-bold text-slate-900">{error || "Buyer Not Found"}</h2>
        <p className="text-slate-500 text-sm mt-1">The requested buyer could not be located.</p>
        <Link
          href={`/storeDashboard/${storeId}/buyers`}
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-md"
        >
          ← Back to Buyers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 select-none">
      {/* Edit Buyer Modal */}
      <BuyerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditBuyerSubmit}
        loading={actionLoading}
        buyer={buyer}
      />

      {/* Edit Sale Modal */}
      {editSaleItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditSaleItem(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Edit Transaction #{editSaleItem.billNumber || editSaleItem._id?.slice(-8)}</h3>
              <button onClick={() => setEditSaleItem(null)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveSaleSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Total Bill Amount</label>
                <input
                  type="text"
                  disabled
                  value={currencyFormat(editSaleItem.totalAmount)}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  min="0"
                  max={editSaleItem.totalAmount}
                  step="0.01"
                  value={saleForm.paidAmount}
                  onChange={(e) => setSaleForm({ ...saleForm, paidAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Payment Status</label>
                <select
                  value={saleForm.paymentStatus}
                  onChange={(e) => setSaleForm({ ...saleForm, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  <option value="paid">PAID</option>
                  <option value="partial">PARTIAL</option>
                  <option value="unpaid">UNPAID</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={saleForm.paymentMethod}
                  onChange={(e) => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                >
                  <option value="cash">CASH</option>
                  <option value="upi">UPI</option>
                  <option value="card">CARD</option>
                  <option value="netbanking">NET BANKING</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditSaleItem(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saleLoading}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {saleLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full px-2 sm:px-3 md:px-4 py-3 sm:py-4 max-w-7xl mx-auto space-y-4">
        
        {/* Navigation & Compact Header Card */}
        <div className="flex items-center justify-between">
          <Link
            href={`/storeDashboard/${storeId}/buyers`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm w-fit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Buyers List
          </Link>
        </div>

        {/* Compact Buyer Header Info Card */}
        <section className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: Avatar & Info */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/20 flex-shrink-0">
                {buyer.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">
                    {buyer.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    buyer.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {buyer.status === "active" ? "Active Buyer" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
                  {buyer.phone && (
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {buyer.phone}
                    </span>
                  )}
                  {buyer.email && (
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {buyer.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Buyer Info
              </button>
              <button
                onClick={handleDeleteBuyerClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-xl transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </section>

        {/* Summary Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Purchases</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {buyerData?.totalPurchases || 0} <span className="text-xs font-semibold text-slate-400">orders</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Volume</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {currencyFormat(buyerData?.totalSales || buyer.totalSales)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount Paid</p>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {currencyFormat(buyerData?.totalPaid || buyer.totalPaid)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding Due</p>
            <p className={`text-2xl font-black mt-1 ${
              (buyerData?.totalDue || buyer.totalDue) > 0 ? "text-rose-600" : "text-slate-400"
            }`}>
              {currencyFormat(buyerData?.totalDue || buyer.totalDue)}
            </p>
          </div>
        </section>

        {/* Purchases / Transactions Table Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Purchase & Transaction History</h2>
              <p className="text-xs text-slate-500">List of all orders and bills processed for {buyer.name}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {purchases.length} Order{purchases.length !== 1 ? "s" : ""} Total
            </span>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 font-bold">Invoice / Sale ID</th>
                  <th className="px-4 py-3 font-bold">Date & Time</th>
                  <th className="px-4 py-3 font-bold">Items Purchased</th>
                  <th className="px-4 py-3 font-bold text-center">Payment Mode</th>
                  <th className="px-4 py-3 font-bold text-center">Payment Status</th>
                  <th className="px-4 py-3 font-bold text-right">Total Amount</th>
                  <th className="px-4 py-3 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-14 w-14 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-medium text-base">No transaction history found</p>
                        <p className="text-slate-400 mt-1">When bills are created for this buyer, they will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchases.map((sale) => (
                    <tr key={sale._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        #{sale.billNumber || sale._id?.slice(-8)?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {sale.completedAt
                          ? new Date(sale.completedAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700">
                        <PurchasedItemsCell
                          storeId={storeId}
                          sale={sale}
                          buyerName={buyer?.name}
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800 uppercase text-xs">
                        {sale.paymentMethod || sale.paymentId?.split("-")[0] || "CASH"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                          sale.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : sale.paymentStatus === "partial"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {sale.paymentStatus || "PAID"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-slate-900 text-right">
                        {currencyFormat(sale.totalAmount)}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Edit Transaction */}
                          <button
                            onClick={() => handleOpenEditSale(sale)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Transaction"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Delete Transaction */}
                          <button
                            onClick={() => handleDeleteSaleClick(sale._id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Transaction"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          {/* Print Invoice */}
                          <button
                            onClick={() => printBillPDF(sale)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Print Invoice"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>
                          {/* Download Invoice PDF */}
                          <button
                            onClick={() => downloadBillPDF(sale)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
