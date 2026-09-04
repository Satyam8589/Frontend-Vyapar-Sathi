"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  saveCurrentSession,
  getCurrentSession,
  clearCurrentSession,
  saveOfflineBill,
  getUnsyncedBills,
  markBillSynced,
  addToSyncQueue,
  getPendingSyncQueue,
  updateSyncQueueItem,
  isOnline,
  onOnline,
  onOffline,
  db,
} from "@/features/InventoryBilling/utils/db";
import * as billingService from "@/features/InventoryBilling/services/billingService";

export function useOfflineBilling({
  storeId,
  sessionId,
  syncEnabled,
  isMobile,
  billedProducts,
  discount,
  currentStore,
  setBilledProducts,
  setDiscount,
  setScannedBarcode,
  processBill,
}) {
  const isRestoringRef = useRef(false);
  const syncInProgressRef = useRef(false);
  const processBillRef = useRef(processBill);

  // Keep processBill ref updated
  useEffect(() => {
    processBillRef.current = processBill;
  }, [processBill]);

  // Save current session to IndexedDB whenever bill changes
  useEffect(() => {
    if (isRestoringRef.current || !storeId) return;

    const sessionData = {
      storeId,
      sessionId,
      syncEnabled,
      isMobile,
      billedProducts,
      discount,
      currentStore: currentStore ? { name: currentStore.name, gstin: currentStore.gstin } : null,
    };

    saveCurrentSession(sessionData).catch(console.error);
  }, [storeId, sessionId, syncEnabled, isMobile, billedProducts, discount, currentStore]);

  // Restore session on mount
  useEffect(() => {
    if (!storeId) return;

    const restoreSession = async () => {
      try {
        isRestoringRef.current = true;
        const session = await getCurrentSession(storeId);

        if (session && session.billedProducts && session.billedProducts.length > 0) {
          console.log("📦 Restoring offline bill session:", session.billedProducts.length, "items");
          setBilledProducts(session.billedProducts);
          setDiscount(session.discount || { type: "fixed", value: 0 });
          if (session.scannedBarcode) {
            setScannedBarcode(session.scannedBarcode);
          }
        }
      } catch (error) {
        console.error("Failed to restore offline session:", error);
      } finally {
        isRestoringRef.current = false;
      }
    };

    restoreSession();
  }, [storeId, setBilledProducts, setDiscount, setScannedBarcode]);

  // Clear session after successful bill generation
  const clearSession = useCallback(async () => {
    if (!storeId) return;
    await clearCurrentSession(storeId);
  }, [storeId]);

  // Save bill to offline storage when processBill is called
  const saveBillOffline = useCallback(
    async (billData) => {
      if (!storeId) return null;

      try {
        const offlineBillId = await saveOfflineBill({
          storeId,
          sessionId,
          billData,
          isMobile,
        });
        console.log("💾 Bill saved offline:", offlineBillId);

        // Immediately add to sync queue
        await addToSyncQueue({
          storeId,
          type: "bill",
          billId: offlineBillId,
          billData,
        });

        return offlineBillId;
      } catch (error) {
        console.error("Failed to save bill offline:", error);
        return null;
      }
    },
    [storeId, sessionId, isMobile]
  );

  // Sync unsynced bills when online
  const syncPendingBills = useCallback(async () => {
    if (!storeId || syncInProgressRef.current || !isOnline()) return;

    syncInProgressRef.current = true;

    try {
      const unsyncedBills = await getUnsyncedBills(storeId);

      for (const bill of unsyncedBills) {
        try {
          // Try to process the bill on the server using the API service directly
          const serverBill = await billingService.generateBill(bill.billData);

          if (serverBill) {
            await markBillSynced(bill.id, serverBill._id || serverBill.id);
            console.log("✅ Offline bill synced:", bill.id);
          }
        } catch (syncError) {
          console.error("Failed to sync bill:", bill.id, syncError);
        }
      }
    } catch (error) {
      console.error("Sync pending bills error:", error);
    } finally {
      syncInProgressRef.current = false;
    }
  }, [storeId]);

  // Process sync queue - sole sync authority
  const processSyncQueue = useCallback(async () => {
    if (!storeId || syncInProgressRef.current || !isOnline()) return;

    syncInProgressRef.current = true;

    try {
      const queue = await getPendingSyncQueue(storeId);

      for (const item of queue) {
        try {
          await updateSyncQueueItem(item.id, { status: "processing" });

          if (item.type === "bill") {
            // Check if this bill was already synced (e.g. by a prior syncPendingBills run)
            // to avoid creating duplicate invoices on the server.
            const existingBill = await db.offlineBills.get(item.billId);
            if (existingBill && existingBill.synced) {
              console.log("✅ Bill already synced, completing queue item:", item.id);
              await updateSyncQueueItem(item.id, {
                status: "completed",
                completedAt: new Date().toISOString(),
              });
              continue;
            }

            const serverBill = await billingService.generateBill(item.billData);

            if (serverBill) {
              await markBillSynced(item.billId, serverBill._id || serverBill.id);
              await updateSyncQueueItem(item.id, {
                status: "completed",
                completedAt: new Date().toISOString(),
              });
              console.log("✅ Bill synced to server:", item.id);
            }
          }
        } catch (error) {
          await updateSyncQueueItem(item.id, {
            status: "retry",
            retryCount: item.retryCount + 1,
            lastError: error.message,
            lastRetryAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error("Process sync queue error:", error);
    } finally {
      syncInProgressRef.current = false;
      // Notify the indicator to refresh counts immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("billing-sync-complete"));
      }
    }
  }, [storeId]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Online - processing sync queue...");
      // Only processSyncQueue runs — it handles all pending bills safely
      // (including skipping ones already synced by a prior run)
      processSyncQueue();
    };

    const handleOffline = () => {
      console.log("📴 Offline mode enabled");
    };

    const cleanupOnline = onOnline(handleOnline);
    const cleanupOffline = onOffline(handleOffline);

    return () => {
      cleanupOnline();
      cleanupOffline();
    };
  }, [processSyncQueue]);

  // Initial sync check on mount
  useEffect(() => {
    if (isOnline()) {
      processSyncQueue();
    }
  }, []); // Run once on mount

  return {
    saveBillOffline,
    syncPendingBills,
    processSyncQueue,
    clearSession,
  };
}