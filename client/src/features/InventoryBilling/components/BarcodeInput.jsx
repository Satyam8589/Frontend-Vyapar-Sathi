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
  const { loading, isMobile } = useBillingContext();
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleScanComplete = async (barcode) => {
    setScannerOpen(false);
    setScannedBarcode(barcode);
    await handleBarcodeInput(barcode);
  };

  // Mobile Scanning Mode - Beautiful Responsive Centered Design
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-8">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 sm:mb-4 shadow-lg">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Scan or Enter Barcode
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 px-2">
              Use your scanner device or camera to add products
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
            <input
              type="text"
              value={scannedBarcode}
              onChange={(e) => setScannedBarcode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scan or type barcode..."
              className="w-full px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl border-2 border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center font-mono tracking-wider"
              disabled={loading || isScanning}
              autoFocus
            />

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-5">
              <button
                onClick={() => setScannerOpen(true)}
                disabled={loading || isScanning}
                className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95 sm:transform sm:hover:-translate-y-0.5 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 font-semibold text-sm sm:text-base md:text-lg"
                title="Open Camera Scanner"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
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
                <span>Camera</span>
              </button>

              <button
                onClick={() => handleBarcodeInput(scannedBarcode)}
                disabled={loading || isScanning || !scannedBarcode}
                className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95 sm:transform sm:hover:-translate-y-0.5 font-semibold text-sm sm:text-base md:text-lg"
              >
                {isScanning ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                    <span className="hidden xs:inline">Adding...</span>
                    <span className="xs:hidden">...</span>
                  </span>
                ) : (
                  <span>Add Product</span>
                )}
              </button>
            </div>

            <div className="mt-3 sm:mt-4 md:mt-5 pt-3 sm:pt-4 border-t border-gray-100">
              <p className="text-xs sm:text-sm md:text-base text-center text-gray-500">
                💡 Scan barcode with device or tap Camera to use phone camera
              </p>
            </div>
          </div>

          {/* Camera Scanner Modal */}
          {scannerOpen && (
            <BarcodeScanner
              onScan={handleScanComplete}
              onClose={() => setScannerOpen(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // Desktop/Laptop Mode - Original Compact Design
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
