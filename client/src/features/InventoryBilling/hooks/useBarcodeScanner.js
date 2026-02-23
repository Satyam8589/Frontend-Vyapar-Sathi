import { useState, useCallback } from "react";
import { useBillingContext } from "../context/billingContext";

/**
 * Custom hook for barcode scanning logic
 */
export const useBarcodeScanner = () => {
  const { addProductByBarcode, scannedBarcode, setScannedBarcode } =
    useBillingContext();
  const [isScanning, setIsScanning] = useState(false);

  const handleBarcodeInput = useCallback(
    async (barcode) => {
      if (!barcode || barcode.trim() === "") return;

      setIsScanning(true);

      try {
        const success = await addProductByBarcode(barcode.trim());

        if (success) {
          setScannedBarcode("");
        }
      } catch (error) {
        console.error("Barcode scan error:", error);
        // Error already handled by addProductByBarcode
      } finally {
        setIsScanning(false);
      }
    },
    [addProductByBarcode, setScannedBarcode],
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleBarcodeInput(scannedBarcode);
      }
    },
    [scannedBarcode, handleBarcodeInput],
  );

  return {
    scannedBarcode,
    setScannedBarcode,
    handleBarcodeInput,
    handleKeyPress,
    isScanning,
  };
};
