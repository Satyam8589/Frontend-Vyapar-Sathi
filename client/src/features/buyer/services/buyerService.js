import { apiGet, apiPost, apiPut, apiDelete } from '@/servies/api';

/**
 * Buyer Service - Handles all buyer-related API calls
 */

export const getBuyers = async (storeId, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const qs = query.toString();
  const response = await apiGet(`/buyers/${storeId}${qs ? `?${qs}` : ''}`);
  return response.data; // { buyers, total, page, totalPages }
};

export const getBuyerStats = async (storeId) => {
  const response = await apiGet(`/buyers/${storeId}/stats`);
  return response.data;
};

export const getBuyerById = async (storeId, buyerId) => {
  const response = await apiGet(`/buyers/${storeId}/${buyerId}`);
  return response.data;
};

export const getBuyerPurchases = async (storeId, buyerId) => {
  const response = await apiGet(`/buyers/${storeId}/${buyerId}/purchases`);
  return response.data;
};

export const createBuyer = async (storeId, data) => {
  const response = await apiPost(`/buyers/${storeId}`, data);
  return response.data;
};

export const updateBuyer = async (storeId, buyerId, data) => {
  const response = await apiPut(`/buyers/${storeId}/${buyerId}`, data);
  return response.data;
};

export const deleteBuyer = async (storeId, buyerId) => {
  const response = await apiDelete(`/buyers/${storeId}/${buyerId}`);
  return response.data;
};

export const getBuyerSaleById = async (storeId, saleId) => {
  const response = await apiGet(`/buyers/${storeId}/sales/${saleId}`);
  return response.data;
};

export const updateBuyerSale = async (storeId, saleId, data) => {
  const response = await apiPut(`/buyers/${storeId}/sales/${saleId}`, data);
  return response.data;
};

export const deleteBuyerSale = async (storeId, saleId) => {
  const response = await apiDelete(`/buyers/${storeId}/sales/${saleId}`);
  return response.data;
};

export const sendBuyerSaleEmail = async (storeId, saleId, email) => {
  const response = await apiPost(`/buyers/${storeId}/sales/${saleId}/send-email`, { email });
  return response;
};
