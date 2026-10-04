import axios from "axios";

export const getPurchaseOrders = async (storeId, filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await axios.get(`/api/purchase-orders/${storeId}?${query}`);
  return response.data;
};

export const getPurchaseOrderById = async (storeId, id) => {
  const response = await axios.get(`/api/purchase-orders/${storeId}/${id}`);
  return response.data;
};

export const createPurchaseOrder = async (storeId, poData) => {
  const response = await axios.post(`/api/purchase-orders/${storeId}`, poData);
  return response.data;
};

export const approvePurchaseOrder = async (storeId, id) => {
  const response = await axios.patch(`/api/purchase-orders/${storeId}/${id}/approve`);
  return response.data;
};

export const cancelPurchaseOrder = async (storeId, id) => {
  const response = await axios.patch(`/api/purchase-orders/${storeId}/${id}/cancel`);
  return response.data;
};

export const receivePurchaseOrderItems = async (storeId, id, receiveData) => {
  const response = await axios.post(`/api/purchase-orders/${storeId}/${id}/receive`, { receiveData });
  return response.data;
};
