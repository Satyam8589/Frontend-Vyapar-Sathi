import { apiGet } from "@/servies/api";

export const fetchForecast = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/forecast`);
  return response?.data || [];
};

export const fetchRestockPlan = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/restock`);
  return response?.data || [];
};

export const fetchInsights = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/insights`);
  return response?.data || [];
};

export const fetchProductInsight = async (storeId, productId) => {
  const response = await apiGet(`/ai/${storeId}/product/${productId}`);
  return response?.data || null;
};
