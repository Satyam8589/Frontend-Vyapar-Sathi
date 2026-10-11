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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* 1. Suppliers & Procurement Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-lg border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Suppliers & Procurement
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                {totalSellers} Registered Vendors
              </h3>
            </div>
            <div className="p-3 bg-orange-500/10 text-orange-600 rounded-2xl border border-orange-100">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Procurement expenses and vendor dues summary.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Active Vendors</span>
              </div>
              <p className="text-xl font-extrabold text-gray-900">{activeSellers}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Of {totalSellers} total registered</p>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50/90 border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Total Invoices</span>
              </div>
              <p className="text-xl font-extrabold text-gray-900">{totalPurchases}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">All-time purchase orders</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100/80 space-y-2 mb-2">
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
            <div className="pt-2 border-t border-orange-200/60 flex justify-between items-center text-xs">
              <span className="font-bold text-rose-700">Outstanding Payables</span>
              <span className="font-extrabold text-rose-700">
                {formatCurrency(totalSellerDue)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/sellers`)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-gray-200 cursor-pointer"
          >
            <span>Vendors Directory</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Purchase History</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* 2. Top-Selling Products Leaderboard */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-lg border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Top Performers
              </p>
              <h3 className="text-2xl font-black text-gray-900">
                Best-Selling Products
              </h3>
            </div>
            <div className="p-3 bg-pink-500/10 text-pink-600 rounded-2xl border border-pink-100">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-5">
            Top volume generators and sales leaders in this store.
          </p>

          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:bg-gray-100/60 transition-all text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[11px] flex-shrink-0 ${
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
            <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-600">No sales transactions yet</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Top-selling items will appear here after orders</p>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push(`/storeDashboard/${storeId}/inventory`)}
          className="mt-5 w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-gray-200 cursor-pointer"
        >
          <span>View All Products in Catalog</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default SuppliersAndPurchasesSection;
