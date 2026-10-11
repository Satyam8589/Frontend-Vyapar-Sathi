"use client";

import React from "react";
import { formatCurrency, formatNumber } from "../services/overviewService";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Truck,
} from "lucide-react";

/**
 * OverviewMetricsCards - High-level performance cards for Sales, Orders, Inventory, and Procurement
 */
export const OverviewMetricsCards = ({ salesData, inventoryData, purchasesData, sellersData }) => {
  const totalSales = salesData?.totalSales ?? 0;
  const totalOrders = salesData?.totalOrders ?? 0;
  const salesGrowth = salesData?.salesGrowth;
  const ordersGrowth = salesData?.ordersGrowth;

  const totalStockQuantity = inventoryData?.totalQuantity ?? 0;
  const totalStockValue = inventoryData?.totalValue ?? 0;
  const lowStockCount = inventoryData?.lowStockCount ?? 0;
  const outOfStockCount = inventoryData?.outOfStockCount ?? 0;

  const totalPurchases = purchasesData?.totalAmount ?? 0;
  const totalDueToSellers = sellersData?.totalDue ?? purchasesData?.dueAmount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* 1. Total Sales Revenue */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-white transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Total Revenue
            </p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {formatCurrency(totalSales)}
            </h3>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/20 text-blue-600 rounded-xl border border-blue-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100/80">
          {salesGrowth?.isNeutral ? (
            <span className="text-xs font-semibold text-gray-500">
              {salesGrowth?.text || "0% from last month"}
            </span>
          ) : salesGrowth?.isPositive ? (
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {salesGrowth?.text}
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-bold text-rose-600">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {salesGrowth?.text}
            </span>
          )}
        </div>
      </div>

      {/* 2. Total Orders */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-white transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {formatNumber(totalOrders)}
            </h3>
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/20 text-purple-600 rounded-xl border border-purple-100">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100/80">
          {ordersGrowth?.isNeutral ? (
            <span className="text-xs font-semibold text-gray-500">
              {ordersGrowth?.text || "0% from last month"}
            </span>
          ) : ordersGrowth?.isPositive ? (
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {ordersGrowth?.text}
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-bold text-rose-600">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              {ordersGrowth?.text}
            </span>
          )}
        </div>
      </div>

      {/* 3. Inventory Stock Valuation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-white transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Inventory Value
            </p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {formatCurrency(totalStockValue)}
            </h3>
          </div>
          <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 rounded-xl border border-emerald-100">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100/80 text-xs">
          <span className="text-gray-500 font-medium">
            {formatNumber(totalStockQuantity)} total units
          </span>
          {(lowStockCount > 0 || outOfStockCount > 0) ? (
            <span className="inline-flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              {lowStockCount + outOfStockCount} need stock
            </span>
          ) : (
            <span className="text-emerald-600 font-semibold">Healthy stock</span>
          )}
        </div>
      </div>

      {/* 4. Purchases & Payables */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl border border-white transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Purchases Spend
            </p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {formatCurrency(totalPurchases)}
            </h3>
          </div>
          <div className="p-3 bg-gradient-to-br from-orange-500/10 to-orange-600/20 text-orange-600 rounded-xl border border-orange-100">
            <Truck className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100/80 text-xs">
          <span className="text-gray-500 font-medium">
            Due to Sellers:
          </span>
          <span className={`font-bold ${totalDueToSellers > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {formatCurrency(totalDueToSellers)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OverviewMetricsCards;
