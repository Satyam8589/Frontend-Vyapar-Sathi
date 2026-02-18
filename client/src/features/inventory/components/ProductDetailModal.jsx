"use client";

import React from "react";

/**
 * ProductDetailModal Component - Displays comprehensive information about a specific product.
 */
const ProductDetailModal = ({
  isOpen,
  onClose,
  product,
  currencySymbol = "₹",
}) => {
  if (!isOpen || !product) return null;

  const lowStockThreshold = 10;
  const currentStock = product.quantity || product.qty || 0;
  const isLowStock = currentStock <= lowStockThreshold && currentStock > 0;
  const isOutOfStock = currentStock === 0;

  return (
    <div className="fixed top-24 inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold backdrop-blur-sm shadow-lg">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <span className="px-2.5 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-1.5 inline-block backdrop-blur-sm">
                {product.category || "General"}
              </span>
              <h2 className="text-xl font-black text-white tracking-tight">
                {product.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl text-white transition-all border border-white/20"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-slate-200 shadow-lg">
              <p className="text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                Stock Level
              </p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {currentStock}
                </span>
                <span className="text-sm text-slate-600 pb-1 font-bold">
                  {product.unit || "Units"}
                </span>
              </div>
              <div
                className={`mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-2 ${
                  isOutOfStock
                    ? "bg-red-100 text-red-700 border-red-200"
                    : isLowStock
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-emerald-100 text-emerald-700 border-emerald-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? "bg-red-500 animate-pulse" : isLowStock ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
                ></span>
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                    ? "Low Stock"
                    : "In Stock"}
              </div>
            </div>

            <div className="bg-slate-50/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-slate-200 shadow-lg">
              <p className="text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                Unit Price
              </p>
              <div className="flex items-end justify-start gap-1">
                <span className="text-3xl font-black text-slate-900">
                  {currencySymbol}
                  {(product.price || 0).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 font-bold">
                per {product.unit || "unit"}
              </p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-600 border border-slate-200">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-700">
                  Barcode
                </span>
              </div>
              <code className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {product.barcode || "N/A"}
              </code>
            </div>

            <div className="flex justify-between items-center py-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 rounded-xl text-slate-600 border border-slate-200">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Expiry Date
                </span>
              </div>
              <span
                className={`text-sm font-medium ${product.expDate ? "text-gray-900" : "text-gray-400"}`}
              >
                {product.expDate
                  ? new Date(product.expDate).toLocaleDateString()
                  : "Not specified"}
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
