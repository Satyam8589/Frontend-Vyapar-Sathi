import { apiGet, apiPost, apiPut, apiDelete } from '@/servies/api';

/**
 * Seller Service - Handles all seller-related API calls
 */

/**
 * Get all sellers for a store
 * @param {string} storeId
 * @param {{ search?: string, status?: string, page?: number, limit?: number }} params
 */
export const getSellers = async (storeId, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const qs = query.toString();
  const response = await apiGet(`/sellers/${storeId}${qs ? `?${qs}` : ''}`);
  return response.data; // { sellers, total, page, totalPages }
};

/**
 * Get seller stats for a store
 * @param {string} storeId
 */
export const getSellerStats = async (storeId) => {
  const response = await apiGet(`/sellers/${storeId}/stats`);
  return response.data;
};

/**
 * Get a single seller by ID
 * @param {string} storeId
 * @param {string} sellerId
 */
export const getSellerById = async (storeId, sellerId) => {
  const response = await apiGet(`/sellers/${storeId}/${sellerId}`);
  return response.data;
};

/**
 * Create a new seller
 * @param {string} storeId
 * @param {object} data
 */
export const createSeller = async (storeId, data) => {
  const response = await apiPost(`/sellers/${storeId}`, data);
  return response.data;
};

/**
 * Update an existing seller
 * @param {string} storeId
 * @param {string} sellerId
 * @param {object} data
 */
export const updateSeller = async (storeId, sellerId, data) => {
  const response = await apiPut(`/sellers/${storeId}/${sellerId}`, data);
  return response.data;
};

/**
 * Delete a seller
 * @param {string} storeId
 * @param {string} sellerId
 */
export const deleteSeller = async (storeId, sellerId) => {
  const response = await apiDelete(`/sellers/${storeId}/${sellerId}`);
  return response.data;
};

/**
 * Get seller purchases
 * @param {string} storeId
 * @param {string} sellerId
 * @param {object} params
 */
export const getSellerPurchases = async (storeId, sellerId, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.paymentStatus && params.paymentStatus !== 'all') query.set('paymentStatus', params.paymentStatus);
  if (params.returnStatus && params.returnStatus !== 'all') query.set('returnStatus', params.returnStatus);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);

  const qs = query.toString();
  const response = await apiGet(`/sellers/${storeId}/${sellerId}/purchases${qs ? `?${qs}` : ''}`);
  return response.data;
};

/**
 * Get seller purchase summary
 * @param {string} storeId
 * @param {string} sellerId
 */
export const getSellerPurchaseSummary = async (storeId, sellerId) => {
  const response = await apiGet(`/sellers/${storeId}/${sellerId}/purchase-summary`);
  return response.data;
};

/**
 * Get seller payments
 * @param {string} storeId
 * @param {string} sellerId
 * @param {object} params
 */
export const getSellerPayments = async (storeId, sellerId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);

  const qs = query.toString();
  const response = await apiGet(`/sellers/${storeId}/${sellerId}/payments${qs ? `?${qs}` : ''}`);
  return response.data;
};
