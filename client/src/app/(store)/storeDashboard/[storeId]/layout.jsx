"use client";

import { usePathname } from "next/navigation";
import VyaparSathiSidebar from "@/features/inventory/components/InventorySidebar";

/**
 * Store Dashboard Layout - Conditional sidebar
 * Sidebar visible on: inventory, staff, ai-dashboard
 * Sidebar hidden on: billing
 */
export default function StoreLayout({ children }) {
  const pathname = usePathname();
  const isBillingPage = pathname.includes("/billing");

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
