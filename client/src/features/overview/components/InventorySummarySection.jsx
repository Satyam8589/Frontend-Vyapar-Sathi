"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatNumber } from "../services/overviewService";
import {
  PackageCheck,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

/**
 * InventorySummarySection - Modular card displaying inventory stock health
 * and urgent restock alerts.
 */
export const InventorySummarySection = ({ storeId, inventoryData, productsData }) => {
  const router = useRouter();

  const totalQuantity = inventoryData?.totalQuantity ?? 0;
  const lowStockCount = inventoryData?.lowStockCount ?? 0;
  const outOfStockCount = inventoryData?.outOfStockCount ?? 0;
  const inStockCount = inventoryData?.inStockCount ?? 0;

  const totalProducts = productsData?.totalProducts ?? 0;
  const criticalStock = productsData?.criticalStock || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* 1. Inventory Stock Health & Quantities */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                Stock Health
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                {formatNumber(totalQuantity)} Units
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl border border-emerald-100">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Active stock distribution across {totalProducts} catalog products.
          </p>

          <div className="space-y-2">
            {/* In stock */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-gray-800">In Stock</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700">
                {inStockCount} items
              </span>
            </div>

            {/* Low stock */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-gray-800">Low Stock Alert</span>
              </div>
              <span className="text-xs font-extrabold text-amber-700">
                {lowStockCount} items
              </span>
            </div>

            {/* Out of stock */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-gray-800">Out of Stock</span>
              </div>
              <span className="text-xs font-extrabold text-rose-700">
                {outOfStockCount} items
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push(`/storeDashboard/${storeId}/inventory`)}
          className="mt-3.5 w-full py-2 px-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-gray-200/80 cursor-pointer"
        >
          <span>Open Inventory Manager</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* 2. Urgent Restock Alerts / Low Stock Attention */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                Restock Attention
              </p>
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                {criticalStock.length > 0 ? "Critical Stock" : "Stock Alert"}
              </h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Products that are currently out of stock or nearing reorder threshold.
          </p>

          {criticalStock.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {criticalStock.map((prod) => (
                <div
                  key={prod._id}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-50/90 border border-gray-100 hover:bg-gray-100/80 transition-all text-xs"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-gray-900 truncate">{prod.name}</p>
                    <p className="text-[10px] text-gray-500">{prod.category || "General"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        prod.quantity <= 0
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {prod.quantity <= 0 ? "0 left" : `${prod.quantity} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
              <p className="text-xs font-bold text-gray-700">All products in good standing</p>
              <p className="text-[11px] text-gray-400 mt-0.5">No products currently below threshold</p>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
          className="mt-3.5 w-full py-2 px-3.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-orange-200 cursor-pointer"
        >
          <span>Create Restock Purchase</span>
          <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
        </button>
      </div>
    </div>
  );
};

export default InventorySummarySection;
