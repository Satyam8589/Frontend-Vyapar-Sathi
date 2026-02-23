import { useState, useCallback } from "react";
import { useBillingContext } from "../context/billingContext";

/**
 * Custom hook for managing manual product addition
 */
export const useManualProductAdd = () => {
  const { storeProducts, addProductManually } = useBillingContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter products based on search
  const filteredProducts = storeProducts.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm),
  );

  const handleAddProduct = useCallback(() => {
    if (!selectedProduct) return;

    const success = addProductManually(selectedProduct, quantity);

    if (success) {
      setSelectedProduct(null);
      setQuantity(1);
      setSearchTerm("");
      setIsModalOpen(false);
    }
  }, [selectedProduct, quantity, addProductManually]);

  return {
    searchTerm,
    setSearchTerm,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    isModalOpen,
    setIsModalOpen,
    filteredProducts,
    handleAddProduct,
  };
};
