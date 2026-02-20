"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { showSuccess, showError } from "@/utils/toast";

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

// Vibrate once briefly
const vibrate = () => {
  try {
    if (navigator.vibrate) navigator.vibrate(100);
  } catch {
    // Not supported — ignore
  }
};

const SCANNER_DIV_ID = "vyapar-barcode-reader-clean";

/**
 * BarcodeScanner
 *
 * Uses MediaStream ImageCapture API for native-quality photos.
 * Auto-detects barcodes continuously, extracts and auto-fills, NO gallery save.
 */
const BarcodeScanner = ({ onScan, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const imageCapture = useRef(null);
  const scannerRef = useRef(null); // Html5Qrcode instance
  const scanningIntervalRef = useRef(null);
  const lastScannedRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    console.log(
      "BarcodeScanner with ImageCapture API (Native Quality - No Gallery)",
    );
  }, []);

  // Initialize native-quality camera stream with ImageCapture API
  useEffect(() => {
    if (!mounted) return;

    const startCamera = async () => {
      try {
        // Load Html5Qrcode for barcode scanning
        const { Html5Qrcode } = await import("html5-qrcode");
        scannerRef.current = new Html5Qrcode(SCANNER_DIV_ID, {
          verbose: false,
        });

        // Request MAXIMUM resolution camera (native quality)
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 4096 }, // 4K width
            height: { ideal: 2160 }, // 4K height
            aspectRatio: { ideal: 16 / 9 },
          },
        };

        // Get high-resolution media stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // Create video element and attach stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Create ImageCapture instance for high-quality photo capture
        const videoTrack = stream.getVideoTracks()[0];

        // Check if ImageCapture API is supported
        if (typeof ImageCapture !== "undefined") {
          imageCapture.current = new ImageCapture(videoTrack);
          console.log("ImageCapture API ready - Native quality photos");
        }

        // Check torch/flash support
        const capabilities = videoTrack.getCapabilities();
        if (capabilities.torch) {
          setTorchSupported(true);
        }

        // Start auto-detection after camera is ready
        startAutoScanning();
      } catch (err) {
        console.error("Camera error:", err);
        if (
          err?.name === "NotAllowedError" ||
          err?.message?.toLowerCase().includes("permission")
        ) {
          setError(
            "Camera access denied. Please allow camera permission and try again.",
          );
        } else if (err?.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Could not start camera. Please try again.");
        }
      }
    };

    startCamera();

    return () => {
      stopCamera();
      stopAutoScanning();
    };
  }, [mounted]);

  const startAutoScanning = () => {
    // Scan every 1000ms for smoother performance
    scanningIntervalRef.current = setInterval(async () => {
      await autoScanBarcode();
    }, 1000);
  };

  const stopAutoScanning = () => {
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }
  };

  const autoScanBarcode = async () => {
    if (isProcessing || !videoRef.current || !scannerRef.current) return;

    setIsProcessing(true);

    try {
      let photoBlob;

      // Use ImageCapture API for native-quality photo (if available)
      if (imageCapture.current) {
        try {
          photoBlob = await imageCapture.current.takePhoto();
        } catch (imageCaptureError) {
          photoBlob = null;
        }
      }

      // Fallback: capture from video element
      if (!photoBlob && videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        photoBlob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/jpeg", 0.95);
        });
      }

      if (!photoBlob) {
        setIsProcessing(false);
        return;
      }

      // Convert blob to file for barcode scanning
      const file = new File([photoBlob], "capture.jpg", {
        type: "image/jpeg",
      });

      // Scan the high-quality photo for barcode
      const results = await scannerRef.current.scanFileV2(file, true);

      if (results?.decodedText) {
        // Prevent duplicate scans of the same barcode
        if (lastScannedRef.current === results.decodedText) {
          setIsProcessing(false);
          return;
        }

        lastScannedRef.current = results.decodedText;

        // Success! Auto-fill barcode
        playBeep();
        vibrate();
        showSuccess("Barcode detected!");
        onScan(results.decodedText);

        // Stop scanning after successful detection
        stopAutoScanning();

        // Reset last scanned after 3 seconds to allow rescanning
        setTimeout(() => {
          lastScannedRef.current = null;
        }, 3000);
      }
    } catch (err) {
      // Silently continue scanning on error
    } finally {
      setIsProcessing(false);
    }
  };

  const stopCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      imageCapture.current = null;
    } catch {}
  };

  const handleClose = () => {
    stopCamera();
    stopAutoScanning();
    onClose();
  };

  const handleTorchToggle = async () => {
    if (!streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities();

      if (capabilities.torch) {
        await videoTrack.applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      }
    } catch (err) {
      console.warn("Torch toggle failed:", err);
    }
  };

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      {/* Hidden scanner div (for html5-qrcode library) */}
      <div id={SCANNER_DIV_ID} className="hidden" />

      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-6 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={handleClose}
          className="pointer-events-auto p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all border border-white/10"
        >
          <svg
            className="h-6 w-6"
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

        <div className="flex gap-4 pointer-events-auto">
          {torchSupported && (
            <button
              type="button"
              onClick={handleTorchToggle}
              className={`p-3 rounded-full transition-all border border-white/10 backdrop-blur-md ${
                torchOn
                  ? "bg-yellow-400 text-yellow-900"
                  : "bg-black/40 text-white hover:bg-black/60"
              }`}
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2v11h3v9l7-12h-4l4-8z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="w-full h-full relative flex items-center justify-center bg-black">
        {error ? (
          <div className="flex flex-col items-center justify-center px-6 text-center gap-4">
            <div className="p-4 rounded-full bg-red-500/20">
              <svg
                className="h-10 w-10 text-red-500"
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
            <p className="text-white font-medium">{error}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Native-quality camera feed using ImageCapture API */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Viewfinder overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="relative w-80 h-48">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg shadow-sm" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg shadow-sm" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg shadow-sm" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg shadow-sm" />
              </div>
              <p className="mt-4 text-white/70 text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                Position barcode within frame
              </p>
              <div className="mt-2 flex items-center gap-2 text-green-400 text-xs font-medium bg-green-500/20 px-3 py-1 rounded-full">
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Native quality • No gallery save
              </div>
            </div>
          </>
        )}
      </div>

      {/* Auto-scanning Status Indicator */}
      {!error && (
        <div className="absolute bottom-0 left-0 right-0 py-10 flex flex-col items-center justify-center pointer-events-none bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center">
            {/* Scanning animation pulse */}
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-blue-500 animate-pulse" />
              <div className="absolute h-12 w-12 rounded-full bg-blue-500/50" />
              {/* Radar scan line effect */}
              <div className="absolute h-0.5 w-16 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
            </div>
          </div>
          <p className="mt-3 text-white text-sm font-medium flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Auto-scanning...
          </p>
          <p className="mt-1 text-white/30 text-[10px]">
            High-res capture • Auto-fills • No save
          </p>
        </div>
      )}
    </div>,
    document.body,
  );
};

export default BarcodeScanner;
