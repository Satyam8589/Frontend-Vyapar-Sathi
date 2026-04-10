"use client";

import { InventoryProvider } from "@/features/inventory/context/inventoryContext";

/**
 * Settings Layout - Wraps with InventoryProvider for store context
 */
export default function SettingsLayout({ children }) {
  return <InventoryProvider>{children}</InventoryProvider>;
}
