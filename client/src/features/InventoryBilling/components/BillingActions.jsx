"use client";

import { Package } from "lucide-react";
import { useManualProductAdd } from "../hooks";

export const BillingActions = () => {
  const { setIsModalOpen } = useManualProductAdd();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
        Quick Actions
      </h2>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm md:text-base"
      >
        <Package size={18} className="md:w-5 md:h-5" />
        Add Product Manually
      </button>

      <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-3 text-center">
        Can't scan? Add products from your inventory manually
      </p>
    </div>
  );
};
