"use client";

import { useParams } from "next/navigation";
import {
  BillingProvider,
  useBillingContext,
} from "@/features/InventoryBilling/context/billingContext";
import {
  BarcodeInput,
  BilledProductsList,
  BillingTotal,
  ManualProductModal,
  BillPreviewModal,
  BillingHeader,
  BillingActions,
  BillHistory,
  BillingSyncIndicator,
} from "@/features/InventoryBilling/components";

/**
 * Billing Page Content - Uses the billing context
 */
const BillingContent = () => {
  const params = useParams();
  const storeId = params.storeId;
  const { currentStore, loading, error } = useBillingContext();

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <BillingHeader storeId={storeId} storeName={currentStore?.name} />

        {/* Real-Time Sync Indicator */}
        <BillingSyncIndicator />

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barcode Scanner Input */}
            <BarcodeInput />

            {/* Billed Products List */}
            <BilledProductsList />
          </div>

          {/* Right Column - Actions & Total */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <BillingActions />

            {/* Billing Total & Payment */}
            <BillingTotal />
          </div>
        </div>

        {/* Bill History Section */}
        <div className="mt-8">
          <BillHistory />
        </div>

        {/* Modals */}
        <ManualProductModal />
        <BillPreviewModal />

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700 font-medium">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main Billing Page Component with Provider
 */
export default function BillingPage() {
  return (
    <BillingProvider>
      <BillingContent />
    </BillingProvider>
  );
}
