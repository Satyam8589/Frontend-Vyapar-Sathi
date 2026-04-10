"use client";

import React from "react";
import ProductActionMenu from "./ProductActionMenu";

const InventoryTable = ({
  inventory,
  loading,
  onEdit,
  onDelete,
  onProductClick,
  lowStockThreshold = 10,
  currencySymbol = "₹",
}) => {
  if (loading && inventory.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center animate-pulse shadow-lg">
        <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-4"></div>
        <div className="h-4 w-40 bg-slate-200 rounded-lg mb-2"></div>
        <div className="h-3 w-32 bg-slate-100 rounded-lg"></div>
      </div>
    );
  }

  if (!loading && inventory.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-lg">
        <div className="h-20 w-20 bg-slate-50/80 text-slate-300 rounded-2xl flex items-center justify-center mb-6 border border-slate-100">
          <svg
            className="h-10 w-10"
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
        <h3 className="text-xl font-black text-slate-900">Empty Inventory</h3>
        <p className="text-slate-500 text-sm mt-2 font-semibold">
          No products found. Start by adding a new product.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in-up [animation-delay:300ms]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
              <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Product
              </th>
              {/* Category - Hidden on smaller mobile */}
              <th className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Category
              </th>
              {/* Stock Column */}
              <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Stock
              </th>
              {/* Price - Hidden on small mobile */}
              <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Price
              </th>
              {/* Exp. Date - Hidden on mobile */}
              <th className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Exp. Date
              </th>
              {/* Barcode - Hidden on mobile */}
              <th className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600">
                Barcode
              </th>
              {/* Mobile Actions Column - Shown on small screens */}
              <th className="md:hidden px-3 sm:px-4 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 text-center">
                Actions
              </th>
              {/* Desktop Actions Column - Hidden on mobile */}
              <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-600 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => (
              <tr
                key={item._id || item.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td
                  className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 cursor-pointer"
                  onClick={() => onProductClick?.(item)}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl object-cover border border-slate-200 group-hover:border-blue-300 transition-colors flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[9px] sm:text-xs flex-shrink-0 border border-slate-200 group-hover:border-blue-300 transition-colors">
                        IMG
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm truncate group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wide truncate">
                        View Details
                      </p>
                    </div>
                  </div>
                </td>
                {/* Category - Hidden on smaller mobile */}
                <td className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <span className="px-2.5 sm:px-3 py-1 bg-slate-100/80 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200 truncate inline-block">
                    {item.category}
                  </span>
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-sm sm:text-lg">
                      {item.quantity || item.qty || 0}
                    </span>
                    <span
                      className={`text-[8px] sm:text-[10px] font-bold uppercase italic mt-0.5 ${
                        (item.quantity || item.qty) > lowStockThreshold
                          ? "text-emerald-600"
                          : (item.quantity || item.qty) > 0
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {(item.quantity || item.qty) > lowStockThreshold
                        ? "In"
                        : (item.quantity || item.qty) > 0
                          ? "Low"
                          : "Out"}
                    </span>
                  </div>
                </td>
                {/* Price - Hidden on small mobile */}
                <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <p className="font-black text-slate-900 text-sm">
                    {currencySymbol}
                    {(item.price || 0).toFixed(2)}
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-slate-500 font-semibold">
                    per {(item.unit || "unit").toLowerCase()}
                  </p>
                </td>
                {/* Exp. Date - Hidden on mobile */}
                <td className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${item.expDate ? (new Date(item.expDate) < new Date("2026-03-01") ? "bg-amber-500 animate-pulse" : "bg-emerald-400") : "bg-slate-300"}`}
                    ></span>
                    <span className="font-bold text-slate-700 text-xs sm:text-sm truncate">
                      {item.expDate
                        ? new Date(item.expDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </td>
                {/* Barcode - Hidden on mobile */}
                <td className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                  <code className="text-[9px] sm:text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-md text-slate-700 border border-slate-200 truncate block">
                    {item.barcode}
                  </code>
                </td>
                {/* Mobile Actions - Shown on small screens */}
                <td className="md:hidden px-3 sm:px-4 py-3 sm:py-4">
                  <ProductActionMenu
                    onEdit={() => onEdit?.(item)}
                    onDelete={() => onDelete?.(item)}
                  />
                </td>
                {/* Desktop Actions - Hidden on mobile */}
                <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right">
                  <ProductActionMenu
                    onEdit={() => onEdit?.(item)}
                    onDelete={() => onDelete?.(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {inventory.length > 0 && (
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[8px] sm:text-[10px] text-slate-600 font-black uppercase tracking-widest">
            Showing {inventory.length} product{inventory.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled
            >
              Prev
            </button>
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-300 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled
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
