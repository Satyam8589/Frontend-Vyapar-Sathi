"use client";

import React, { useState, useEffect, useRef } from "react";
import PageLoader from "@/components/PageLoader";

const EditProductModal = ({ isOpen, onClose, onUpdate, loading, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    qty: "",
    unit: "Pieces",
    price: "",
    expDate: "",
    barcode: "",
  });

  const [showOverlay, setShowOverlay] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Handle delayed loading overlay
  useEffect(() => {
    if (loading) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        setShowOverlay(true);
      }, 1000);
    } else {
      const handleLoadingFinish = async () => {
        // If the overlay was actually shown, check if it was shown for enough time
        if (showOverlay && startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          const minDelayTotal = 3000; // 1s threshold + 2s display
          if (elapsed < minDelayTotal) {
            await new Promise(r => setTimeout(r, minDelayTotal - elapsed));
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
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [loading, showOverlay]);

  // Populate form when product changes
  useEffect(() => {
    if (isOpen && product) {
      // Format date to YYYY-MM-DD for input type="date"
      let formattedDate = "";
      if (product.expDate) {
        try {
          const date = new Date(product.expDate);
          formattedDate = date.toISOString().split("T")[0];
        } catch (e) {
          console.error("Invalid date format:", product.expDate);
        }
      }

      setFormData({
        name: product.name || "",
        category: product.category || "General",
        qty: (product.quantity || product.qty || 0).toString(),
        unit: product.unit || "Pieces",
        price: (product.price || 0).toString(),
        expDate: formattedDate,
        barcode: product.barcode || "",
      });
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      _id: product._id,
      quantity: Number(formData.qty),
      price: Number(formData.price),
    };

    onUpdate?.(submissionData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {showOverlay && <PageLoader message="Updating product in inventory..." />}
      <div className="fixed top-24 inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-y-auto max-h-[calc(100vh-8rem)] animate-scale-up scrollbar-hide">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Edit Product
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-semibold">
              Editing{" "}
              <span className="font-bold text-blue-600">"{product?.name}"</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-xl text-slate-400 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm"
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Product Name
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2 flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Current Stock
              </label>
              <input
                required
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
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
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Unit Price (₹)
              </label>
              <input
                required
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
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

            {/* Barcode */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Barcode / EAN
              </label>
              <input
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-slate-100/80 text-slate-700 font-bold rounded-xl hover:bg-slate-200/80 transition-all disabled:opacity-50 border border-slate-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary-yb py-3 font-bold disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading && (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span>{loading ? "Updating..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
);
};

export default EditProductModal;
