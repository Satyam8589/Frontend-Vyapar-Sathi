"use client";

import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useManualProductAdd } from "../hooks";

export const BillingHeader = ({ storeId, storeName, isMobile }) => {
  const router = useRouter();
  const { setIsModalOpen } = useManualProductAdd();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          {!isMobile && (
            <button
              onClick={() => router.push(`/storeDashboard/${storeId}`)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} className="md:w-6 md:h-6" />
            </button>
          )}

          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart size={24} className="md:w-8 md:h-8" />
              <span className="hidden sm:inline">Billing System</span>
              <span className="sm:hidden">Billing</span>
            </h1>
            {storeName && (
              <p className="text-sm md:text-base text-gray-600 mt-1 truncate max-w-[200px] md:max-w-none">
                {storeName}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 md:w-auto md:px-6 md:text-base"
          >
            <Package size={18} />
            Add Product Manually
          </button>
        </div>
      </div>
    </div>
  );
};
