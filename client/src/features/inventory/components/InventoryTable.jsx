"use client";

import React from "react";

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
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600">
                Product
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600">
                Category
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600">
                Stock
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600">
                Price
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600">
                Exp. Date
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600">
                Barcode
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-600 text-right">
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
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => onProductClick?.(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs flex-shrink-0 border border-slate-200 group-hover:border-blue-300 transition-colors">
                      IMG
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                        View Details
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100/80 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-lg">
                      {item.quantity || item.qty || 0}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase italic mt-0.5 ${
                        (item.quantity || item.qty) > lowStockThreshold
                          ? "text-emerald-600"
                          : (item.quantity || item.qty) > 0
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {(item.quantity || item.qty) > lowStockThreshold
                        ? "In Stock"
                        : (item.quantity || item.qty) > 0
                          ? "Low Stock"
                          : "Out"}{" "}
                      ({item.unit || "pcs"})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-black text-slate-900">
                    {currencySymbol}
                    {(item.price || 0).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    per {(item.unit || "unit").toLowerCase()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${item.expDate ? (new Date(item.expDate) < new Date("2026-03-01") ? "bg-amber-500 animate-pulse" : "bg-emerald-400") : "bg-slate-300"}`}
                    ></span>
                    <span className="font-bold text-slate-700 text-sm">
                      {item.expDate
                        ? new Date(item.expDate).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-md text-slate-700 border border-slate-200">
                    {item.barcode}
                  </code>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit?.(item)}
                      className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                      title="Edit Product"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete?.(item)}
                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all"
                      title="Delete Product"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {inventory.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
            Showing {inventory.length} product
            {inventory.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              disabled
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
