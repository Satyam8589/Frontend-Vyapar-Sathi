import api from "@/servies/api";

export const getPurchaseOrders = async (storeId, filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/purchase-orders/${storeId}?${query}`);
  return response;
};

export const getPurchaseOrderById = async (storeId, id) => {
  const response = await api.get(`/purchase-orders/${storeId}/${id}`);
  return response;
};

export const createPurchaseOrder = async (storeId, poData) => {
  const response = await api.post(`/purchase-orders/${storeId}`, poData);
  return response;
};

export const approvePurchaseOrder = async (storeId, id) => {
  const response = await api.patch(`/purchase-orders/${storeId}/${id}/approve`);
  return response;
};

export const cancelPurchaseOrder = async (storeId, id) => {
  const response = await api.patch(`/purchase-orders/${storeId}/${id}/cancel`);
  return response;
};

export const receivePurchaseOrderItems = async (storeId, id, receiveData) => {
  const response = await api.post(`/purchase-orders/${storeId}/${id}/receive`, { receiveData });
  return response;
};
