import axios from "axios";

export const getGRNs = async (storeId, filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await axios.get(`/api/grns/${storeId}?${query}`);
  return response.data;
};

export const getGRNById = async (storeId, id) => {
  const response = await axios.get(`/api/grns/${storeId}/${id}`);
  return response.data;
};
