"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import VyaparSathiSidebar from "@/features/inventory/components/InventorySidebar";
import {
  useStorePageContext,
} from "@/features/store/context/storePageContext";

/**
 * Store Dashboard Layout - Conditional sidebar
 * Sidebar visible on: inventory, staff, ai-dashboard
 * Sidebar hidden on: billing
 */
export default function StoreLayout({ children }) {
  const pathname = usePathname();
  const isBillingPage = pathname.includes("/billing");
  const { enterStorePage, exitStorePage } = useStorePageContext();

  useEffect(() => {
    // When entering store dashboard, set store page context
    enterStorePage();

    return () => {
      // When leaving store dashboard, clear store page context
      exitStorePage();
    };
  }, [enterStorePage, exitStorePage]);

  if (isBillingPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <VyaparSathiSidebar />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "15px 20px 20px 0px" }}>{children}</main>
    </div>
  );
}
