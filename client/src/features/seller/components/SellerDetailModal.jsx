"use client";

import { useState, useEffect } from "react";
import ReactDOM from "react-dom";

const currencyFormat = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

const formatAddress = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  if (typeof addr === "object") {
    if (addr.fullAddress) return addr.fullAddress;
    const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
    return parts.join(", ") || "";
  }
  return String(addr);
};

export default function SellerDetailModal({ isOpen, onClose, seller, onEdit }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !isOpen || !seller) return null;

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "S";

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100 flex items-center gap-4">
          <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/30 flex-shrink-0">
            {getInitials(seller.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-slate-900 tracking-tight truncate">{seller.name}</h2>
            {seller.businessName && (
              <p className="text-sm text-slate-500 font-medium truncate">{seller.businessName}</p>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${
              seller.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-slate-100 text-slate-500"
            }`}>
              {seller.status === "active" ? "● Active" : "● Inactive"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border-b border-slate-100">
          {[
            { label: "Total Purchase", value: currencyFormat(seller.totalPurchase), color: "text-blue-600" },
            { label: "Total Paid", value: currencyFormat(seller.totalPaid), color: "text-green-600" },
            { label: "Outstanding Due", value: currencyFormat(seller.totalDue), color: seller.totalDue > 0 ? "text-red-600" : "text-slate-500" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-3 text-center">
              <p className={`text-base font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {[
            { label: "Phone", value: seller.phone, icon: "📞" },
            { label: "Email", value: seller.email || "—", icon: "📧" },
            { label: "Address", value: formatAddress(seller.address) || "—", icon: "📍" },
            { label: "GSTIN", value: seller.GSTIN || "—", icon: "🏢" },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
              <span className="text-base mt-0.5">{row.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{row.label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{row.value}</p>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-3 py-2">
            <span className="text-base mt-0.5">📅</span>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Added On</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {new Date(seller.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(seller); }}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
          >
            Edit Seller
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
