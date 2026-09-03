"use client";

import { useState, useEffect } from "react";
import { useBillingContext } from "../context/billingContext";
import {
  getUnsyncedBills,
  getPendingSyncQueue,
  isOnline,
  onOnline,
  onOffline,
} from "../utils/db";

export function BillingSyncIndicator() {
  const { storeId } = useBillingContext();
  const [isOnlineStatus, setIsOnlineStatus] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    if (!storeId) return;

    const checkPending = async () => {
      try {
        const [bills, queue] = await Promise.all([
          getUnsyncedBills(storeId),
          getPendingSyncQueue(storeId),
        ]);
        setPendingCount(bills.length);
        setQueueCount(queue.length);
      } catch (error) {
        console.error("Failed to check pending bills:", error);
      }
    };

    const handleOnline = () => {
      setIsOnlineStatus(true);
      checkPending();
    };

    const handleOffline = () => {
      setIsOnlineStatus(false);
    };

    setIsOnlineStatus(isOnline());
    checkPending();

    const cleanupOnline = onOnline(handleOnline);
    const cleanupOffline = onOffline(handleOffline);

    return () => {
      cleanupOnline();
      cleanupOffline();
    };
  }, [storeId]);

  if (isOnlineStatus && pendingCount === 0 && queueCount === 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <span>{isOnlineStatus ? "Syncing..." : "Offline"}</span>
      {(pendingCount > 0 || queueCount > 0) && (
        <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100">
          {pendingCount + queueCount} pending
        </span>
      )}
    </div>
  );
}