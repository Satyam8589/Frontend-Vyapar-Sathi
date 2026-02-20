"use client";

import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { showSuccess, showError, showInfo } from "@/utils/toast";

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
 * Implements a "Camera First" workflow:
 * 1. Shows live camera feed (preview only).
 * 2. User clicks "Capture".
 * 3. We grab the frame, freeze it, and try to decode a barcode from the image.
 */
const BarcodeScanner = ({ onScan, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const scannerRef = useRef(null);   // Html5Qrcode instance
  const Html5QrcodeRef = useRef(null); // The library class itself

  useEffect(() => {
    setMounted(true);
    console.log("BarcodeScanner Mounted: " + SCANNER_DIV_ID);
  }, []);

  // Initialise scanner after mount - Preview Mode Only
  useEffect(() => {
    if (!mounted) return;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        Html5QrcodeRef.current = Html5Qrcode;

        const html5QrCode = new Html5Qrcode(SCANNER_DIV_ID, { verbose: false });
        scannerRef.current = html5QrCode;

        // Configuration for the scanner
        const config = {
            fps: 30, // High FPS for smooth preview
            qrbox: { width: 260, height: 120 },
            aspectRatio: 1.7,
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
            }
        };

        const successCallback = (decodedText) => {
             // Preview Only Mode: We ignore real-time results.
             // The user MUST press the Capture button to scan.
             // If you enable Hybrid Auto-Scan later, uncomment below:
             /*
             playBeep();
             vibrate();
             onScan(decodedText);
             */
        };

        try {
            // Attempt 1: High Quality (1080p+)
            // This is crucial for "Capture First" mode to get a clear image
            await html5QrCode.start(
                { 
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    focusMode: "continuous" 
                }, 
                config, 
                successCallback, 
                () => {}
            );
        } catch (widthError) {
            console.warn("High-res camera failed, falling back to basic...", widthError);
            // Attempt 2: Basic Constraints (Driver default)
            await html5QrCode.start(
                { facingMode: "environment" }, 
                config, 
                successCallback, 
                () => {}
            );
        }

        // Check torch
        try {
          const capabilities = html5QrCode.getRunningTrackCameraCapabilities();
          if (capabilities?.torchFeature()?.isSupported()) {
            setTorchSupported(true);
          }
        } catch {}
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
  }, [mounted]);

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {}
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  /**
   * Capture the current frame and try to scan it
   */
  const handleCapture = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    vibrate();

    try {
        // 1. Find the video element created by html5-qrcode
        const videoElement = document.querySelector(`#${SCANNER_DIV_ID} video`);
        if (!videoElement) {
            throw new Error("Camera stream not ready");
        }

        // 2. Pause video to simulate "shutter capture"
        videoElement.pause();

        // 3. Draw current frame to a temporary canvas
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // 4. Convert canvas to File/Blob for scanning
        // We use the 'scanFile' API on a new instance or a static method if available, 
        // but since we have an active instance, we can't easily reuse it for file scan while it is "running" the camera.
        // Actually, html5-qrcode library supports passing an image file to a new instance.
        
        canvas.toBlob(async (blob) => {
            if (!blob) {
                setIsProcessing(false);
                videoElement.play();
                return;
            }

            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            
            // We need a separate instance or logic to scan this file. 
            // The running instance is busy with the camera stream.
            // However, since we paused the video, we can stop the camera, scan the file, and if fail restart camera.
            // OR: Calculate it purely client side if the library exposes a stateless scan function.
            // Html5Qrcode has a staticish method but usually requires an instance.
            
            // Let's optimize: We don't need to stop the camera completely if we can just use the storage-based scan.
            // But Html5Qrcode usually locks the element.
            // A safer, albeit slightly heavier way: 
            
            try {
                // We'll use a temporary hidden div for the file scanner to not interfere with the camera UI
                // But wait, we can't scan a file easily without an instance attached to a DOM element usually.
                // UNLESS we use the `Html5Qrcode` with a different element ID or the "BarcodeDetector" API directly if supported.
                
                // Let's try stopping the current scanner briefly to run the file scan.
                // It gives the specific "Capture" UX anyway.
                await scannerRef.current.stop();

                // Now scan the file
                const results = await scannerRef.current.scanFileV2(file, true);
                
                if (results && results.decodedText) {
                    playBeep();
                    onScan(results.decodedText);
                    // Don't restart, we interpret this as success and closing is handled by parent, 
                    // or parent keeps it open but we will be unmounted.
                } else {
                    throw new Error("No code found");
                }
            } catch (err) {
                console.warn("Scan failed", err);
                showInfo("No barcode detected in this image. Try getting closer.");
                
                // Restart camera preview
                // We need to re-initialize the start sequence
                // Quick hack: just triggering a re-render or re-calling start
                // But since we are inside the function, let's just manually restart.
                try {
                     await scannerRef.current.start(
                        { facingMode: "environment" }, 
                        { fps: 30, qrbox: { width: 260, height: 120 }, aspectRatio: 1.7 }, 
                        () => {}, 
                        () => {}
                     );
                     // Video element is recreated, so no need to .play()
                } catch (restartErr) {
                    setError("Camera failed to restart.");
                }
            } finally {
                setIsProcessing(false);
            }
        }, 'image/jpeg', 0.9);

    } catch (err) {
        console.error(err);
        setIsProcessing(false);
        showError("Capture failed. Please try again.");
    }
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      {/* Full screen simplified for camera feel */}

      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-6 flex items-center justify-between pointer-events-none">
        <button
            type="button"
            onClick={handleClose}
            className="pointer-events-auto p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all border border-white/10"
        >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="flex gap-4 pointer-events-auto">
            {torchSupported && (
              <button
                type="button"
                onClick={handleTorchToggle}
                className={`p-3 rounded-full transition-all border border-white/10 backdrop-blur-md ${
                  torchOn ? "bg-yellow-400 text-yellow-900" : "bg-black/40 text-white hover:bg-black/60"
                }`}
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                </svg>
              </button>
            )}
        </div>
      </div>

      {/* Camera Viewport Area */}
      <div className="w-full h-full relative flex items-center justify-center bg-black">
        {error ? (
           <div className="flex flex-col items-center justify-center px-6 text-center gap-4">
             <div className="p-4 rounded-full bg-red-500/20">
               <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <p className="text-white font-medium">{error}</p>
             <button onClick={handleClose} className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold">Close</button>
           </div>
        ) : (
            <>
                <div id={SCANNER_DIV_ID} className="w-full h-full object-cover" />
                
                {/* HUD Overlay - simplified since we are not real-time detecting */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Focus Brackets - Clean corners only */}
                    <div className="relative w-80 h-48">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg shadow-sm" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg shadow-sm" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg shadow-sm" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg shadow-sm" />
                    </div>
                    <p className="mt-4 text-white/70 text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                        Position code within frame
                    </p>
                </div>
            </>
        )}
      </div>

      {/* Footer / Shutter Button */}
      {!error && (
          <div className="absolute bottom-0 left-0 right-0 py-10 flex items-center justify-center pointer-events-auto bg-gradient-to-t from-black/80 to-transparent">
            {/* Shutter Button */}
            <button
                onClick={handleCapture}
                disabled={isProcessing}
                className="group relative flex items-center justify-center active:scale-95 transition-transform"
            >
                {/* Outer Ring */}
                <div className={`h-20 w-20 rounded-full border-4 transition-all duration-200 ${
                    isProcessing ? "border-blue-500 animate-pulse" : "border-white"
                }`} />
                
                {/* Inner Circle */}
                <div className={`absolute h-16 w-16 rounded-full transition-all duration-200 ${
                    isProcessing ? "bg-blue-500 scale-75" : "bg-white group-hover:bg-gray-100"
                }`} />
            </button>
            <p className="absolute bottom-4 text-white/50 text-xs font-medium">
                {isProcessing ? "Processing..." : "Tap to capture"}
            </p>
          </div>
      )}
    </div>,
    document.body
  );
};

export default BarcodeScanner;
