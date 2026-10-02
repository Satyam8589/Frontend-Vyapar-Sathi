"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PageLoader from "@/components/PageLoader";
import { uploadProductImage } from "../services/inventoryService";
import { STANDARD_UNITS } from "./AddProductModal";

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
    sellingPrice: "",
    buyingPrice: "",
    expDate: "",
    barcode: "",
    image: "",
  });

  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [imageOrigin, setImageOrigin] = useState("");
  const [imageUploadState, setImageUploadState] = useState({
    status: "idle",
    error: "",
  });

  const [showOverlay, setShowOverlay] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const [extraQty, setExtraQty] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [lastAddMessage, setLastAddMessage] = useState("");

  const handleAddExtraStock = (amountToAdd) => {
    const val = Number(amountToAdd);
    if (isNaN(val) || val === 0) return;

    const current = Number(formData.qty) || 0;
    const newTotal = Math.max(0, current + val);

    setFormData((prev) => ({
      ...prev,
      qty: newTotal.toString(),
    }));

    setLastAddMessage(`Added +${val} (Stock: ${current} ➔ ${newTotal})`);
    setExtraQty("");

    setTimeout(() => {
      setLastAddMessage("");
    }, 4000);
  };

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

      const currentUnit = product.unit || "Pieces";
      if (!STANDARD_UNITS.includes(currentUnit)) {
        setIsCustomUnit(true);
      } else {
        setIsCustomUnit(false);
      }

      setFormData({
        name: product.name || "",
        category: product.category || "General",
        qty: (product.quantity ?? product.qty ?? 0).toString(),
        unit: currentUnit,
        sellingPrice: (product.sellingPrice ?? 0).toString(),
        buyingPrice: (product.buyingPrice ?? 0).toString(),
        expDate: formattedDate,
        barcode: product.barcode || "",
        image: product.image || "",
      });

      setExtraQty("");
      setShowAddInput(false);
      setLastAddMessage("");

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
      sellingPrice: Number(formData.sellingPrice),
      buyingPrice: Number(formData.buyingPrice),
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
              <div className="flex items-center justify-between min-h-[20px]">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Current Stock
                </label>
                {lastAddMessage && (
                  <span className="text-[10px] font-bold text-emerald-600 animate-fade-in truncate max-w-[130px]">
                    ✅ {lastAddMessage}
                  </span>
                )}
              </div>

              {/* Input Box Container with Inline + Add Button inside */}
              <div className="relative flex items-center bg-slate-50/50 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all pr-1.5 overflow-hidden">
                <input
                  required
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-3.5 py-3 bg-transparent outline-none text-slate-900 font-bold text-base min-w-0"
                />

                {/* Compact Inline Addition Tool inside Current Stock box */}
                <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-slate-200">
                  {showAddInput ? (
                    <div className="flex items-center gap-1 bg-white border border-blue-400 rounded-lg p-1 shadow-sm animate-scale-up">
                      <span className="text-xs font-extrabold text-blue-600 pl-0.5">+</span>
                      <input
                        autoFocus
                        type="number"
                        placeholder="Qty"
                        value={extraQty}
                        onChange={(e) => setExtraQty(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddExtraStock(extraQty);
                            setShowAddInput(false);
                          } else if (e.key === "Escape") {
                            setShowAddInput(false);
                          }
                        }}
                        className="w-11 text-xs font-extrabold text-blue-800 bg-transparent outline-none text-center"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleAddExtraStock(extraQty);
                          setShowAddInput(false);
                        }}
                        className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded text-[10px] font-bold transition-all"
                        title="Sum up into current stock"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddInput(false)}
                        className="px-1 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowAddInput(true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                        title="Click to add extra stock (Auto-Sums)"
                      >
                        <span className="font-extrabold">+</span>
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-7 flex flex-col gap-2">
              <div className="flex items-center justify-between min-h-[20px]">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Unit
                </label>
                {isCustomUnit && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomUnit(false);
                      setFormData((prev) => ({
                        ...prev,
                        unit: STANDARD_UNITS.includes(prev.unit) && prev.unit ? prev.unit : "Pieces",
                      }));
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ← Standard list
                  </button>
                )}
              </div>

              {isCustomUnit ? (
                <div className="relative flex items-center">
                  <input
                    required
                    autoFocus
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="Type custom unit (e.g. Bundle, Tray, Drum)"
                    className="w-full px-4 py-3 bg-white border-2 border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 font-semibold shadow-xs"
                  />
                </div>
              ) : (
                <select
                  name="unit"
                  value={STANDARD_UNITS.includes(formData.unit) ? formData.unit : "__custom__"}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setIsCustomUnit(true);
                      setFormData((prev) => ({ ...prev, unit: "" }));
                    } else {
                      setFormData((prev) => ({ ...prev, unit: e.target.value }));
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 cursor-pointer font-semibold"
                >
                  <optgroup label="Count & Packaging">
                    <option value="Pieces">Pieces (Pcs)</option>
                    <option value="Packs">Packs (Pkts)</option>
                    <option value="Boxes">Boxes (Box)</option>
                    <option value="Bottles">Bottles (Btl)</option>
                    <option value="Cans">Cans</option>
                    <option value="Cartons">Cartons (Ctn)</option>
                    <option value="Dozens">Dozens (Dzn)</option>
                    <option value="Pouches">Pouches</option>
                    <option value="Sachets">Sachets</option>
                    <option value="Strips">Strips (Medicines)</option>
                    <option value="Bags">Bags / Sacks</option>
                    <option value="Pairs">Pairs</option>
                    <option value="Sets">Sets</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Bundles">Bundles</option>
                    <option value="Jars">Jars</option>
                    <option value="Tubes">Tubes</option>
                  </optgroup>
                  <optgroup label="Weight & Mass">
                    <option value="kg">kg (Kilogram)</option>
                    <option value="g">g (Gram)</option>
                    <option value="mg">mg (Milligram)</option>
                    <option value="Quintal">Quintal (q)</option>
                    <option value="Ton">Ton (t)</option>
                  </optgroup>
                  <optgroup label="Volume & Liquids">
                    <option value="Liters">Liters (L)</option>
                    <option value="ml">ml (Milliliter)</option>
                  </optgroup>
                  <optgroup label="Length & Area">
                    <option value="Meters">Meters (m)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="Feet">Feet (ft)</option>
                    <option value="Inches">Inches (in)</option>
                    <option value="Sq. Feet">Sq. Feet (sq.ft)</option>
                    <option value="Sq. Meters">Sq. Meters (sq.m)</option>
                  </optgroup>
                  <option value="__custom__">✍️ Custom Unit (Type manually)...</option>
                </select>
              )}
            </div>

            {/* Price & Exp Date */}
            <div className="col-span-6 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide min-h-[32px] flex items-end">
                Buying Price (₹)
              </label>
              <input
                required
                type="number"
                step="0.01"
                name="buyingPrice"
                value={formData.buyingPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
              />
            </div>
            <div className="col-span-6 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide min-h-[32px] flex items-end">
                Selling Price (₹)
              </label>
              <input
                required
                type="number"
                step="0.01"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
              />
            </div>
            <div className="col-span-12 flex flex-col gap-2">
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
