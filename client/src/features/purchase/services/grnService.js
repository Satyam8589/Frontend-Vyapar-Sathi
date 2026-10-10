import api from "@/servies/api";

export const getGRNs = async (storeId, filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await api.get(`/grns/${storeId}?${query}`);
  return response;
};

export const getGRNById = async (storeId, id) => {
  const response = await api.get(`/grns/${storeId}/${id}`);
  return response;
};
