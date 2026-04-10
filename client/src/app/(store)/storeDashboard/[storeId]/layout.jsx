"use client";

import { useEffect, useState } from "react";
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
  const [isResponsive, setIsResponsive] = useState(false);

  useEffect(() => {
    // When entering store dashboard, set store page context
    enterStorePage();

    return () => {
      // When leaving store dashboard, clear store page context
      exitStorePage();
    };
  }, [enterStorePage, exitStorePage]);

  // Detect if screen is mobile/responsive
  useEffect(() => {
    const checkIfResponsive = () => {
      setIsResponsive(window.innerWidth < 768); // md breakpoint
    };

    checkIfResponsive();
    window.addEventListener("resize", checkIfResponsive);
    return () => window.removeEventListener("resize", checkIfResponsive);
  }, []);

  if (isBillingPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar Navigation */}
      <VyaparSathiSidebar isResponsive={isResponsive} />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "15px 20px 20px 0px" }}>{children}</main>
    </div>
  );
}
