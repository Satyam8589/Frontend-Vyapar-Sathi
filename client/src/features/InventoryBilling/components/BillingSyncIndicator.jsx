"use client";

import { useState } from "react";
import { useBillingContext } from "../context/billingContext";
import {
  Smartphone,
  Wifi,
  WifiOff,
  QrCode,
  X,
  Copy,
  Check,
} from "lucide-react";
import QRCode from "react-qr-code";

export const BillingSyncIndicator = () => {
  const {
    syncEnabled,
    syncStatus,
    isMobile,
    startSync,
    stopSync,
    getMobileScanURL,
  } = useBillingContext();

  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleSync = () => {
    if (syncEnabled) {
      stopSync();
      setShowQR(false);
    } else {
      startSync();
    }
  };

  const handleShowQR = () => {
    if (!syncEnabled) {
      startSync();
    }
    setShowQR(true);
  };

  const handleCopyURL = async () => {
    const url = getMobileScanURL();
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case "connected":
        return "bg-green-500";
      case "syncing":
        return "bg-blue-500 animate-pulse";
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case "connected":
        return "Connected";
      case "syncing":
        return "Syncing...";
      case "connecting":
        return "Connecting...";
      default:
        return "Disconnected";
    }
  };

  // Don't show sync controls on mobile, only show if enabled
  if (isMobile && !syncEnabled) {
    return null;
  }

  return (
    <>
      {/* Sync Status Indicator */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {syncEnabled ? (
              <Wifi className="text-green-600 flex-shrink-0" size={24} />
            ) : (
              <WifiOff className="text-gray-400 flex-shrink-0" size={24} />
            )}
            <div>
              <h3 className="font-semibold text-gray-800">Real-Time Sync</h3>
              <p className="text-xs md:text-sm text-gray-500">
                Scan on phone, see on laptop instantly
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3">
            {/* Status indicator */}
            {syncEnabled && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                <span className="text-sm font-medium text-gray-700">
                  {getStatusText()}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {/* QR Code button */}
              {syncEnabled && (
                <button
                  onClick={handleShowQR}
                  className="flex-1 sm:flex-initial px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <QrCode size={18} />
                  <span className="hidden sm:inline">Show QR</span>
                  <span className="sm:hidden">QR Code</span>
                </button>
              )}

              {/* Toggle sync button */}
              <button
                onClick={handleToggleSync}
                className={`flex-1 sm:flex-initial px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base ${
                  syncEnabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {syncEnabled ? (
                  <>
                    <WifiOff size={18} />
                    <span className="hidden sm:inline">Disable Sync</span>
                    <span className="sm:hidden">Disable</span>
                  </>
                ) : (
                  <>
                    <Wifi size={18} />
                    <span className="hidden sm:inline">Enable Sync</span>
                    <span className="sm:hidden">Enable</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && syncEnabled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Scan with Mobile
              </h2>
              <button
                onClick={() => setShowQR(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-4 flex justify-center">
              <QRCode value={getMobileScanURL() || ""} size={200} />
            </div>

            {/* Instructions */}
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-600">
                <strong>How to use:</strong>
              </p>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Open camera app on your phone</li>
                <li>Scan this QR code</li>
                <li>Tap the link to open billing page in mobile mode</li>
                <li>Scan products - they'll appear here instantly!</li>
              </ol>
            </div>

            {/* Copy URL */}
            <div className="flex gap-2">
              <input
                type="text"
                value={getMobileScanURL() || ""}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
              />
              <button
                onClick={handleCopyURL}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Alternative sharing options */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> You can also copy the URL above and
                send it to your phone via WhatsApp, Email, or any messaging app.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
