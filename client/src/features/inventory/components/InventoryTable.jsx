"use client";

import React from "react";
import ProductActionMenu from "./ProductActionMenu";

const getExpiryMeta = (expDate) => {
  if (!expDate) {
    return { dot: "bg-slate-300", label: "-" };
  }

  const expiry = new Date(expDate);
  if (Number.isNaN(expiry.getTime())) {
    return { dot: "bg-slate-300", label: "-" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const msDiff = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(msDiff / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return { dot: "bg-red-500", label: expiry.toLocaleDateString() };
  }

  if (daysLeft <= 30) {
    return { dot: "bg-amber-500 animate-pulse", label: expiry.toLocaleDateString() };
  }

  return { dot: "bg-emerald-400", label: expiry.toLocaleDateString() };
};

const InventoryTable = ({
  inventory,
  loading,
  onEdit,
  onDelete,
  onProductClick,
  lowStockThreshold = 10,
  currencySymbol = "₹",
  currentPage = 1,
  totalPages = 1,
  pageStart = 0,
  pageEnd = 0,
  totalFilteredCount = 0,
  onPageChange,
}) => {
  if (loading && inventory.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 p-6 sm:p-12 flex flex-col items-center justify-center animate-pulse shadow-lg">
        <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-4" />
        <div className="h-4 w-40 bg-slate-200 rounded-lg mb-2" />
        <div className="h-3 w-32 bg-slate-100 rounded-lg" />
      </div>
    );
  }

  if (!loading && inventory.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 p-6 sm:p-12 flex flex-col items-center justify-center text-center shadow-lg">
        <div className="h-16 w-16 sm:h-20 sm:w-20 bg-slate-50/80 text-slate-300 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 border border-slate-100">
          <svg
            className="h-8 w-8 sm:h-10 sm:w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-slate-900">No Matching Products</h3>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2 font-semibold">
          Try changing filters or search terms to find products.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in-up [animation-delay:300ms]">
      <div className="px-3 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-slate-600">
          Showing {pageStart}-{pageEnd} of {totalFilteredCount}
        </p>
        <p className="text-[10px] sm:text-xs font-semibold text-slate-500">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Product
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Category
              </th>
              <th className="md:hidden px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 text-center">
                Actions
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Stock
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Price
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Exp. Date
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Barcode
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => {
              const qty = Number(item.quantity ?? item.qty ?? 0);
              const category = item.category || "General";
              const barcode = item.barcode || "-";
              const expiry = getExpiryMeta(item.expDate);

              return (
                <tr
                  key={item._id || item.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td
                    className="px-3 sm:px-6 py-2 sm:py-4 cursor-pointer"
                    onClick={() => onProductClick?.(item)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-slate-200 group-hover:border-blue-300 transition-colors"
                        />
                      ) : (
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[8px] sm:text-xs flex-shrink-0 border border-slate-200 group-hover:border-blue-300 transition-colors">
                          IMG
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors text-xs sm:text-sm">
                          {item.name}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                          View Details
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <span className="px-2 sm:px-3 py-1 bg-slate-100/80 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
                      {category}
                    </span>
                  </td>

                  <td className="md:hidden px-3 sm:px-6 py-2 sm:py-4">
                    <ProductActionMenu
                      onEdit={() => onEdit?.(item)}
                      onDelete={() => onDelete?.(item)}
                    />
                  </td>

                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-xs sm:text-lg">{qty}</span>
                      <span
                        className={`text-[8px] sm:text-[10px] font-bold uppercase italic mt-0.5 ${
                          qty > lowStockThreshold
                            ? "text-emerald-600"
                            : qty > 0
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {qty > lowStockThreshold ? "In" : qty > 0 ? "Low" : "Out"}{" "}
                        <span className="hidden sm:inline">({item.unit || "pcs"})</span>
                      </span>
                    </div>
                  </td>

                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <p className="font-black text-slate-900 text-xs sm:text-base">
                      {currencySymbol}
                      {Number(item.price || 0).toFixed(2)}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-slate-500 font-semibold">
                      per {(item.unit || "unit").toLowerCase()}
                    </p>
                  </td>

                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${expiry.dot}`} />
                      <span className="font-bold text-slate-700 text-xs sm:text-sm">{expiry.label}</span>
                    </div>
                  </td>

                  <td className="px-3 sm:px-6 py-2 sm:py-4">
                    <code className="text-[8px] sm:text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-md text-slate-700 border border-slate-200 break-all sm:break-normal">
                      {barcode}
                    </code>
                  </td>

                  <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 text-right">
                    <ProductActionMenu
                      onEdit={() => onEdit?.(item)}
                      onDelete={() => onDelete?.(item)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {inventory.length > 0 && totalPages > 1 && (
        <div className="px-3 sm:px-6 py-2 sm:py-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <p className="text-[8px] sm:text-[10px] text-slate-600 font-black uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[8px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-xl text-[8px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default InventoryTable;