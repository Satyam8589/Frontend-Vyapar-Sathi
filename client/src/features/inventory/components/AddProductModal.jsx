"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import dynamic from "next/dynamic";
import PageLoader from "@/components/PageLoader";
import { useInventoryContext } from "@/features/inventory/context/inventoryContext";
import {
  uploadProductImage,
  resolveProductByBarcode,
  fetchFromMasterProduct,
  getStoreProductByBarcode,
  saveToMasterProduct,
} from "../services/inventoryService";

// Dynamically import BarcodeScanner — html5-qrcode accesses browser APIs,
// so it must never run during SSR (Next.js server render).
const BarcodeScanner = dynamic(() => import("./BarcodeScanner"), {
  ssr: false,
});

const AddProductModal = ({ isOpen, onClose, onAction, loading }) => {
  const { storeId, updateProduct } = useInventoryContext();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef(null);

  const createInitialFormData = () => ({
    name: "",
    brand: "",
    category: "General",
    qty: "",
    unit: "Pieces",
    price: "",
    expDate: "",
    barcode: "",
    image: "",
    source: "",
    confidence: null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState(createInitialFormData);
  const [imageOrigin, setImageOrigin] = useState("");
  const [imageUploadState, setImageUploadState] = useState({
    status: "idle",
    error: "",
  });

  // ── Update mode state (Priority 1: product found in own store) ──────────────
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [storeProductId, setStoreProductId] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Barcode scanner / resolver state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolvingStep, setResolvingStep] = useState(""); // "store" | "master" | "external"
  const [resolveStatus, setResolveStatus] = useState(null);
  // "store_found" | "master_found" | "found" (external) | "not_found" | "error"

  // Loading overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const resolveDebounceRef = useRef(null);

  // Handle delayed loading overlay
  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => setShowOverlay(true), 1000);
    } else {
      const handleLoadingFinish = async () => {
        if (showOverlay && startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          const minDelayTotal = 3000;
          if (elapsed < minDelayTotal) {
            await new Promise((r) => setTimeout(r, minDelayTotal - elapsed));
          }
        }
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setShowOverlay(false);
        startTimeRef.current = null;
      };
      handleLoadingFinish();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loading, showOverlay]);

  // Reset form + scanner state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(createInitialFormData());
      setImageOrigin("");
      setImageUploadState({ status: "idle", error: "" });
      setScannerOpen(false);
      setResolving(false);
      setResolveStatus(null);
      setIsUpdateMode(false);
      setStoreProductId(null);
    }
    return () => {
      if (resolveDebounceRef.current) clearTimeout(resolveDebounceRef.current);
    };
  }, [isOpen]);

  /**
   * Core resolver — implements the 4-level priority lookup chain.
   *
   * Priority:
   *   1. Own store  (by barcode + storeId)  → Update mode
   *   2. MasterProduct DB (global catalog)  → Pre-fill, add as new
   *   3. External API (Open*Facts)          → Pre-fill, add as new, save to master async
   *   4. Manual entry                       → On submit, save to master async
   */
  const resolveAndAutofill = async (barcode) => {
    if (!barcode || barcode.trim() === "") {
      setResolveStatus(null);
      setIsUpdateMode(false);
      setStoreProductId(null);
      return;
    }

    setResolveStatus(null);
    setIsUpdateMode(false);
    setStoreProductId(null);
    setResolving(true);

    try {
      // ── Priority 1: Check own store ─────────────────────────────────────────
      setResolvingStep("store");
      const storeProduct = await getStoreProductByBarcode(barcode, storeId);

      if (storeProduct) {
        // Found in store — switch to update mode and pre-fill all fields
        setStoreProductId(storeProduct._id);
        setIsUpdateMode(true);
        setFormData((prev) => ({
          ...prev,
          barcode,
          name: storeProduct.name || prev.name,
          brand: storeProduct.brand || prev.brand,
          category: storeProduct.category || prev.category,
          qty: storeProduct.quantity !== undefined ? String(storeProduct.quantity) : prev.qty,
          unit: storeProduct.unit || prev.unit,
          price: storeProduct.price !== undefined ? String(storeProduct.price) : prev.price,
          expDate: storeProduct.expDate
            ? new Date(storeProduct.expDate).toISOString().split("T")[0]
            : prev.expDate,
          image: storeProduct.image || prev.image || "",
          source: storeProduct.source || prev.source || "",
          confidence: storeProduct.confidence ?? null,
        }));
        if (storeProduct.image) setImageOrigin("resolver");
        setResolveStatus("store_found");
        return;
      }

      // ── Priority 2: Check MasterProduct DB ─────────────────────────────────
      setResolvingStep("master");
      const masterProduct = await fetchFromMasterProduct(barcode);

      if (masterProduct) {
        setFormData((prev) => ({
          ...prev,
          barcode,
          name: masterProduct.name || prev.name,
          brand: masterProduct.brand || prev.brand,
          category: mapToSelectCategory(masterProduct.category, masterProduct.source),
          image:
            imageOrigin === "manual" && prev.image
              ? prev.image
              : masterProduct.image || prev.image || "",
          source:
            imageOrigin === "manual" && prev.source
              ? prev.source
              : masterProduct.source || prev.source || "",
          confidence: masterProduct.confidence ?? null,
        }));
        if (imageOrigin !== "manual") {
          setImageOrigin(masterProduct.image ? "resolver" : "");
        }
        setResolveStatus("master_found");
        return;
      }

      // ── Priority 3: Try external API ────────────────────────────────────────
      setResolvingStep("external");
      const externalProduct = await resolveProductByBarcode(barcode);

      if (externalProduct) {
        setFormData((prev) => ({
          ...prev,
          barcode,
          name: externalProduct.name || prev.name,
          brand: externalProduct.brand || prev.brand,
          category: mapToSelectCategory(externalProduct.category, externalProduct.source),
          image:
            imageOrigin === "manual" && prev.image
              ? prev.image
              : externalProduct.image || prev.image || "",
          source:
            imageOrigin === "manual" && prev.source
              ? prev.source
              : externalProduct.source || prev.source || "",
          confidence: externalProduct.confidence ?? null,
        }));
        if (imageOrigin !== "manual") {
          setImageOrigin(externalProduct.image ? "resolver" : "");
        }
        setResolveStatus("found");
        return;
      }

      // ── Priority 4: Nothing found — manual entry ────────────────────────────
      setResolveStatus("not_found");
    } catch {
      setResolveStatus("error");
    } finally {
      setResolving(false);
      setResolvingStep("");
    }
  };

  /**
   * Called by BarcodeScanner when a barcode is successfully decoded.
   */
  const handleScanComplete = async (barcode) => {
    setScannerOpen(false);
    setFormData((prev) => ({ ...prev, barcode }));
    await resolveAndAutofill(barcode);
  };

  /**
   * Handle manual barcode entry blur — triggers resolver only if barcode is non-empty.
   */
  const handleBarcodeBlur = () => {
    if (resolveDebounceRef.current) {
      clearTimeout(resolveDebounceRef.current);
    }
    resolveAndAutofill(formData.barcode);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setImageUploadState({ status: "uploading", error: "" });

    try {
      const uploadedUrl = await uploadProductImage(file);
      if (!uploadedUrl) {
        throw new Error("Image upload returned no URL");
      }

      setFormData((prev) => ({
        ...prev,
        image: uploadedUrl,
        source: prev.source || "manual-upload",
      }));
      setImageOrigin("manual");
      setImageUploadState({ status: "success", error: "" });
    } catch (error) {
      setImageUploadState({
        status: "error",
        error: error?.message || "Failed to upload image",
      });
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
      source: imageOrigin === "manual" ? "" : prev.source,
    }));
    setImageOrigin("");
    setImageUploadState({ status: "idle", error: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Map a free-text category from the API to one of our select options.
   * Handles Open*Facts taxonomy tags (e.g. "en:open-beauty-facts") and null values.
   * Falls back to "General" when nothing matches.
   */
  const mapToSelectCategory = (raw = "", source = "") => {
    if (!raw) {
      if (/beauty/i.test(source)) return "Personal Care";
      return "General";
    }
    const cleaned = raw
      .replace(/\ben:[\w-]*/gi, "")
      .replace(/,\s*,/g, ",")
      .trim();
    const lower = (cleaned || raw).toLowerCase();
    if (
      /beauty|skin|hair|cosmeti|personal.?care|hygiene|soap|shampoo|lotion|cream|gel|cleanser|dental|oral|toothpaste|deodorant|sanitiz|sensodyne|dettol|cetaphil/.test(
        lower,
      )
    )
      return "Personal Care";
    if (/non.?food|household|cleaning/.test(lower)) return "Personal Care";
    if (/beverage|drink|juice|water|soda|tea|coffee/.test(lower))
      return "Beverages";
    if (/bread|bak|biscuit|cake|cookie/.test(lower)) return "Bakery";
    if (/dairy|milk|cheese|butter|yogurt|curd/.test(lower)) return "Dairy";
    if (/produce|fruit|veg|fresh/.test(lower)) return "Produce";
    if (/snack|chip|crisp|nut|popcorn/.test(lower)) return "Snacks";
    if (/pantry|grain|rice|flour|oil|spice|sauce/.test(lower)) return "Pantry";
    if (/beauty/i.test(source)) return "Personal Care";
    return "General";
  };

  const getBarcodeInputClass = () => {
    if (resolving) return "bg-blue-50 border-blue-300 cursor-wait";
    if (resolveStatus === "store_found")
      return "bg-teal-50 border-teal-400 focus:ring-2 focus:ring-teal-400";
    if (resolveStatus === "found")
      return "bg-green-50 border-green-400 focus:ring-2 focus:ring-green-400";
    if (resolveStatus === "master_found")
      return "bg-indigo-50 border-indigo-400 focus:ring-2 focus:ring-indigo-400";
    if (resolveStatus === "not_found" || resolveStatus === "error")
      return "bg-amber-50 border-amber-300 focus:ring-2 focus:ring-amber-400";
    return "bg-slate-50/50 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  };

  const getBarcodeIconClass = () => {
    if (resolveStatus === "store_found") return "text-teal-500";
    if (resolveStatus === "found") return "text-green-500";
    if (resolveStatus === "master_found") return "text-indigo-500";
    if (resolveStatus === "not_found" || resolveStatus === "error")
      return "text-amber-500";
    return "text-slate-400";
  };

  /**
   * Handle form submission.
   * - Update mode (store product found): calls updateProduct via context
   * - Add mode: calls onAction (addProduct via parent), then saves to MasterProduct async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUploadState.status === "uploading") return;

    const { qty, ...rest } = formData;
    const payload = {
      ...rest,
      quantity: Number(qty),
      price: Number(formData.price),
    };

    if (isUpdateMode && storeProductId) {
      // ── Update existing store product ───────────────────────────────────────
      setUpdating(true);
      try {
        const result = await updateProduct(storeProductId, payload);
        if (result?.success) {
          setFormData(createInitialFormData());
          setImageOrigin("");
          setImageUploadState({ status: "idle", error: "" });
          setResolveStatus(null);
          setIsUpdateMode(false);
          setStoreProductId(null);
          onClose();
        }
      } finally {
        setUpdating(false);
      }
    } else {
      // ── Add new store product ───────────────────────────────────────────────
      if (onAction) {
        const result = await onAction(payload);
        if (result?.success) {
          // Save to MasterProduct async when product has a barcode and wasn't from master/external
          // (external resolver already saved it; master_found means it's already there)
          if (
            formData.barcode &&
            (resolveStatus === "not_found" || resolveStatus === null || resolveStatus === "error")
          ) {
            saveToMasterProduct({
              barcode: formData.barcode,
              name: formData.name,
              brand: formData.brand,
              category: formData.category,
              image: formData.image,
              source: "user-submitted",
            }).catch(() => {
              // Silently ignore — saving to master catalog is non-critical
            });
          }
          setFormData(createInitialFormData());
          setImageOrigin("");
          setImageUploadState({ status: "idle", error: "" });
          setResolveStatus(null);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!mounted || !isOpen) return null;

  const isBusy = loading || resolving || updating || imageUploadState.status === "uploading";

  return ReactDOM.createPortal(
    <>
      {showOverlay && (
        <PageLoader
          message={isUpdateMode ? "Updating product..." : "Adding product to inventory..."}
        />
      )}

      {/* Barcode Scanner Modal */}
      {scannerOpen && (
        <BarcodeScanner
          onScan={handleScanComplete}
          onClose={() => setScannerOpen(false)}
        />
      )}

      <div className="fixed top-0 inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-y-auto max-h-[calc(100vh-6rem)] animate-scale-up scrollbar-hide">
          {/* Header */}
          <div
            className={`px-6 py-4 border-b border-slate-200 flex items-start justify-between ${
              isUpdateMode
                ? "bg-gradient-to-r from-teal-50 to-cyan-50"
                : "bg-gradient-to-r from-blue-50 to-indigo-50"
            }`}
          >
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isUpdateMode ? "Update Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                {isUpdateMode
                  ? "Edit and save changes to this existing product"
                  : "Register a new product to your inventory"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 hover:bg-white/80 rounded-xl text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm ml-4 flex-shrink-0"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form id="add-product-form" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-12 gap-3">
              {/* Product Name */}
              <div className="col-span-12 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Product Name
                </label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Organic Almond Milk"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
                />
              </div>

              {/* Brand */}
              <div className="col-span-12 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Brand{" "}
                  <span className="text-slate-400 normal-case font-medium">
                    (optional)
                  </span>
                </label>
                <input
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ex: Nestlé, Amul, Dettol"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
                />
              </div>

              {/* Category */}
              <div className="col-span-12 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 cursor-pointer font-semibold"
                >
                  <option>General</option>
                  <option>Beverages</option>
                  <option>Bakery</option>
                  <option>Dairy</option>
                  <option>Produce</option>
                  <option>Pantry</option>
                  <option>Snacks</option>
                  <option>Personal Care</option>
                </select>
              </div>

              {/* Qty & Unit */}
              <div className="col-span-5 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide min-h-[32px] flex items-end">
                  {isUpdateMode ? "Quantity" : "Initial Qty"}
                </label>
                <input
                  required
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
                />
              </div>
              <div className="col-span-7 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide min-h-[32px] flex items-end">
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 cursor-pointer font-semibold"
                >
                  <option>Pieces</option>
                  {/* <option>ml</option>
                  <option>g</option>
                  <option>kg</option>
                  <option>Liters</option>
                  <option>Packs</option>
                  <option>Bottles</option> */}
                </select>
              </div>

              {/* Price & Exp Date */}
              <div className="col-span-5 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide min-h-[32px] flex items-end">
                  Price (₹)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
                />
              </div>
              <div className="col-span-7 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide min-h-[32px] flex items-end">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expDate"
                  value={formData.expDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 cursor-pointer font-semibold"
                />
              </div>

              {/* Barcode + Scan Button */}
              <div className="col-span-12 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Barcode / EAN
                </label>

                <div className="flex items-center gap-3">
                  {/* Input with state indicators */}
                  <div className="relative flex-1">
                    <input
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleChange}
                      onBlur={handleBarcodeBlur}
                      placeholder="Scan or enter barcode"
                      disabled={resolving}
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition-all text-slate-900 font-semibold ${getBarcodeInputClass()}`}
                    />

                    {/* Left icon: spinner while resolving, barcode otherwise */}
                    {resolving ? (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 border-2 border-blue-400/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <svg
                        className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${getBarcodeIconClass()}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Scan Button */}
                  <button
                    type="button"
                    disabled={resolving}
                    onClick={() => {
                      setResolveStatus(null);
                      setIsUpdateMode(false);
                      setStoreProductId(null);
                      setScannerOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12h10"
                      />
                    </svg>
                    <span>{resolving ? "Resolving…" : "Scan"}</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={resolving || imageUploadState.status === "uploading"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span>
                      {imageOrigin === "manual" ? "Change image" : "Upload image"}
                    </span>
                  </button>

                  {formData.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-sm font-bold text-rose-700 transition-colors"
                    >
                      Remove image
                    </button>
                  )}
                </div>

                {/* ── Resolve status banners ─────────────────────────────────── */}

                {resolving && (
                  <p className="text-xs text-blue-600 font-semibold flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    {resolvingStep === "store"
                      ? "Checking your store inventory…"
                      : resolvingStep === "master"
                      ? "Checking product catalogue…"
                      : "Looking up product details…"}
                  </p>
                )}

                {/* Priority 1: Found in own store */}
                {resolveStatus === "store_found" && (
                  <div className="mt-1 p-3 bg-teal-50 border border-teal-200 rounded-xl">
                    <p className="text-xs text-teal-800 font-bold flex items-center gap-1.5">
                      <svg className="h-4 w-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      This product is already in your store — editing existing product
                    </p>
                    <p className="text-xs text-teal-700 mt-1">
                      All fields have been pre-filled. Make your changes and click <strong>Update Product</strong>.
                    </p>
                    {formData.image && (
                      <div className="flex items-center gap-3 mt-2 p-2 bg-white border border-teal-200 rounded-xl">
                        <img
                          src={formData.image}
                          alt={formData.name}
                          className="h-14 w-14 object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <div className="text-xs text-slate-600 font-medium leading-snug">
                          {formData.brand && (
                            <p className="font-bold text-slate-800">{formData.brand}</p>
                          )}
                          <p className="text-slate-500">From your inventory</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Priority 2: Found in MasterProduct */}
                {resolveStatus === "master_found" && (
                  <div className="mt-1">
                    <p className="text-xs text-indigo-700 font-semibold flex items-center gap-1.5">
                      ✓ Found in product catalogue — fields auto-filled. Review
                      and adjust if needed.
                    </p>
                    {formData.image && (
                      <div className="flex items-center gap-3 mt-1.5 p-2 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <img
                          src={formData.image}
                          alt={formData.name}
                          className="h-14 w-14 object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <div className="text-xs text-slate-600 font-medium leading-snug">
                          {formData.brand && (
                            <p className="font-bold text-slate-800">{formData.brand}</p>
                          )}
                          <p className="text-slate-500">
                            {imageOrigin === "manual"
                              ? "Uploaded image"
                              : "From your product catalogue"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Priority 3: Found via external API */}
                {resolveStatus === "found" && (
                  <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                    ✓ Product found — fields auto-filled. Review and adjust if needed.
                  </p>
                )}
                {resolveStatus === "found" && formData.image && (
                  <div className="flex items-center gap-3 mt-1 p-2 bg-green-50 border border-green-200 rounded-xl">
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="h-14 w-14 object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="text-xs text-slate-600 font-medium leading-snug">
                      {formData.brand && (
                        <p className="font-bold text-slate-800">{formData.brand}</p>
                      )}
                      <p className="text-slate-500">
                        {imageOrigin === "manual"
                          ? "Uploaded image"
                          : `via ${formData.source}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Image upload states */}
                {imageUploadState.status === "uploading" && (
                  <p className="text-xs text-blue-600 font-semibold flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Uploading image
                  </p>
                )}
                {imageUploadState.status === "error" && (
                  <p className="text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                    ⚠️ {imageUploadState.error || "Image upload failed"}
                  </p>
                )}
                {formData.image && imageOrigin === "manual" && (
                  <div className="flex items-center gap-3 mt-1 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <img
                      src={formData.image}
                      alt={formData.name || "Uploaded product"}
                      className="h-14 w-14 object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="text-xs text-slate-600 font-medium leading-snug">
                      <p className="font-bold text-slate-800">Uploaded image</p>
                      <p className="text-slate-500">Stored in Cloudinary and ready to save</p>
                    </div>
                  </div>
                )}

                {/* Priority 4: Not found anywhere */}
                {resolveStatus === "not_found" && (
                  <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-800 font-bold flex items-center gap-1.5">
                      <svg
                        className="h-4 w-4 text-amber-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Product not found in any source
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      This barcode wasn&apos;t found in your store, the product catalogue, or any
                      external database. Please fill in the product details manually — it will
                      be saved to the shared catalogue for future users.
                    </p>
                  </div>
                )}
                {resolveStatus === "error" && (
                  <p className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                    ⚠️ Could not reach lookup service. Please enter details
                    manually.
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold transition-all text-slate-700 border border-slate-300 hover:bg-white/80 hover:border-slate-400 shadow-sm text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-product-form"
              disabled={isBusy}
              className={`py-2.5 px-6 font-bold disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg text-sm rounded-xl text-white transition-all ${
                isUpdateMode
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-teal-500/30"
                  : "btn-primary-yb"
              }`}
            >
              {(loading || updating) && (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>
                {updating
                  ? "Updating..."
                  : loading
                  ? "Adding..."
                  : isUpdateMode
                  ? "Update Product"
                  : "Add Product"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default AddProductModal;
