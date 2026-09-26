import { useState, useCallback, useEffect, useRef } from "react";
import { useBillingContext } from "../context/billingContext";
import { searchProductInStore } from "../services/billingService";
import { isOnline } from "../utils/db";

const productMatchesQuery = (product, query) =>
  [product.name, product.barcode, product.sku].some((value) =>
    String(value || "").toLowerCase().includes(query),
  );

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
  const searchCache = useRef(new Map());
  const cacheStoreId = useRef(storeId);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const query = searchTerm.trim();
    const normalizedQuery = query.toLowerCase();
    const currentRequest = ++requestId.current;

    if (cacheStoreId.current !== storeId) {
      searchCache.current.clear();
      cacheStoreId.current = storeId;
    }

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return undefined;
    }

    if (!isOnline()) {
      const results = storeProducts.filter((product) =>
        productMatchesQuery(product, normalizedQuery),
      );
      searchCache.current.set(normalizedQuery, results);
      setSearchResults(results);
      setIsSearching(false);
      return undefined;
    }

    const exactCachedResults = searchCache.current.get(normalizedQuery);
    if (exactCachedResults) {
      setSearchResults(exactCachedResults);
      setIsSearching(false);
      return undefined;
    }

    const cachedPrefix = [...searchCache.current.keys()]
      .filter((cachedQuery) => normalizedQuery.startsWith(cachedQuery))
      .sort((first, second) => second.length - first.length)[0];

    if (cachedPrefix) {
      const results = searchCache.current
        .get(cachedPrefix)
        .filter((product) => productMatchesQuery(product, normalizedQuery));
      searchCache.current.set(normalizedQuery, results);
      setSearchResults(results);
      setIsSearching(false);
      return undefined;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const products = await searchProductInStore(query, storeId);
        if (currentRequest === requestId.current) {
          const results = products || [];
          searchCache.current.set(normalizedQuery, results);
          setSearchResults(results);
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
