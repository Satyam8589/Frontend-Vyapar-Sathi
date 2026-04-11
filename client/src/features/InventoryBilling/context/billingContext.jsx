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
  syncBillingSession,
  syncBarcodeValue,
  isMobileMode,
  getSessionIdFromURL,
  generateMobileScanURL,
} from "../services/billingSyncService";

const BillingContext = createContext(null);

export const BillingProvider = ({ children }) => {
  const { user } = useAuthContext();
  const params = useParams();
  const storeId = params.storeId;

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

  // Reset all state on page refresh/mount
  useEffect(() => {
    // Clear all billing data on fresh page load
    setBilledProducts([]);
    setScannedBarcode("");
    setError(null);
    setLastBillData(null);

    console.log("🔄 Billing page reset - all data cleared");

    // Cleanup sync on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }, []);

  // Ref to store the latest callback handlers to avoid stale closures
  const handlersRef = useRef({
    addProductByBarcode: null,
    addProductManually: null,
    setScannedBarcode: null,
  });

  // Start real-time sync
  const startSync = useCallback(async () => {
    if (!storeId) return;

    const newSessionId = sessionId || generateSessionId();
    setSessionId(newSessionId);
    setSyncEnabled(true);
    setSyncStatus("connecting");

    console.log("🚀 Starting real-time sync with session:", newSessionId);
    console.log(
      "🔧 Sync mode:",
      isMobile ? "MOBILE (sending only)" : "DESKTOP (receiving)",
    );

    // Create initial session document in Firestore
    try {
      await syncBillingSession(storeId, newSessionId, []);
      console.log("✅ Session document created in Firestore");
    } catch (error) {
      console.error("❌ Failed to create session document:", error);
    }

    // Subscribe to changes
    const unsubscribe = subscribeToBillingSession(
      storeId,
      newSessionId,
      (scannedProduct) => {
        // Handle full product sync (legacy)
        const productKey = `${scannedProduct._id}_${scannedProduct.scannedAt}`;
        if (lastProcessedProductRef.current === productKey) {
          console.log("Skipping duplicate product:", productKey);
          return;
        }

        lastProcessedProductRef.current = productKey;
        setSyncStatus("syncing");

        // Add product to bill using latest handlers from ref
        if (scannedProduct.barcode) {
          handlersRef.current.addProductByBarcode?.(scannedProduct.barcode);
        } else {
          handlersRef.current.addProductManually?.(scannedProduct, 1);
        }

        // Reset status after a delay
        setTimeout(() => setSyncStatus("connected"), 1000);
      },
      (barcode) => {
        // Handle barcode-only sync (mobile sends barcode → laptop receives)
        console.log("💻 Laptop received barcode, auto-filling input:", barcode);
        setSyncStatus("syncing");

        // Auto-fill the barcode input field
        handlersRef.current.setScannedBarcode?.(barcode);

        // Auto-trigger product search
        setTimeout(() => {
          console.log("🔍 Auto-triggering product search for:", barcode);
          handlersRef.current.addProductByBarcode?.(barcode);
        }, 100);

        // Reset status after a delay
        setTimeout(() => setSyncStatus("connected"), 1000);
      },
    );

    unsubscribeRef.current = unsubscribe;
    setSyncStatus("connected");

    showSuccess("Real-time sync enabled! Scan on any device.");
    return newSessionId;
  }, [storeId, sessionId, generateSessionId, isMobile]);

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

  // Generate QR code/link for mobile scanning
  const getMobileScanURL = useCallback(() => {
    if (!sessionId || !storeId) return null;
    return generateMobileScanURL(storeId, sessionId);
  }, [storeId, sessionId]);

  // Final state declarations (consolidated)
  const [currentStore, setCurrentStore] = useState(null);
  const [userContext, setUserContext] = useState({ role: null, permissions: [] });
  const [billedProducts, setBilledProducts] = useState([]);
  const [discount, setDiscount] = useState({ type: "fixed", value: 0 }); // { type: 'percent' | 'fixed', value: number }

  // Check if current user has a specific permission
  const hasPermission = useCallback((permissionKey) => {
    if (!userContext?.role) return false;
    if (userContext.role === 'Owner') return true; 
    return userContext.permissions.includes(permissionKey);
  }, [userContext]);

  // Fetch store details
  const fetchStoreDetails = useCallback(async () => {
    if (!storeId) return;
    try {
      const response = await fetchStoreById(storeId);
      const { userContext: context, ...storeData } = response.data;
      setCurrentStore(storeData);
      setUserContext(context || { role: null, permissions: [] });
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
  const addProductByBarcode = useCallback(
    async (barcode) => {
      try {
        setLoading(true);
        setError(null);

        // If in mobile mode with sync enabled, just send barcode to laptop
        if (isMobile && syncEnabled && sessionId) {
          try {
            await syncBarcodeValue(storeId, sessionId, barcode);
            console.log("📱 Barcode sent to laptop:", barcode);
            showSuccess(`Barcode sent: ${barcode}`);
            setLoading(false);
            return true;
          } catch (syncError) {
            console.error("Failed to sync barcode:", syncError);
            showError("Failed to send barcode to laptop");
            setLoading(false);
            return false;
          }
        }

        // Normal mode (laptop) - fetch product and add to cart
        const product = await billingService.getProductByBarcode(
          barcode,
          storeId,
        );

        if (!product) {
          showError("Product not found with this barcode");
          setLoading(false);
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
          setLoading(false);
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
            setLoading(false);
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
    },
    [storeId, billedProducts, isMobile, syncEnabled, sessionId],
  );

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
    [billedProducts, storeId],
  );

  // Update handlers ref to avoid stale closures in real-time sync
  useEffect(() => {
    handlersRef.current = {
      addProductByBarcode,
      addProductManually,
      setScannedBarcode,
    };
  }, [addProductByBarcode, addProductManually, setScannedBarcode]);

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
    const subtotal = billedProducts.reduce((total, product) => {
      const price = product.price || product.sellingPrice || 0;
      const quantity = product.billedQuantity || 1;
      return total + price * quantity;
    }, 0);

    let discountAmount = 0;
    if (discount.type === "percent") {
      discountAmount = (subtotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    return Math.max(0, subtotal - discountAmount);
  }, [billedProducts, discount]);

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
          subtotal: billedProducts.reduce((sum, p) => sum + (p.price || p.sellingPrice || 0) * p.billedQuantity, 0),
          discount: {
            type: discount.type,
            value: discount.value,
            amount:
              discount.type === "percent"
                ? (billedProducts.reduce((sum, p) => sum + (p.price || p.sellingPrice || 0) * p.billedQuantity, 0) * discount.value) / 100
                : discount.value,
          },
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
        setDiscount({ type: "fixed", value: 0 });
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
    setDiscount({ type: "fixed", value: 0 });
    showSuccess("Bill cleared");
  }, []);

  const value = useMemo(
    () => ({
      currentStore,
      userContext,
      hasPermission,
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
      discount,
      setDiscount,
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
      discount,
      processBill,
      clearBill,
      fetchStoreProducts,
      startSync,
      stopSync,
      getMobileScanURL,
      userContext,
      hasPermission
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
