import {
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

/**
 * Real-time billing sync service using Firestore
 * Allows scanning on phone to appear on laptop instantly
 */

/**
 * Create or update a billing session for real-time sync
 * @param {string} storeId - Store ID
 * @param {string} cartId - Cart/Session ID
 * @param {Array} products - Array of scanned products
 */
export const syncBillingSession = async (storeId, cartId, products = []) => {
  if (!db) {
    console.warn("Firestore not initialized");
    return;
  }

  try {
    const sessionRef = doc(db, "billingSessions", `${storeId}_${cartId}`);
    await setDoc(
      sessionRef,
      {
        storeId,
        cartId,
        products,
        lastUpdated: serverTimestamp(),
        updatedBy: "user", // Can be enhanced with actual user ID
      },
      { merge: true },
    );
    console.log("✅ Billing session synced to Firestore");
  } catch (error) {
    console.error("❌ Failed to sync billing session:", error);
    throw error;
  }
};

/**
 * Sync only barcode value (for phone to send barcode to laptop)
 * @param {string} storeId - Store ID
 * @param {string} cartId - Cart/Session ID
 * @param {string} barcode - Scanned barcode value
 */
export const syncBarcodeValue = async (storeId, cartId, barcode) => {
  if (!db) {
    console.warn("Firestore not initialized");
    return;
  }

  try {
    const sessionRef = doc(db, "billingSessions", `${storeId}_${cartId}`);
    const timestamp = new Date().toISOString();

    console.log("📱 Syncing barcode to Firestore:", {
      sessionId: `${storeId}_${cartId}`,
      barcode,
      timestamp,
    });

    await setDoc(
      sessionRef,
      {
        storeId,
        cartId,
        lastScannedBarcode: barcode,
        barcodeScannedAt: timestamp,
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    );

    console.log("✅ Barcode synced to Firestore successfully!");
  } catch (error) {
    console.error("❌ Failed to sync barcode:", error);
    throw error;
  }
};

/**
 * Add a scanned product to the sync session
 * @param {string} storeId - Store ID
 * @param {string} cartId - Cart/Session ID
 * @param {Object} product - Product to add
 */
export const addScannedProduct = async (storeId, cartId, product) => {
  if (!db) {
    console.warn("Firestore not initialized");
    return;
  }

  try {
    const sessionRef = doc(db, "billingSessions", `${storeId}_${cartId}`);

    // We'll use updateDoc to add the product to the array
    // But since we need to read current products first, we'll use setDoc with merge
    await setDoc(
      sessionRef,
      {
        storeId,
        cartId,
        lastScannedProduct: {
          ...product,
          scannedAt: new Date().toISOString(),
        },
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    );

    console.log("✅ Product added to sync session:", product.name);
  } catch (error) {
    console.error("❌ Failed to add scanned product:", error);
    throw error;
  }
};

/**
 * Listen to billing session changes in real-time
 * @param {string} storeId - Store ID
 * @param {string} cartId - Cart/Session ID
 * @param {Function} onProductScanned - Callback when new product is scanned
 * @param {Function} onBarcodeScanned - Callback when barcode value is received
 * @returns {Function} Unsubscribe function
 */
export const subscribeToBillingSession = (
  storeId,
  cartId,
  onProductScanned,
  onBarcodeScanned,
) => {
  if (!db) {
    console.warn("Firestore not initialized");
    return () => {};
  }

  try {
    const sessionRef = doc(db, "billingSessions", `${storeId}_${cartId}`);
    let lastProcessedBarcode = null;

    const unsubscribe = onSnapshot(
      sessionRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log("📡 Firestore data received:", data);

          // Handle barcode-only sync (phone sends barcode to laptop)
          const scannedBarcode = data.lastScannedBarcode;
          const barcodeTimestamp = data.barcodeScannedAt;

          if (scannedBarcode) {
            if (barcodeTimestamp !== lastProcessedBarcode) {
              lastProcessedBarcode = barcodeTimestamp;
              console.log("📱 Barcode received from sync:", scannedBarcode);
              if (onBarcodeScanned) {
                onBarcodeScanned(scannedBarcode);
              } else {
                console.warn("⚠️ No onBarcodeScanned callback provided");
              }
            } else {
              console.log("⏭️ Skipping duplicate barcode (same timestamp)");
            }
          }

          // Handle product sync (legacy - for full product sync)
          const lastProduct = data.lastScannedProduct;
          if (lastProduct && onProductScanned) {
            console.log("🔔 New product detected from sync:", lastProduct);
            onProductScanned(lastProduct);
          }
        } else {
          console.log("📭 No Firestore document exists yet");
        }
      },
      (error) => {
        console.error("❌ Error listening to billing session:", error);
      },
    );

    console.log("👂 Listening to billing session:", `${storeId}_${cartId}`);
    return unsubscribe;
  } catch (error) {
    console.error("❌ Failed to subscribe to billing session:", error);
    return () => {};
  }
};

/**
 * Clear the billing session from Firestore
 * @param {string} storeId - Store ID
 * @param {string} cartId - Cart/Session ID
 */
export const clearBillingSession = async (storeId, cartId) => {
  if (!db) {
    console.warn("Firestore not initialized");
    return;
  }

  try {
    const sessionRef = doc(db, "billingSessions", `${storeId}_${cartId}`);
    await deleteDoc(sessionRef);
    console.log("🗑️ Billing session cleared from Firestore");
  } catch (error) {
    console.error("❌ Failed to clear billing session:", error);
  }
};

/**
 * Generate a QR code URL for mobile scanning
 * @param {string} storeId - Store ID
 * @param {string} cartId - Cart/Session ID
 * @returns {string} URL to open on mobile
 */
export const generateMobileScanURL = (storeId, cartId) => {
  const baseURL = globalThis.window?.location.origin || "";
  return `${baseURL}/storeDashboard/${storeId}/billing?session=${cartId}&mode=mobile`;
};

/**
 * Check if current device is in mobile mode
 * @returns {boolean}
 */
export const isMobileMode = () => {
  if (typeof globalThis.window === "undefined") return false;
  const urlParams = new URLSearchParams(globalThis.window.location.search);
  return urlParams.get("mode") === "mobile";
};

/**
 * Get session ID from URL
 * @returns {string|null}
 */
export const getSessionIdFromURL = () => {
  if (typeof globalThis.window === "undefined") return null;
  const urlParams = new URLSearchParams(globalThis.window.location.search);
  return urlParams.get("session");
};
