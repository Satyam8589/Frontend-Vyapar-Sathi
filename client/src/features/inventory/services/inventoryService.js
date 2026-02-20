import { apiPost, apiGet, apiPut, apiDelete } from '@/servies/api';

/**
 * Inventory Service - Handles product and stock related API calls
 */

// Create a new product
export const addProduct = async (productData) => {
  try {
    // End point provided by user: /product/add_product
    const response = await apiPost('/product/add_product', productData);
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
