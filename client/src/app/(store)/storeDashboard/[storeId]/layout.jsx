"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import VyaparSathiSidebar from "@/features/inventory/components/InventorySidebar";
import StoreBreadcrumb from "@/features/store/components/StoreBreadcrumb";
import StoreSidebarDrawer from "@/features/store/components/StoreSidebarDrawer";
import { useStorePageContext } from "@/features/store/context/storePageContext";
import { InventoryProvider } from "@/features/inventory/context/inventoryContext";
import { useAgentNavigation } from "@/hooks/useAgentNavigation";

/**
 * Store Dashboard Layout - Conditional sidebar
 * Desktop: Fixed sidebar + content
 * Mobile: Content full-width + drawer controlled by hamburger
 */
export default function StoreLayout({ children }) {
  const pathname = usePathname();
  const isBillingPage = pathname.endsWith("/billing");
  const { enterStorePage, exitStorePage, copilotOpen, copilotWidth, isDraggingCopilot } = useStorePageContext();
  const [isResponsive, setIsResponsive] = useState(false);
  const { storeId } = useParams();

  // Allow the AI agent to navigate to different store pages
  useAgentNavigation(storeId);

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
      <div className="relative flex min-h-screen w-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isResponsive && <VyaparSathiSidebar />}

        {/* Main Content Area - Slides and resizes dynamically when AI Copilot opens and resizes */}
        <main
          className={`flex-1 w-full min-w-0 ${
            isDraggingCopilot ? "transition-none" : "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          }`}
          style={{
            padding: isResponsive
              ? "12px 8px 16px 8px"
              : copilotOpen
              ? "12px 2px 16px 0px"
              : "12px 12px 16px 0px",
            marginRight: !isResponsive && copilotOpen ? `${copilotWidth || 480}px` : "0px",
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
