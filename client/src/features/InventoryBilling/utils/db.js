import Dexie from 'dexie';

export const db = new Dexie('VyaparSathiBilling');

db.version(1).stores({
  offlineBills: '++id, storeId, sessionId, createdAt, synced, retryCount',
  syncQueue: '++id, storeId, type, status, createdAt, retryCount',
  sessions: 'id, storeId, updatedAt',
});

db.version(2).stores({
  products: 'id, [storeId+barcode], storeId',
  syncMetadata: '++id, storeId, entity',
});

export function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

export function onOnline(callback) {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', callback);
    return () => window.removeEventListener('online', callback);
  }
  return () => {};
}

export function onOffline(callback) {
  if (typeof window !== 'undefined') {
    window.addEventListener('offline', callback);
    return () => window.removeEventListener('offline', callback);
  }
  return () => {};
}

export async function saveOfflineBill(billData) {
  return await db.offlineBills.add({
    ...billData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    synced: false,
    retryCount: 0,
  });
}

export async function updateOfflineBill(id, updates) {
  return await db.offlineBills.update(id, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function getOfflineBills(storeId) {
  return await db.offlineBills.where('storeId').equals(storeId).toArray();
}

export async function getUnsyncedBills(storeId) {
  return await db.offlineBills
    .where('storeId')
    .equals(storeId)
    .and((bill) => !bill.synced)
    .toArray();
}

export async function markBillSynced(id, serverBillId) {
  return await db.offlineBills.update(id, {
    synced: true,
    serverBillId,
    syncedAt: new Date().toISOString(),
  });
}

export async function deleteOfflineBill(id) {
  return await db.offlineBills.delete(id);
}

export async function clearSyncedBills(storeId) {
  const syncedBills = await db.offlineBills
    .where('storeId')
    .equals(storeId)
    .and((bill) => bill.synced)
    .toArray();
  const ids = syncedBills.map((bill) => bill.id);
  return await db.offlineBills.bulkDelete(ids);
}

export async function addToSyncQueue(operation) {
  return await db.syncQueue.add({
    ...operation,
    createdAt: new Date().toISOString(),
    status: 'pending',
    retryCount: 0,
  });
}

export async function getPendingSyncQueue(storeId) {
  return await db.syncQueue
    .where('storeId')
    .equals(storeId)
    .and((item) => item.status === 'pending' || item.status === 'retry')
    .sortBy('createdAt');
}

export async function updateSyncQueueItem(id, updates) {
  return await db.syncQueue.update(id, updates);
}

export async function removeSyncQueueItem(id) {
  return await db.syncQueue.delete(id);
}

export async function saveCurrentSession(sessionData) {
  const sessionKey = `session_${sessionData.storeId}`;
  return await db.sessions.put({
    id: sessionKey,
    ...sessionData,
    isSession: true,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCurrentSession(storeId) {
  const sessionKey = `session_${storeId}`;
  const result = await db.sessions.get(sessionKey);
  if (result && result.isSession) {
    return result;
  }
  return null;
}

export async function clearCurrentSession(storeId) {
  const sessionKey = `session_${storeId}`;
  return await db.sessions.delete(sessionKey);
}

// --- Offline Products & Sync Metadata ---

export async function saveOfflineProducts(storeId, products) {
  const offlineProducts = products.map((p) => ({
    ...p,
    storeId,
    id: p._id || p.id,
  }));
  return await db.products.bulkPut(offlineProducts);
}

export async function getOfflineProductByBarcode(storeId, barcode) {
  return await db.products
    .where('[storeId+barcode]')
    .equals([storeId, barcode])
    .first();
}

export async function getOfflineProducts(storeId) {
  return await db.products.where('storeId').equals(storeId).toArray();
}

export async function saveSyncMetadata(storeId, entity) {
  const existing = await db.syncMetadata
    .where({ storeId, entity })
    .first();

  if (existing) {
    return await db.syncMetadata.update(existing.id, {
      lastSyncedAt: new Date().toISOString(),
    });
  } else {
    return await db.syncMetadata.add({
      storeId,
      entity,
      lastSyncedAt: new Date().toISOString(),
    });
  }
}

export async function getSyncMetadata(storeId, entity) {
  return await db.syncMetadata
    .where({ storeId, entity })
    .first();
}