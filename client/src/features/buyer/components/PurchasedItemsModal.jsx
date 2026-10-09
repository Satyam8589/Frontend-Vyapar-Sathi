import React, { useState, useEffect } from "react";
import { Package, X, ShoppingBag, Tag, Layers, Loader2, Eye, RefreshCw } from "lucide-react";
import { getBuyerSaleById } from "../services/buyerService";

/**
 * Utility to safely extract properties from item objects across various schema versions
 */
const getItemDetails = (item) => {
  const name = item.nameSnapshot || item.name || item.title || "Product Item";
  const category = item.categorySnapshot || item.category || "General";
  const qty = Number(item.quantity || item.billedQuantity || item.qty || 1);
  const unitPrice = Number(item.unitPrice ?? item.priceSnapshot ?? item.price ?? item.sellingPrice ?? 0);
  const lineTotal = Number(item.lineTotal ?? (qty * unitPrice));

  return { name, category, qty, unitPrice, lineTotal };
};

const formatPrice = (val) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
};

/**
 * Modal Component that lazily fetches sale & product details from backend on demand
 */
export const PurchasedItemsModal = ({
  isOpen,
  onClose,
  storeId,
  saleId,
  billNumber = "—",
  date = null,
  totalAmount = 0,
  paymentStatus = "paid",
  buyerName = "",
}) => {
  const [saleDetails, setSaleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && storeId && saleId) {
      fetchSaleDetails();
    } else if (!isOpen) {
      // Reset state when closed
      setSaleDetails(null);
      setError("");
    }
  }, [isOpen, storeId, saleId]);

  const fetchSaleDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getBuyerSaleById(storeId, saleId);
      setSaleDetails(res.data || res.sale || res);
    } catch (err) {
      console.error("[PURCHASED_ITEMS_MODAL] Error fetching sale from backend:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch items from backend");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const items = saleDetails?.items || [];
  const totalQty = items.reduce((acc, item) => acc + getItemDetails(item).qty, 0);

  const formattedDate = (saleDetails?.completedAt || date)
    ? new Date(saleDetails?.completedAt || date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const displayBillNumber = saleDetails?.billNumber || billNumber;
  const displayTotalAmount = saleDetails?.totalAmount ?? totalAmount;
  const displayPaymentStatus = saleDetails?.paymentStatus || paymentStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Purchased Items Breakdown</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Bill #{displayBillNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {buyerName ? `Customer: ${buyerName} • ` : ""}{formattedDate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-800">Fetching products from backend...</p>
            <p className="text-xs text-slate-400 mt-1">Please wait while sale items are retrieved.</p>
          </div>
        ) : error ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-red-50 text-red-600 rounded-full mb-3">
              <X className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-900 mb-1">Failed to Load Products</p>
            <p className="text-xs text-slate-500 max-w-sm mb-4">{error}</p>
            <button
              onClick={fetchSaleDetails}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Fetching
            </button>
          </div>
        ) : (
          <>
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border-b border-slate-100">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Items</p>
                  <p className="text-sm font-extrabold text-slate-900">{items.length} Product{items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Quantity</p>
                  <p className="text-sm font-extrabold text-slate-900">{totalQty} Unit{totalQty !== 1 ? "s" : ""}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Grand Total</p>
                  <p className="text-sm font-black text-emerald-600">{formatPrice(displayTotalAmount)}</p>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-y-auto flex-1 p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3 rounded-l-lg">#</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No items recorded for this transaction.
                      </td>
                    </tr>
                  ) : (
                    items.map((rawItem, idx) => {
                      const { name, category, qty, unitPrice, lineTotal } = getItemDetails(rawItem);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-900">{name}</p>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              {category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs">
                              x{qty}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-slate-600">
                            {formatPrice(unitPrice)}
                          </td>
                          <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                            {formatPrice(lineTotal)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase ${
                  displayPaymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : displayPaymentStatus === "partial"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {displayPaymentStatus}
                </span>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Reusable cell component for table rendering: Shows an interactive button that triggers on-demand backend fetching
 */
export const PurchasedItemsCell = ({ storeId, sale = {}, buyerName = "" }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const itemCount = sale.items?.length || 0;

  return (
    <>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/80 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-xs group"
          title="Click to fetch and view products from backend"
        >
          <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
          <span>View Products {itemCount > 0 ? `(${itemCount})` : ""}</span>
        </button>
      </div>

      <PurchasedItemsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        storeId={storeId}
        saleId={sale._id}
        billNumber={sale.billNumber || sale._id?.slice(-8)?.toUpperCase()}
        date={sale.completedAt}
        totalAmount={sale.totalAmount}
        paymentStatus={sale.paymentStatus}
        buyerName={buyerName}
      />
    </>
  );
};
