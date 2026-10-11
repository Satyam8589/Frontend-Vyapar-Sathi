"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  RotateCw,
  PlusCircle,
  Package,
  ShoppingBag,
  Store as StoreIcon,
  Sparkles,
} from "lucide-react";

/**
 * OverviewHeader - Clean, modular header section for Store Overview
 * Includes store branding, contextual badges, and high-priority action buttons.
 */
export const OverviewHeader = ({
  storeId,
  storeName = "Store",
  onRefresh,
  isRefreshing = false,
}) => {
  const router = useRouter();
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-6 bg-white/70 backdrop-blur-md rounded-3xl border border-white/80 shadow-sm">
        {/* Left Side: Store title, greeting, and status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-xs">
              <StoreIcon className="w-3.5 h-3.5 text-blue-600" />
              Store Dashboard
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {currentDate}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>{storeName} Overview</span>
            <Sparkles className="w-5 h-5 text-amber-500 hidden sm:inline" />
          </h1>
          <p className="text-sm text-gray-600">
            Real-time financial performance, inventory valuation, and procurement snapshot.
          </p>
        </div>

        {/* Right Side: Header Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Refresh Data Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh overview metrics"
              aria-label="Refresh overview"
              className="p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RotateCw
                className={`w-4 h-4 text-gray-600 ${
                  isRefreshing ? "animate-spin text-blue-600" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          )}

          {/* Quick Action: New Purchase / Purchases */}
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-orange-50/50 text-orange-700 font-semibold text-xs sm:text-sm border border-orange-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-orange-600" />
            <span>Purchases</span>
          </button>

          {/* Quick Action: Inventory */}
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/inventory`)}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-blue-50/50 text-blue-700 font-semibold text-xs sm:text-sm border border-blue-200/80 shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>Inventory</span>
          </button>

          {/* Primary Action Button: New Bill */}
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/billing`)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>New Bill</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default OverviewHeader;
