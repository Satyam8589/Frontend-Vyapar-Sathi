"use client";

import React from "react";

const InventoryFilters = ({ searchTerm, setSearchTerm, onMenuClick }) => {
  return (
    <section className="mb-4 animate-fade-in-up [animation-delay:200ms]">
      <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 pr-2 sm:pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <select className="px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 outline-none cursor-pointer text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option>All</option>
              <option>Beverages</option>
              <option>Bakery</option>
              <option>Dairy</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryFilters;
