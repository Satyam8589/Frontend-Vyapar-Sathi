"use client";

import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  status: "active",
};

export default function BuyerFormModal({ isOpen, onClose, onSubmit, loading, buyer }) {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const isEdit = !!buyer;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setForm(
        buyer
          ? {
              name: buyer.name || "",
              phone: buyer.phone || "",
              email: buyer.email || "",
              status: buyer.status || "active",
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [isOpen, buyer]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email format";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong' });
    }
  };

  if (!mounted || !isOpen) return null;

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm font-medium text-slate-800 bg-white transition-all outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
      errors[field] ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300"
    }`;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 select-none">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center gap-3 flex-shrink-0">
          <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-emerald-500/30">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEdit ? "Edit Buyer" : "Add New Buyer"}
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {isEdit ? "Update buyer information" : "Fill in customer details"}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              ⚠ {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                className={inputClass("name")}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Customer name"
                autoFocus
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Phone *</label>
              <input
                type="tel"
                className={inputClass("phone")}
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                className={inputClass("email")}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="customer@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
              <select
                className={inputClass("status")}
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Buyer"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
