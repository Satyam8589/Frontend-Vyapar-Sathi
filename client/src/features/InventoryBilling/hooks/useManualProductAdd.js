import { useState, useCallback, useEffect, useRef } from "react";
import { useBillingContext } from "../context/billingContext";
import { searchProductInStore } from "../services/billingService";
import { isOnline } from "../utils/db";

/**
 * Custom hook for managing manual product addition
 */
export const useManualProductAdd = () => {
  const {
    storeProducts,
    storeId,
    addProductManually,
    manualProductOpen,
    setManualProductOpen,
  } = useBillingContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const requestId = useRef(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const query = searchTerm.trim();
    const currentRequest = ++requestId.current;

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return undefined;
    }

    if (!isOnline()) {
      const normalizedQuery = query.toLowerCase();
      setSearchResults(
        storeProducts.filter((product) =>
          [product.name, product.barcode, product.sku].some((value) =>
            value?.toLowerCase().includes(normalizedQuery),
          ),
        ),
      );
      setIsSearching(false);
      return undefined;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const products = await searchProductInStore(query, storeId);
        if (currentRequest === requestId.current) {
          setSearchResults(products || []);
        }
      } catch (error) {
        if (currentRequest === requestId.current) {
          setSearchResults([]);
        }
        console.error("PRODUCT_SEARCH_ERROR:", error);
      } finally {
        if (currentRequest === requestId.current) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, storeId, storeProducts]);

  const handleAddProduct = useCallback(() => {
    if (!selectedProduct) return;

    const success = addProductManually(selectedProduct, quantity);

    if (success) {
      setSelectedProduct(null);
      setQuantity(1);
      setSearchTerm("");
      setManualProductOpen(false);
    }
  }, [selectedProduct, quantity, addProductManually, setManualProductOpen]);

  const addProduct = useCallback(
    (product) => {
      if (addProductManually(product, 1)) {
        setSearchTerm("");
        setSelectedProduct(null);
      }
    },
    [addProductManually],
  );

  return {
    searchTerm,
    setSearchTerm,
    selectedProduct,
    setSelectedProduct,
    quantity,
    setQuantity,
    isModalOpen: manualProductOpen,
    setIsModalOpen: setManualProductOpen,
    filteredProducts: searchResults,
    searchResults,
    isSearching,
    addProduct,
    handleAddProduct,
  };
};
