"use client";

import React from "react";

const stockFilterStyles = {
  all: "bg-slate-100 text-slate-700 border-slate-200",
  in_stock: "bg-emerald-50 text-emerald-700 border-emerald-200",
  low_stock: "bg-amber-50 text-amber-700 border-amber-200",
  out_of_stock: "bg-red-50 text-red-700 border-red-200",
};

const InventoryFilters = ({
  searchTerm,
  onSearchChange,
  onMenuClick,
  selectedCategory,
  onCategoryChange,
  categoryOptions,
  categoryProductCounts,
  stockFilter,
  onStockFilterChange,
  stockCounts,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalResults,
  activeFilterCount,
  onResetFilters,
}) => {
  return (
    <section className="mb-4 animate-fade-in-up [animation-delay:200ms]">
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-2 sm:gap-3">
          {/* Store Menu Button (Mobile/Tablet specific) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center flex-shrink-0"
            title="Open Store Menu"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search by name, barcode, brand, category..."
              className="w-full pl-9 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-xs sm:text-sm font-medium"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {activeFilterCount} active
              </span>
            )}
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="col-span-2 lg:col-span-1">
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {categoryOptions?.map((category) => {
                const label =
                  category === "all"
                    ? "All Categories"
                    : `${category} (${categoryProductCounts?.[category] || 0})`;
                return (
                  <option key={category} value={category}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
              Stock
            </label>
            <select
              value={stockFilter}
              onChange={(e) => onStockFilterChange(e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-xl font-medium outline-none cursor-pointer text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${stockFilterStyles[stockFilter] || stockFilterStyles.all}`}
            >
              <option value="all">All ({stockCounts?.all || 0})</option>
              <option value="in_stock">In Stock ({stockCounts?.in_stock || 0})</option>
              <option value="low_stock">Low Stock ({stockCounts?.low_stock || 0})</option>
              <option value="out_of_stock">
                Out of Stock ({stockCounts?.out_of_stock || 0})
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
              Sort
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
              <option value="stock-desc">Stock (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="price-asc">Price (Low to High)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
              Rows Per Page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none cursor-pointer text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <p className="text-[11px] sm:text-xs text-slate-600 font-semibold">
            Showing {totalResults} matching product{totalResults === 1 ? "" : "s"}
          </p>
          {activeFilterCount > 0 && (
            <span className="sm:hidden px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {activeFilterCount} active
            </span>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryFilters;
