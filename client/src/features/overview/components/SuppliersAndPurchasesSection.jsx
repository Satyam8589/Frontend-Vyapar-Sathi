"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatNumber } from "../services/overviewService";
import {
  Users,
  Award,
  Truck,
  ArrowRight,
  Receipt,
  ExternalLink,
} from "lucide-react";

/**
 * SuppliersAndPurchasesSection - Modular card displaying supplier procurement details
 * alongside the store's top best-selling products.
 */
export const SuppliersAndPurchasesSection = ({
  storeId,
  purchasesData,
  sellersData,
  topProducts = [],
}) => {
  const router = useRouter();

  const totalSellers = sellersData?.totalSellers ?? 0;
  const activeSellers = sellersData?.activeSellers ?? 0;
  const totalSellerDue = sellersData?.totalDue ?? purchasesData?.dueAmount ?? 0;

  const totalPurchases = purchasesData?.totalPurchases ?? 0;
  const totalPurchaseAmount = purchasesData?.totalAmount ?? 0;
  const monthlyPurchases = purchasesData?.monthlyPurchases ?? 0;
  const monthlyPurchasesCount = purchasesData?.monthlyPurchasesCount ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* 1. Suppliers & Procurement Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                Suppliers & Procurement
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                {totalSellers} Registered Vendors
              </h3>
            </div>
            <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl border border-orange-100">
              <Truck className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Procurement expenses and vendor dues summary.
          </p>

          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <div className="p-3 rounded-xl bg-gray-50/90 border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Active Vendors</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900">{activeSellers}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Of {totalSellers} total registered</p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50/90 border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Total Invoices</span>
              </div>
              <p className="text-lg font-extrabold text-gray-900">{totalPurchases}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">All-time purchase orders</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100/80 space-y-1.5 mb-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-medium">This Month Procurement</span>
              <span className="font-extrabold text-gray-900">
                {formatCurrency(monthlyPurchases)} ({monthlyPurchasesCount} orders)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 font-medium">All-time Purchases</span>
              <span className="font-extrabold text-gray-900">
                {formatCurrency(totalPurchaseAmount)}
              </span>
            </div>
            <div className="pt-1.5 border-t border-orange-200/60 flex justify-between items-center text-xs">
              <span className="font-bold text-rose-700">Outstanding Payables</span>
              <span className="font-extrabold text-rose-700">
                {formatCurrency(totalSellerDue)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-3">
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/sellers`)}
            className="flex-1 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-gray-200 cursor-pointer"
          >
            <span>Vendors Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
            className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Purchase History</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* 2. Top-Selling Products Leaderboard */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                Top Performers
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Best-Selling Products
              </h3>
            </div>
            <div className="p-2.5 bg-pink-500/10 text-pink-600 rounded-xl border border-pink-100">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Top volume generators and sales leaders in this store.
          </p>

          {topProducts.length > 0 ? (
            <div className="space-y-2">
              {topProducts.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100/60 transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[10px] flex-shrink-0 ${
                        idx === 0
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : idx === 1
                          ? "bg-slate-200 text-slate-800"
                          : idx === 2
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-bold text-gray-900 truncate">{item.name}</span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-gray-900">
                      {formatNumber(item.unitsSold || item.quantity || 0)} sold
                    </p>
                    {item.revenue > 0 && (
                      <p className="text-[10px] text-emerald-600 font-semibold">
                        {formatCurrency(item.revenue)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <Award className="w-8 h-8 text-gray-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-gray-600">No sales transactions yet</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Top-selling items will appear here after orders</p>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push(`/storeDashboard/${storeId}/inventory`)}
          className="mt-3 w-full py-2 px-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-gray-200 cursor-pointer"
        >
          <span>View All Products in Catalog</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default SuppliersAndPurchasesSection;
