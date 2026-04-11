"use client";

import { BillHistory } from "@/features/InventoryBilling/components";
import { useParams } from "next/navigation";

/**
 * Billing History Page
 */
export default function BillingHistoryPage() {
  const params = useParams();
  const storeId = params.storeId;

  return (
    <div className="min-h-screen p-3 md:p-6 pt-10 md:pt-14">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Billing History</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">View and manage all past customer bills</p>
        </div>
        
        {/* Bill History Component */}
        <BillHistory isMobile={false} defaultOpen={true} />
      </div>
    </div>
  );
}
