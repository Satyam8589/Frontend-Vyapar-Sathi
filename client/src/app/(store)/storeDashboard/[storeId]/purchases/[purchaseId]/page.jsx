"use client";

import PurchaseDetailsPage from "@/features/purchase/components/PurchaseDetailsPage";
import { useParams } from "next/navigation";

export default function PurchaseDetailsRoute() {
  const params = useParams();
  
  return (
    <PurchaseDetailsPage 
      storeId={params.storeId} 
      purchaseId={params.purchaseId} 
    />
  );
}
