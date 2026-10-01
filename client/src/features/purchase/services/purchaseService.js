import { apiGet, apiPost, apiPut, apiDelete } from '@/servies/api';

/**
 * Purchase Service - Handles all purchase-related API calls
 */

/**
 * Get all purchases for a store
 * @param {string} storeId
 * @param {{ search?: string, startDate?: string, endDate?: string, seller?: string, paymentStatus?: string, page?: number, limit?: number }} params
 */
export const getPurchases = async (storeId, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.seller) query.set('seller', params.seller);
  if (params.paymentStatus && params.paymentStatus !== 'all') query.set('paymentStatus', params.paymentStatus);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const qs = query.toString();
  const response = await apiGet(`/purchases/${storeId}${qs ? `?${qs}` : ''}`);
  return response.data; // { purchases, total, page, totalPages }
};

export const getPurchaseById = async (storeId, purchaseId) => {
  const response = await apiGet(`/purchases/${storeId}/${purchaseId}`);
  return response.data;
};

export const createPurchase = async (storeId, data) => {
  const response = await apiPost(`/purchases/${storeId}`, data);
  return response.data;
};

export const updatePurchase = async (storeId, purchaseId, data) => {
  const response = await apiPut(`/purchases/${storeId}/${purchaseId}`, data);
  return response.data;
};

export const deletePurchase = async (storeId, purchaseId) => {
  const response = await apiDelete(`/purchases/${storeId}/${purchaseId}`);
  return response.data;
};
