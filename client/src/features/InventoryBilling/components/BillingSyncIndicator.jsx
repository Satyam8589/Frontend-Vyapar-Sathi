"use client";

import { useState, useEffect, useCallback } from "react";
import { useBillingContext } from "../context/billingContext";
import {
  getPendingSyncQueue,
  getSyncMetadata,
  getOfflineProducts,
  isOnline,
  onOnline,
  onOffline,
} from "../utils/db";

function formatTime(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function BillingSyncIndicator() {
  const { storeId } = useBillingContext();
  const [online, setOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [catalogReady, setCatalogReady] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [swActive, setSwActive] = useState(false);

  const refresh = useCallback(async () => {
    if (!storeId) return;
    try {
      // syncQueue is the single source of truth for pending operations.
      // offlineBills.synced is updated independently; counting both would
      // double-count the same bill while sync is in-flight.
      const [queue, meta, products] = await Promise.all([
        getPendingSyncQueue(storeId),
        getSyncMetadata(storeId, "products"),
        getOfflineProducts(storeId),
      ]);
      setPendingCount(queue.length);
      setCatalogReady(products.length > 0);
      setLastSynced(meta?.lastSyncedAt || null);
    } catch (err) {
      console.error("[BillingSyncIndicator] Failed to refresh status:", err);
    }
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return;

    setOnline(isOnline());
    refresh();

    const cleanupOnline = onOnline(() => {
      setOnline(true);
      refresh();
    });
    const cleanupOffline = onOffline(() => {
      setOnline(false);
      refresh();
    });

    // Check Service Worker status
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(() => setSwActive(true))
        .catch(() => setSwActive(false));
    }

    const interval = setInterval(refresh, 10000);

    // Refresh immediately when a sync cycle completes
    const handleSyncComplete = () => refresh();
    window.addEventListener("billing-sync-complete", handleSyncComplete);

    return () => {
      cleanupOnline();
      cleanupOffline();
      clearInterval(interval);
      window.removeEventListener("billing-sync-complete", handleSyncComplete);
    };
  }, [storeId, refresh]);

  const offlineReady = swActive && catalogReady;

  // Online, nothing pending
  if (online && pendingCount === 0) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-green-700 font-medium">Online</span>
        {lastSynced && (
          <span className="text-gray-400 text-xs">
            · Catalog synced {formatTime(lastSynced)}
          </span>
        )}
        {offlineReady && (
          <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
            Offline Ready
          </span>
        )}
      </div>
    );
  }

  // Offline but catalog is prepared
  if (!online && offlineReady) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
        </span>
        <span className="font-medium">Offline</span>
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          Offline Ready
        </span>
        {pendingCount > 0 && (
          <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
            {pendingCount} bill{pendingCount > 1 ? "s" : ""} pending sync
          </span>
        )}
      </div>
    );
  }

  // Offline, NOT prepared
  if (!online && !offlineReady) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="font-medium">Offline</span>
        <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Not Ready — connect internet first
        </span>
      </div>
    );
  }

  // Online, pending bills syncing
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      <span className="font-medium">Syncing…</span>
      {pendingCount > 0 && (
        <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100">
          {pendingCount} pending
        </span>
      )}
    </div>
  );
}