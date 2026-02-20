import { apiPost, apiGet, apiPut, apiDelete } from "@/servies/api";

/**
 * Inventory Service - Handles product and stock related API calls
 */

// Create a new product
export const addProduct = async (productData) => {
  try {
    // End point provided by user: /product/add_product
    const response = await apiPost("/product/add_product", productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch products for a specific store
export const getStoreProducts = async (storeId) => {
  try {
    const response = await apiGet(`/product/all?storeId=${storeId}`);
    // Backend returns ApiResponse { data: products, ... }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a product
export const updateProduct = async (productId, updateData) => {
  try {
    const response = await apiPut(`/product/${productId}`, updateData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await apiDelete(`/product/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Resolve a barcode via the backend's multi-source resolver.
 * Uses the configured API client with interceptor settings.
 * Returns the normalized product object, or null on 404.
 *
 * @param {string} barcode
 * @returns {Promise<object|null>}
 */
export const resolveProductByBarcode = async (barcode) => {
  try {
    // apiGet already applies auth interceptors and response transformation
    const response = await apiGet(`/products/resolve/${barcode}`, {
      timeout: 30000, // external API chain can take up to ~15 s
    });
    // response is already { success, data } from the interceptor
    return response?.data ?? null;
  } catch (error) {
    if (error?.status === 404) return null;
    throw error;
  }
};

/**
 * Lookup a barcode in the internal MasterProduct database.
 * This is the fallback when external APIs return nothing.
 * Returns the product object, or null if not found.
 *
 * @param {string} barcode
 * @returns {Promise<object|null>}
 */
export const fetchFromMasterProduct = async (barcode) => {
  try {
    const response = await apiGet(`/products/master/${barcode}`);
    return response?.data ?? null;
  } catch (error) {
    // 404 means not in master DB either — that's fine, return null
    if (error?.status === 404 || error?.statusCode === 404) return null;
    // Any other error — swallow and treat as not found so manual fill shows
    return null;
  }
};

/**
 * Save a product to the MasterProduct database.
 * Only saves if the barcode doesn't already exist in MasterProduct.
 * This helps build a shared product catalog from user submissions.
 *
 * @param {object} productData - Product data to save (name, brand, category, barcode, image)
 * @returns {Promise<boolean>} - true if saved, false if already exists or error
 */
export const saveToMasterProduct = async (productData) => {
  try {
    // Only save if barcode is present
    if (!productData.barcode) return false;

    // Check if already exists in MasterProduct
    const existing = await fetchFromMasterProduct(productData.barcode);
    if (existing) return false; // Already in master DB, no need to save

    // Prepare payload - only save catalog data, not store-specific data
    const payload = {
      barcode: productData.barcode,
      name: productData.name,
      brand: productData.brand || "",
      category: productData.category || "General",
      image: productData.image || "",
    };

    await apiPost("/products/master", payload);
    return true;
  } catch (error) {
    // Silently fail - saving to MasterProduct is not critical
    console.warn("Failed to save to MasterProduct:", error);
    return false;
  }
};
