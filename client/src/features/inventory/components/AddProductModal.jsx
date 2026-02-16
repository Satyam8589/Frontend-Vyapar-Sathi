"use client";

import React, { useState, useEffect } from "react";

const AddProductModal = ({ isOpen, onClose, onAction, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    qty: "",
    unit: "Pieces",
    price: "",
    expDate: "",
    barcode: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        category: "General",
        qty: "",
        unit: "Pieces",
        price: "",
        expDate: "",
        barcode: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map qty to quantity as expected by the backend and ensure numeric types
    const submissionData = {
      ...formData,
      quantity: Number(formData.qty),
      price: Number(formData.price),
    };

    onAction?.(submissionData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
              Add New Product
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-semibold">
              Register a new product to your inventory
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
                placeholder="Ex: Organic Almond Milk"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
              />
            </div>

            {/* Department */}
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
                Initial Quantity
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
                placeholder="0.00"
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

            {/* Barcode with Scanner Button */}
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Barcode / EAN
              </label>
              <div className="relative flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="Scan or enter barcode"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-semibold"
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
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
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30 active:scale-95"
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
                  <span>Scan</span>
                </button>
              </div>
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
              <span>{loading ? "Adding..." : "Add Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
