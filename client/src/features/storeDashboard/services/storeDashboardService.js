import { apiGet, apiDelete } from '@/servies/api';

/**
 * Store Dashboard Service - Handles store fetching and management API calls
 */

/**
 * Fetch all stores for the current user
 */
export const fetchAllStores = async () => {
  try {
    const response = await apiGet('/store/all');
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch a single store by ID
 */
export const fetchStoreById = async (storeId) => {
  try {
    const response = await apiGet(`/store/${storeId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a store
 */
export const deleteStore = async (storeId) => {
  try {
    const response = await apiDelete(`/store/${storeId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
