"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useParams } from "next/navigation";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import * as billingService from "../services/billingService";
import { fetchStoreById } from "@/features/storeDashboard/services/storeDashboardService";
import { showSuccess, showError } from "@/utils/toast";
import {
  subscribeToBillingSession,
  addScannedProduct,
  isMobileMode,
  getSessionIdFromURL,
  generateMobileScanURL,
} from "../services/billingSyncService";

const BillingContext = createContext(null);

export const BillingProvider = ({ children }) => {
  const { user } = useAuthContext();
  const params = useParams();
  const storeId = params.storeId;

  const [currentStore, setCurrentStore] = useState(null);
  const [billedProducts, setBilledProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [storeProducts, setStoreProducts] = useState([]);
  const [lastBillData, setLastBillData] = useState(null);

  // Real-time sync states
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [syncStatus, setSyncStatus] = useState("disconnected"); // disconnected, connected, syncing
  const unsubscribeRef = useRef(null);
  const lastProcessedProductRef = useRef(null);

  // Check if in mobile mode on mount
  useEffect(() => {
    const mobileMode = isMobileMode();
    const urlSessionId = getSessionIdFromURL();

    setIsMobile(mobileMode);
    if (urlSessionId) {
      setSessionId(urlSessionId);
      setSyncEnabled(true);
    }
  }, []);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }, []);

  // Start real-time sync
  const startSync = useCallback(() => {
    if (!storeId) return;

    const newSessionId = sessionId || generateSessionId();
    setSessionId(newSessionId);
    setSyncEnabled(true);
    setSyncStatus("connecting");

    // Subscribe to changes
    const unsubscribe = subscribeToBillingSession(
      storeId,
      newSessionId,
      (scannedProduct) => {
        // Prevent duplicate processing
        const productKey = `${scannedProduct._id}_${scannedProduct.scannedAt}`;
        if (lastProcessedProductRef.current === productKey) {
          console.log("Skipping duplicate product:", productKey);
          return;
        }

        lastProcessedProductRef.current = productKey;
        setSyncStatus("syncing");

        // Add product to bill
        if (scannedProduct.barcode) {
          addProductByBarcode(scannedProduct.barcode);
        } else {
          addProductManually(scannedProduct, 1);
        }

        // Reset status after a delay
        setTimeout(() => setSyncStatus("connected"), 1000);
      },
    );

    unsubscribeRef.current = unsubscribe;
    setSyncStatus("connected");

    showSuccess("Real-time sync enabled! Scan on any device.");
    return newSessionId;
  }, [storeId, sessionId, generateSessionId]);

  // Stop real-time sync
  const stopSync = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setSyncEnabled(false);
    setSyncStatus("disconnected");
    showSuccess("Real-time sync disabled");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Generate QR code/link for mobile scanning
  const getMobileScanURL = useCallback(() => {
    if (!sessionId || !storeId) return null;
    return generateMobileScanURL(storeId, sessionId);
  }, [storeId, sessionId]);

  // Fetch store details
  const fetchStoreDetails = useCallback(async () => {
    if (!storeId) return;
    try {
      const response = await fetchStoreById(storeId);
      setCurrentStore(response.data);
    } catch (err) {
      console.error("STORE_FETCH_ERROR:", err);
      showError("Failed to fetch store details");
    }
  }, [storeId]);

  // Fetch all store products for manual selection
  const fetchStoreProducts = useCallback(async () => {
    if (!storeId) return;
    try {
      const data = await billingService.getStoreProducts(storeId);
      setStoreProducts(data || []);
    } catch (err) {
      console.error("PRODUCTS_FETCH_ERROR:", err);
    }
  }, [storeId]);

  // Initial fetch
  useEffect(() => {
    fetchStoreDetails();
    fetchStoreProducts();
  }, [fetchStoreDetails, fetchStoreProducts]);

  // Add product by barcode
  const addProductByBarcode = async (barcode) => {
    try {
      setLoading(true);
      setError(null);

      const product = await billingService.getProductByBarcode(
        barcode,
        storeId,
      );

      if (!product) {
        showError("Product not found with this barcode");
        return false;
      }

      // SECURITY: Verify product belongs to current store
      if (
        product.store &&
        product.store !== storeId &&
        product.store._id !== storeId
      ) {
        showError("This product does not belong to this store");
        console.error("STORE_MISMATCH:", {
          productStore: product.store,
          currentStore: storeId,
        });
        return false;
      }

      // Check if product already exists in bill
      const existingIndex = billedProducts.findIndex(
        (p) => p._id === product._id,
      );

      if (existingIndex >= 0) {
        // Increment quantity
        const updatedProducts = [...billedProducts];
        const currentQty = updatedProducts[existingIndex].billedQuantity || 1;
        const availableQty = product.quantity || product.qty || 0;

        if (currentQty >= availableQty) {
          showError("Cannot add more. Stock limit reached.");
          return false;
        }

        updatedProducts[existingIndex] = {
          ...updatedProducts[existingIndex],
          billedQuantity: currentQty + 1,
        };
        setBilledProducts(updatedProducts);
      } else {
        // Add new product
        setBilledProducts((prev) => [
          ...prev,
          {
            ...product,
            billedQuantity: 1,
          },
        ]);
      }

      showSuccess("Product added to bill");

      // Sync to Firestore if in mobile mode and sync is enabled
      if (isMobile && syncEnabled && sessionId) {
        try {
          await addScannedProduct(storeId, sessionId, product);
          console.log("✅ Product synced to Firestore");
        } catch (syncError) {
          console.error("Failed to sync product:", syncError);
          // Don't show error to user, product is still added locally
        }
      }

      return true;
    } catch (err) {
      const msg = err?.message || err?.error || "Failed to fetch product";
      setError(msg);
      showError(msg);
      console.error("BARCODE_SCAN_ERROR:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add product manually
  const addProductManually = useCallback(
    (product, quantity = 1) => {
      // SECURITY: Verify product belongs to current store
      if (
        product.store &&
        product.store !== storeId &&
        product.store._id !== storeId
      ) {
        showError("This product does not belong to this store");
        console.error("STORE_MISMATCH:", {
          productStore: product.store,
          currentStore: storeId,
        });
        return false;
      }

      const existingIndex = billedProducts.findIndex(
        (p) => p._id === product._id,
      );

      if (existingIndex >= 0) {
        const updatedProducts = [...billedProducts];
        const currentQty = updatedProducts[existingIndex].billedQuantity || 1;
        const availableQty = product.quantity || product.qty || 0;

        if (currentQty + quantity > availableQty) {
          showError("Cannot add more. Stock limit reached.");
          return false;
        }

        updatedProducts[existingIndex] = {
          ...updatedProducts[existingIndex],
          billedQuantity: currentQty + quantity,
        };
        setBilledProducts(updatedProducts);
      } else {
        setBilledProducts((prev) => [
          ...prev,
          {
            ...product,
            billedQuantity: quantity,
          },
        ]);
      }

      showSuccess("Product added to bill");
      return true;
    },
    [billedProducts],
  );

  // Remove product from bill
  const removeProduct = useCallback((productId) => {
    setBilledProducts((prev) => prev.filter((p) => p._id !== productId));
    showSuccess("Product removed from bill");
  }, []);

  // Update quantity of a product
  const updateProductQuantity = useCallback(
    (productId, newQuantity) => {
      if (newQuantity <= 0) {
        removeProduct(productId);
        return;
      }

      setBilledProducts((prev) =>
        prev.map((p) => {
          if (p._id === productId) {
            const availableQty = p.quantity || p.qty || 0;
            if (newQuantity > availableQty) {
              showError("Quantity exceeds available stock");
              return p;
            }
            return { ...p, billedQuantity: newQuantity };
          }
          return p;
        }),
      );
    },
    [removeProduct],
  );

  // Calculate total
  const calculateTotal = useCallback(() => {
    return billedProducts.reduce((total, product) => {
      const price = product.price || product.sellingPrice || 0;
      const quantity = product.billedQuantity || 1;
      return total + price * quantity;
    }, 0);
  }, [billedProducts]);

  // Generate bill and update inventory
  const processBill = useCallback(
    async (paymentMethod = "cash") => {
      if (billedProducts.length === 0) {
        showError("No products in the bill");
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        const billData = {
          storeId,
          products: billedProducts.map((p) => ({
            productId: p._id,
            name: p.name,
            barcode: p.barcode,
            quantity: p.billedQuantity,
            price: p.price || p.sellingPrice || 0,
            total: (p.price || p.sellingPrice || 0) * p.billedQuantity,
          })),
          totalAmount: calculateTotal(),
          paymentMethod,
          billedBy: user?.uid,
          billedAt: new Date().toISOString(),
        };

        // Generate bill (automatically updates inventory via cart confirmPayment)
        const bill = await billingService.generateBill(billData);

        console.log("Bill generated successfully:", bill);

        // Save bill data for PDF download
        setLastBillData(billData);

        // Clear the bill
        setBilledProducts([]);
        showSuccess("Bill generated and inventory updated successfully!");

        return bill;
      } catch (err) {
        const msg = err?.message || err?.error || "Failed to process bill";
        setError(msg);
        showError(msg);
        console.error("BILL_PROCESS_ERROR:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [billedProducts, storeId, user?.uid, calculateTotal],
  );

  // Clear current bill
  const clearBill = useCallback(() => {
    setBilledProducts([]);
    setScannedBarcode("");
    showSuccess("Bill cleared");
  }, []);

  const value = useMemo(
    () => ({
      currentStore,
      billedProducts,
      loading,
      error,
      scannedBarcode,
      storeProducts,
      lastBillData,
      // Real-time sync
      syncEnabled,
      syncStatus,
      sessionId,
      isMobile,
      setScannedBarcode,
      addProductByBarcode,
      addProductManually,
      removeProduct,
      updateProductQuantity,
      calculateTotal,
      processBill,
      clearBill,
      fetchStoreProducts,
      // Sync functions
      startSync,
      stopSync,
      getMobileScanURL,
    }),
    [
      currentStore,
      billedProducts,
      loading,
      error,
      scannedBarcode,
      storeProducts,
      lastBillData,
      syncEnabled,
      syncStatus,
      sessionId,
      isMobile,
      addProductByBarcode,
      addProductManually,
      removeProduct,
      updateProductQuantity,
      calculateTotal,
      processBill,
      clearBill,
      fetchStoreProducts,
      startSync,
      stopSync,
      getMobileScanURL,
    ],
  );

  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
};

export const useBillingContext = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBillingContext must be used within BillingProvider");
  }
  return context;
};
