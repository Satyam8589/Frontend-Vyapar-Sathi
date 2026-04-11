"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import VyaparSathiSidebar from "@/features/inventory/components/InventorySidebar";
import StoreBreadcrumb from "@/features/store/components/StoreBreadcrumb";
import StoreSidebarDrawer from "@/features/store/components/StoreSidebarDrawer";
import { useStorePageContext } from "@/features/store/context/storePageContext";
import { InventoryProvider } from "@/features/inventory/context/inventoryContext";

/**
 * Store Dashboard Layout - Conditional sidebar
 * Desktop: Fixed sidebar + content
 * Mobile: Content full-width + drawer controlled by hamburger
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
    <InventoryProvider>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isResponsive && <VyaparSathiSidebar />}

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            width: "100%",
            minWidth: 0,
            padding: isResponsive ? "15px 16px 20px 16px" : "15px 20px 20px 0px",
          }}
        >
          <StoreBreadcrumb isResponsive={isResponsive} />

          {children}
        </main>
      </div>

      {/* Mobile Sidebar Drawer - Only on mobile */}
      {isResponsive && <StoreSidebarDrawer />}
    </InventoryProvider>
  );
}
