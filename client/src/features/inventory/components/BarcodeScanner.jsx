"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

// Plays a short confirmation beep using the Web Audio API (no external dependency)
const playBeep = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch {
    // AudioContext not available — silent fallback
  }
};

// Vibrate once briefly (supported on Android Chrome)
const vibrate = () => {
  try {
    if (navigator.vibrate) navigator.vibrate(100);
  } catch {
    // Not supported — ignore
  }
};

const SCANNER_DIV_ID = "vyapar-barcode-reader";

/**
 * BarcodeScanner
 *
 * A camera-based barcode scanner modal using html5-qrcode.
 * Must be dynamically imported (no SSR) — see AddProductModal.jsx.
 *
 * Props:
 *  onScan(barcode: string) — called once when a barcode is decoded
 *  onClose()              — called when user dismisses the modal
 */
const BarcodeScanner = ({ onScan, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);       // camera permission / init errors
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  const scannerRef = useRef(null);   // Html5Qrcode instance
  const scannedRef = useRef(false);  // debounce — only fire onScan once

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialise scanner after mount
  useEffect(() => {
    if (!mounted) return;

    let html5QrCode;

    const startScanner = async () => {
      try {
        // Dynamically import so the module never runs during SSR
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

        html5QrCode = new Html5Qrcode(SCANNER_DIV_ID, { verbose: false });
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" }, // rear camera
          {
            fps: 10,
            qrbox: { width: 260, height: 120 },
            // Restrict to retail barcodes only — faster & no false QR positives
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.CODE_128,
            ],
            aspectRatio: 1.7,
          },
          (decodedText) => {
            // Debounce — ignore repeated fire for same scan
            if (scannedRef.current) return;
            scannedRef.current = true;

            playBeep();
            vibrate();

            stopScanner().then(() => {
              onScan(decodedText);
            });
          },
          () => {
            // Per-frame decode error — normal, suppress
          }
        );

        // Check if torch (flashlight) is available
        try {
          const capabilities = html5QrCode.getRunningTrackCameraCapabilities();
          if (capabilities?.torchFeature()?.isSupported()) {
            setTorchSupported(true);
          }
        } catch {
          // Torch capability API not available on this device
        }
      } catch (err) {
        if (
          err?.name === "NotAllowedError" ||
          err?.message?.toLowerCase().includes("permission")
        ) {
          setError("Camera access denied. Please allow camera permission and try again.");
        } else if (err?.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Could not start camera. Please try again.");
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState();
        // State 2 = SCANNING, only stop if active
        if (state === 2) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {
      // Already stopped — ignore
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const handleTorchToggle = async () => {
    try {
      const capabilities = scannerRef.current?.getRunningTrackCameraCapabilities();
      const torchFeature = capabilities?.torchFeature();
      if (!torchFeature?.isSupported()) return;

      if (torchOn) {
        await torchFeature.disable();
        setTorchOn(false);
      } else {
        await torchFeature.enable();
        setTorchOn(true);
      }
    } catch {
      // Torch toggle failed silently
    }
  };

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Scanner card */}
      <div className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800">
          <div>
            <h3 className="text-white font-bold text-base">Scan Barcode</h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Point camera at product barcode
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Torch toggle */}
            {torchSupported && (
              <button
                type="button"
                onClick={handleTorchToggle}
                title={torchOn ? "Turn torch off" : "Turn torch on"}
                className={`p-2 rounded-xl transition-colors ${
                  torchOn
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {/* Flashlight icon */}
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                </svg>
              </button>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
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
        </div>

        {/* Camera viewport */}
        <div className="relative bg-black">
          {error ? (
            /* Error state */
            <div className="flex flex-col items-center justify-center h-64 px-6 text-center gap-4">
              <div className="p-3 rounded-full bg-red-500/20">
                <svg
                  className="h-8 w-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-red-400 text-sm font-semibold">{error}</p>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 bg-slate-700 text-white rounded-xl text-sm font-bold hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* html5-qrcode mounts the video feed inside this div */}
              <div id={SCANNER_DIV_ID} className="w-full" />

              {/* Scan frame overlay — purely decorative guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-28">
                  {/* Corner brackets */}
                  {["top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
                    "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
                    "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
                    "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className={`absolute w-7 h-7 border-blue-400 ${cls}`}
                    />
                  ))}
                  {/* Animated scan line */}
                  <div className="absolute left-1 right-1 h-0.5 bg-blue-400/80 animate-scan-line rounded-full" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer hint */}
        {!error && (
          <div className="px-5 py-3 bg-slate-800 text-center">
            <p className="text-slate-400 text-xs">
              Supports EAN-13 · UPC-A · CODE-128
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BarcodeScanner;
