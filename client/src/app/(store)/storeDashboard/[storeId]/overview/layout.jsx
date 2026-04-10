"use client";

import { InventoryProvider } from "@/features/inventory/context/inventoryContext";

/**
 * Overview Layout - Wraps with InventoryProvider for store context
 */
export default function OverviewLayout({ children }) {
  return <InventoryProvider>{children}</InventoryProvider>;
}
