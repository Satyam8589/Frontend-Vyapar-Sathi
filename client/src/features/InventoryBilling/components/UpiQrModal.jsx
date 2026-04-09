"use client";

import { useEffect, useRef } from "react";
import { X, Smartphone, CheckCircle, AlertCircle } from "lucide-react";
import QRCode from "react-qr-code";

/**
 * UpiQrModal
 * Generates a DYNAMIC UPI QR code per bill so the customer's UPI app
 * auto-fills the merchant + exact amount when scanned.
 *
 * UPI deep link format:
 *   upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<NOTE>
 *
 * Props:
 *   isOpen       - boolean
 *   onClose      - () => void
 *   totalAmount  - number  (bill total)
 *   upiId        - string  (e.g. "9876543210@paytm")
 *   upiName      - string  (payee name shown in UPI app)
 *   storeName    - string
 */
const UpiQrModal = ({ isOpen, onClose, totalAmount, upiId, upiName, storeName }) => {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build UPI deep link — amount is fixed to 2 decimal places as required by UPI spec
  const buildUpiUrl = () => {
    if (!upiId) return null;
    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName || storeName || "Merchant",
      am: totalAmount.toFixed(2),
      cu: "INR",
      tn: `Bill Payment - ${storeName || "Store"}`,
    });
    return `upi://pay?${params.toString()}`;
  };

  const upiUrl = buildUpiUrl();

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(5px)" }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "upiIn 0.28s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* ── Header gradient ── */}
        <div
          className="relative px-6 pt-6 pb-5 text-center"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>

          {/* Icon + title */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="bg-white/20 rounded-full p-2">
              <Smartphone size={20} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Pay via UPI</h2>
          </div>

          {/* Amount pill */}
          <div className="inline-block bg-white rounded-2xl px-8 py-3 shadow-lg">
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-0.5">
              Total Amount
            </p>
            <p
              className="text-4xl font-black tracking-tight"
              style={{ color: "#4f46e5" }}
            >
              ₹{totalAmount?.toFixed(2) ?? "0.00"}
            </p>
          </div>

          {/* UPI ID badge */}
          {upiId && (
            <p className="text-white/70 text-xs mt-3 font-mono">
              📲 {upiId}
            </p>
          )}
        </div>

        {/* ── QR / Content ── */}
        <div className="px-6 py-6 flex flex-col items-center gap-4">
          {upiUrl ? (
            <>
              {/* Dynamic QR code */}
              <div
                className="p-4 rounded-2xl border-4 shadow-md"
                style={{ borderColor: "#e0e7ff", background: "#fff" }}
              >
                <QRCode
                  value={upiUrl}
                  size={192}
                  bgColor="#ffffff"
                  fgColor="#1e1b4b"
                  level="M"
                />
              </div>

              {/* Accepted apps */}
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-gray-700">
                  Scan with any UPI app
                </p>
                <div className="flex items-center justify-center gap-3 text-xs text-gray-400 font-medium">
                  <span>📱 GPay</span>
                  <span>·</span>
                  <span>📱 PhonePe</span>
                  <span>·</span>
                  <span>📱 Paytm</span>
                  <span>·</span>
                  <span>📱 BHIM</span>
                </div>
              </div>

              {/* Auto-fill note */}
              <div
                className="w-full flex items-start gap-2 px-4 py-3 rounded-xl text-xs"
                style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
              >
                <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-700 leading-relaxed">
                  Amount <strong>₹{totalAmount?.toFixed(2)}</strong> is automatically
                  pre-filled when the customer scans this QR. No manual entry needed.
                </p>
              </div>
            </>
          ) : (
            /* No UPI ID configured */
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "#fef3c7" }}
              >
                <AlertCircle size={36} className="text-amber-500" />
              </div>
              <p className="text-gray-700 text-sm font-semibold">
                UPI ID not configured
              </p>
              <p className="text-gray-400 text-xs leading-relaxed max-w-[220px]">
                Ask the store owner to add their UPI ID in{" "}
                <strong>Store Settings</strong> to enable this feature.
              </p>
            </div>
          )}

          {/* Done button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mt-1"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
            }}
          >
            ✓ &nbsp;Payment Done
          </button>
        </div>
      </div>

      <style>{`
        @keyframes upiIn {
          from { opacity: 0; transform: scale(0.86) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
};

export default UpiQrModal;
