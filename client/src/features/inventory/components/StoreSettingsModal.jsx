"use client";

import { useState, useRef } from "react";
import {
  X,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { updateStoreSettings } from "@/features/storeDashboard/services/storeDashboardService";
import { showSuccess, showError } from "@/utils/toast";

/**
 * StoreSettingsModal/Card
 * Owner sets their UPI ID here. A live preview QR is shown so they can
 * verify it before saving.
 *
 * Props:
 *  - isOpen (only needed when isModal=true)
 *  - onClose (only needed when isModal=true)
 *  - store
 *  - onStoreUpdated (updatedStore) => void
 *  - isModal (default: true) - if false, renders as a card instead of modal
 */
const StoreSettingsModal = ({
  isOpen,
  onClose,
  store,
  onStoreUpdated,
  isModal = true,
}) => {
  const [upiId, setUpiId] = useState(store?.settings?.upiId || "");
  const [upiName, setUpiName] = useState(
    store?.settings?.upiName || store?.name || "",
  );
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const overlayRef = useRef(null);

  // Lazy-load react-qr-code only in the preview section to avoid SSR issues
  const [QRCode, setQRCode] = useState(null);

  const loadQR = async () => {
    if (!QRCode) {
      const mod = await import("react-qr-code");
      setQRCode(() => mod.default);
    }
    setShowPreview(true);
  };

  const buildPreviewUrl = () => {
    if (!upiId.trim()) return null;
    const params = new URLSearchParams({
      pa: upiId.trim(),
      pn: upiName.trim() || store?.name || "Merchant",
      am: "1.00", // preview always shows ₹1
      cu: "INR",
      tn: "Test Payment",
    });
    return `upi://pay?${params.toString()}`;
  };

  const isValidUpiId = (id) =>
    /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(id.trim());

  const hasChanged =
    upiId.trim() !== (store?.settings?.upiId || "") ||
    upiName.trim() !== (store?.settings?.upiName || store?.name || "");

  const handleSave = async () => {
    if (!store?._id) return;

    if (upiId.trim() && !isValidUpiId(upiId)) {
      showError("Invalid UPI ID format (e.g. 9876543210@paytm)");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateStoreSettings(store._id, {
        settings: {
          ...store.settings,
          upiId: upiId.trim() || null,
          upiName: upiName.trim() || null,
        },
      });
      showSuccess("UPI settings saved!");
      onStoreUpdated?.(updated?.data || updated);
      if (isModal && onClose) onClose();
    } catch (err) {
      showError(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (isModal && !isOpen) return null;

  const previewUrl = buildPreviewUrl();

  const cardContent = (
    <>
      {/* UPI Settings Header */}
      <div
        className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 ${isModal ? "" : "rounded-t-2xl"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <Smartphone size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">UPI Settings</h2>
          </div>
        </div>
        {isModal && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Body */}
      <div
        className={`px-6 py-5 space-y-5 ${isModal ? "overflow-y-auto max-h-[70vh]" : ""}`}
      >
        {/* How it works banner */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{ background: "#eef2ff", border: "1px solid #c7d2fe" }}
        >
          <CheckCircle
            size={16}
            className="text-indigo-500 flex-shrink-0 mt-0.5"
          />
          <div className="text-xs text-indigo-700 leading-relaxed">
            <p className="font-semibold mb-0.5">How it works</p>
            Enter your UPI ID below. During billing, when the cashier selects
            &nbsp;<strong>UPI</strong>, a QR code is automatically generated
            with the &nbsp;<strong>exact bill amount</strong> — customers scan
            and pay in one tap.
          </div>
        </div>

        {/* UPI ID field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Your UPI ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              setShowPreview(false);
            }}
            placeholder="e.g. 9876543210@paytm  or  yourname@upi"
            className={`w-full px-4 py-3 rounded-xl border text-sm font-mono transition-colors outline-none focus:ring-2 focus:ring-indigo-300 ${
              upiId && !isValidUpiId(upiId)
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
          />
          {upiId && !isValidUpiId(upiId) && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> Format: yourname@bankname (e.g.
              9876543210@paytm)
            </p>
          )}
          {upiId && isValidUpiId(upiId) && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <CheckCircle size={12} /> Valid UPI ID
            </p>
          )}
        </div>

        {/* Display name field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Payee Name{" "}
            <span className="text-gray-400 font-normal">
              (shown in customer's UPI app)
            </span>
          </label>
          <input
            type="text"
            value={upiName}
            onChange={(e) => setUpiName(e.target.value)}
            placeholder="e.g. Ram Medical Store"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm transition-colors outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* UPI ID examples */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { app: "GPay", example: "number@okaxis" },
            { app: "PhonePe", example: "number@ybl" },
            { app: "Paytm", example: "number@paytm" },
            { app: "BHIM", example: "number@upi" },
          ].map(({ app, example }) => (
            <button
              key={app}
              onClick={() => {
                if (!upiId) setUpiId(example);
              }}
              className="text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            >
              <p className="text-xs font-semibold text-gray-600">{app}</p>
              <p className="text-xs text-gray-400 font-mono">{example}</p>
            </button>
          ))}
        </div>

        {/* Live Preview */}
        {isValidUpiId(upiId) && (
          <div>
            <button
              onClick={showPreview ? () => setShowPreview(false) : loadQR}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-colors"
            >
              {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
              {showPreview ? "Hide Preview" : "Preview QR Code (₹1 test)"}
            </button>

            {showPreview && previewUrl && QRCode && (
              <div className="mt-3 flex flex-col items-center gap-2 p-4 border border-indigo-100 rounded-xl bg-indigo-50">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-100">
                  <QRCode
                    value={previewUrl}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#1e1b4b"
                    level="M"
                  />
                </div>
                <p className="text-xs text-indigo-600 text-center font-medium">
                  Preview QR · Shows ₹1 (actual QR will use bill total)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 ${isModal ? "" : "rounded-b-2xl"}`}
      >
        {isModal && (
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={
            saving || !hasChanged || (upiId.trim() && !isValidUpiId(upiId))
          }
          className="px-5 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            boxShadow:
              saving || !hasChanged
                ? "none"
                : "0 4px 14px rgba(79,70,229,0.35)",
          }}
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              <CheckCircle size={15} /> Save UPI Settings
            </>
          )}
        </button>
      </div>
    </>
  );

  // Render as card (standalone) or modal
  if (isModal) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
        }}
        onClick={(e) => e.target === overlayRef.current && onClose()}
      >
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          style={{
            animation: "settingsIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {cardContent}
          <style>{`
            @keyframes settingsIn {
              from { opacity: 0; transform: scale(0.92) translateY(16px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Render as card
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg overflow-hidden">
      {cardContent}
    </div>
  );
};

export default StoreSettingsModal;
