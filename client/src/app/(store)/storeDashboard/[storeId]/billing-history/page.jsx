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
    <div className="min-h-screen p-2 md:p-4 pt-2 md:pt-6">
      <div className="mx-auto">
        <div className="mb-4 mt-1">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Billing History</h1>
          <p className="text-gray-500 text-xs font-medium mt-0.5">View and manage all past customer bills</p>
        </div>
        
        {/* Bill History Component */}
        <BillHistory isMobile={false} defaultOpen={true} />
      </div>
    </div>
  );
}
