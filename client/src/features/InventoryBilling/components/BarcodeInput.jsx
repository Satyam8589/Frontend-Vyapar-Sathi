"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useBarcodeScanner } from "../hooks";
import { useBillingContext } from "../context/billingContext";

// Dynamically import BarcodeScanner — html5-qrcode accesses browser APIs
const BarcodeScanner = dynamic(
  () => import("@/features/inventory/components/BarcodeScanner"),
  { ssr: false },
);

export const BarcodeInput = () => {
  const {
    scannedBarcode,
    setScannedBarcode,
    handleBarcodeInput,
    handleKeyPress,
    isScanning,
  } = useBarcodeScanner();
  const { loading } = useBillingContext();
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleScanComplete = async (barcode) => {
    setScannerOpen(false);
    setScannedBarcode(barcode);
    await handleBarcodeInput(barcode);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
        Scan or Enter Barcode
      </h2>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        <input
          type="text"
          value={scannedBarcode}
          onChange={(e) => setScannedBarcode(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Scan barcode or enter manually..."
          className="flex-1 px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          disabled={loading || isScanning}
          autoFocus
        />

        <div className="flex gap-2 md:gap-3">
          <button
            onClick={() => setScannerOpen(true)}
            disabled={loading || isScanning}
            className="flex-1 sm:flex-initial px-3 md:px-4 py-2.5 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            title="Open Camera Scanner"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="sm:hidden">Scan</span>
            <span className="hidden sm:inline">Camera</span>
          </button>

          <button
            onClick={() => handleBarcodeInput(scannedBarcode)}
            disabled={loading || isScanning || !scannedBarcode}
            className="flex-1 sm:flex-initial px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm md:text-base font-medium"
          >
            {isScanning ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      <p className="text-xs md:text-sm text-gray-500 mt-2">
        Use camera scanner, type manually, or use barcode scanner device
      </p>

      {/* Camera Scanner Modal */}
      {scannerOpen && (
        <BarcodeScanner
          onScan={handleScanComplete}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
};
