"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import dynamic from "next/dynamic";
import PageLoader from "@/components/PageLoader";
import { resolveProductByBarcode } from "../services/inventoryService";

// Dynamically import BarcodeScanner — html5-qrcode accesses browser APIs,
// so it must never run during SSR (Next.js server render).
const BarcodeScanner = dynamic(() => import("./BarcodeScanner"), {
  ssr: false,
});

const AddProductModal = ({ isOpen, onClose, onAction, loading }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    qty: "",
    unit: "Pieces",
    price: "",
    expDate: "",
    barcode: "",
  });

  // Barcode scanner / resolver state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolveStatus, setResolveStatus] = useState(null); // "found" | "not_found" | "error"

  // Loading overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const resolveDebounceRef = useRef(null); // Debounce manual entry resolver

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
            await new Promise(r => setTimeout(r, minDelayTotal - elapsed));
          }
        }
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
        setShowOverlay(false);
        startTimeRef.current = null;
      };
      handleLoadingFinish();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [loading, showOverlay]);

  // Reset form + scanner state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", category: "General", qty: "", unit: "Pieces", price: "", expDate: "", barcode: "" });
      setScannerOpen(false);
      setResolving(false);
      setResolveStatus(null);
    }
    return () => {
      if (resolveDebounceRef.current) clearTimeout(resolveDebounceRef.current);
    };
  }, [isOpen]);

  /**
   * Core resolver logic — used by both scanner and manual entry.
   * Fetches product details from the backend and autofills the form.
   */
  const resolveAndAutofill = async (barcode) => {
    if (!barcode || barcode.trim() === "") {
      setResolveStatus(null);
      return;
    }

    setResolveStatus(null);
    setResolving(true);

    try {
      const product = await resolveProductByBarcode(barcode);

      if (!product) {
        setResolveStatus("not_found");
        return;
      }

      // Autofill available fields — keep user-entered qty/price as-is
      setFormData(prev => ({
        ...prev,
        barcode,
        name: product.name || prev.name,
        category: product.category
          ? mapToSelectCategory(product.category)
          : prev.category,
      }));

      setResolveStatus("found");
    } catch {
      setResolveStatus("error");
    } finally {
      setResolving(false);
    }
  };

  /**
   * Called by BarcodeScanner when a barcode is successfully decoded.
   * Sends it to the backend resolver and autofills the form.
   */
  const handleScanComplete = async (barcode) => {
    setScannerOpen(false);
    setFormData(prev => ({ ...prev, barcode }));
    await resolveAndAutofill(barcode);
  };

  /**
   * Handle manual barcode entry blur — triggers resolver only if barcode looks valid.
   * Uses debounce to avoid excessive API calls if user is still typing.
   */
  const handleBarcodeBlur = () => {
    if (resolveDebounceRef.current) {
      clearTimeout(resolveDebounceRef.current);
    }
    // Trigger resolver immediately on blur
    resolveAndAutofill(formData.barcode);
  };

  /**
   * Map a free-text category from the API to one of our select options.
   * Falls back to "General" when nothing matches.
   */
  const mapToSelectCategory = (raw = "") => {
    const lower = raw.toLowerCase();
    if (/beverage|drink|juice|water|soda|tea|coffee/.test(lower)) return "Beverages";
    if (/bread|bak|biscuit|cake|cookie/.test(lower))              return "Bakery";
    if (/dairy|milk|cheese|butter|yogurt|curd/.test(lower))       return "Dairy";
    if (/produce|fruit|veg|fresh/.test(lower))                    return "Produce";
    if (/pantry|grain|rice|flour|oil|spice|sauce/.test(lower))    return "Pantry";
    return "General";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onAction) {
      const result = await onAction({ ...formData, quantity: Number(formData.qty), price: Number(formData.price) });
      if (result?.success) {
        setFormData({
          name: "",
          category: "General",
          qty: "",
          unit: "Pieces",
          price: "",
          expDate: "",
          barcode: "",
        });
        setResolveStatus(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!mounted || !isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {showOverlay && <PageLoader message="Adding product to inventory..." />}

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
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Add New Product
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                Register a new product to your inventory
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 hover:bg-white/80 rounded-xl text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm ml-4 flex-shrink-0"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                </select>
              </div>

              {/* Qty & Unit */}
              <div className="col-span-5 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide min-h-[32px] flex items-end">
                  Initial Qty
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
                  <option>kg</option>
                  <option>Liters</option>
                  <option>Packs</option>
                  <option>Bottles</option>
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
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl outline-none transition-all text-slate-900 font-semibold
                          ? "bg-blue-50 border-blue-300 cursor-wait"
                          : resolveStatus === "found"
                            ? "bg-green-50 border-green-400 focus:ring-2 focus:ring-green-400"
                            : (resolveStatus === "not_found" || resolveStatus === "error")
                              ? "bg-green-50 border-green-400 focus:ring-2 focus:ring-green-400"
                              : "bg-slate-50/50 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                    />

                    {/* Left icon: spinner while resolving, barcode otherwise */}
                    {resolving ? (
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 border-2 border-blue-400/30 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <svg
                        className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                          (resolveStatus === "found" || resolveStatus === "not_found" || resolveStatus === "error") ? "text-green-500"
                          : "text-slate-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Scan Button */}
                  <button
                    type="button"
                    disabled={resolving}
                    onClick={() => { setResolveStatus(null); setScannerOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 active:scale-95"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h10" />
                    </svg>
                    <span>{resolving ? "Resolving…" : "Scan"}</span>
                  </button>
                </div>

                {/* Resolve status banners */}
                {resolving && (
                  <p className="text-xs text-blue-600 font-semibold flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Looking up product details…
                  </p>
                )}
                {resolveStatus === "found" && (
                  <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                    ✓ Product found — fields auto-filled. Review and adjust if needed.
                  </p>
                )}
                {resolveStatus === "not_found" && (
                  <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                    ✓ New product! Please fill in the details manually.
                  </p>
                )}
                {resolveStatus === "error" && (
                  <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                    ✓ Could not reach lookup service. Please enter details manually.
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
              disabled={loading || resolving}
              className="btn-primary-yb py-2.5 px-6 font-bold disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg text-sm"
            >
              {loading && (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{loading ? "Adding..." : "Add Product"}</span>
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};



export default AddProductModal;
