"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PageLoader from "@/components/PageLoader";
import { uploadProductImage } from "../services/inventoryService";

const EditProductModal = ({ isOpen, onClose, onUpdate, loading, product }) => {
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    qty: "",
    unit: "Pieces",
    price: "",
    expDate: "",
    barcode: "",
    image: "",
  });

  const [imageOrigin, setImageOrigin] = useState("");
  const [imageUploadState, setImageUploadState] = useState({
    status: "idle",
    error: "",
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
        qty: (product.quantity ?? product.qty ?? 0).toString(),
        unit: product.unit || "Pieces",
        price: (product.price ?? 0).toString(),
        expDate: formattedDate,
        barcode: product.barcode || "",
        image: product.image || "",
      });

      setImageOrigin(product.image ? "existing" : "");
      setImageUploadState({ status: "idle", error: "" });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, product]);

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
    }));
    setImageOrigin("");
    setImageUploadState({ status: "idle", error: "" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageUploadState.status === "uploading") return;
    if (!product?._id) return;
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

  const canEditImage = imageUploadState.status !== "uploading";

  if (!mounted || !isOpen) return null;

  return ReactDOM.createPortal(
    <>
      {showOverlay && <PageLoader message="Updating product in inventory..." />}
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
        <form id="edit-product-form" onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-12 gap-3">
            {/* Name */}
            <div className="col-span-12 flex flex-col gap-2">
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
                {/* <option>kg</option>
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

            {/* Barcode */}
            <div className="col-span-12 flex flex-col gap-2">
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

            {/* Image */}
            <div className="col-span-12 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Product Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canEditImage}
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
                  <span>{formData.image ? "Change image" : "Upload image"}</span>
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

              {formData.image && (
                <div className={`flex items-center gap-3 mt-1 p-2 rounded-xl border ${imageOrigin === "manual" ? "bg-slate-50 border-slate-200" : "bg-indigo-50 border-indigo-200"}`}>
                  <img
                    src={formData.image}
                    alt={formData.name || "Product image"}
                    className="h-14 w-14 object-contain rounded-lg border border-slate-200 bg-white flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="text-xs text-slate-600 font-medium leading-snug">
                    <p className="font-bold text-slate-800">
                      {imageOrigin === "manual" ? "Uploaded image" : "Existing image"}
                    </p>
                    <p className="text-slate-500">
                      {imageOrigin === "manual"
                        ? "Stored in Cloudinary and ready to save"
                        : "Will be kept unless you upload a new image or remove it"}
                    </p>
                  </div>
                </div>
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
            form="edit-product-form"
            disabled={loading || imageUploadState.status === "uploading"}
            className="btn-primary-yb py-2.5 px-6 font-bold disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg text-sm"
          >
            {loading && (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            <span>{loading ? "Updating..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  </>,
  document.body
);
};

export default EditProductModal;
