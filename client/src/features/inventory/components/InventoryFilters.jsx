"use client";

import React from "react";

const InventoryFilters = ({ searchTerm, setSearchTerm, onMenuClick }) => {
  return (
    <section className="mb-4 animate-fade-in-up [animation-delay:200ms]">
      <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200 shadow-sm">
        <div className="flex flex-row gap-1 sm:gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-2 sm:pr-4 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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
          <div className="flex gap-1 sm:gap-2">
            <select className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 outline-none cursor-pointer text-xs sm:text-sm min-w-fit sm:min-w-[140px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option>All</option>
              <option>Beverages</option>
              <option>Bakery</option>
              <option>Dairy</option>
            </select>

            {/* Store Settings Button */}
            <button
              onClick={onMenuClick}
              className="p-1.5 sm:p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all flex-shrink-0"
              title="Store Information"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryFilters;
