import { apiGet } from "@/servies/api";

const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "");

  if (!entries.length) {
    return "";
  }

  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  return `?${searchParams.toString()}`;
};

const fetchAnalytics = async (path, params = {}) => {
  const response = await apiGet(`${path}${buildQueryString(params)}`);
  return response;
};

export const fetchStoreAnalyticsSummary = async (storeId, params = {}) => {
  return fetchAnalytics(`/analytics/store/${storeId}/summary`, params);
};

export const fetchStoreAnalyticsTrend = async (storeId, params = {}) => {
  return fetchAnalytics(`/analytics/store/${storeId}/trends`, params);
};

export const fetchStoreCategoryAnalytics = async (storeId, params = {}) => {
  return fetchAnalytics(`/analytics/store/${storeId}/categories`, params);
};

export const fetchTopProductsAnalytics = async (storeId, params = {}) => {
  return fetchAnalytics(`/analytics/store/${storeId}/products/top`, params);
};

export const fetchSlowMovingProductsAnalytics = async (storeId, params = {}) => {
  return fetchAnalytics(`/analytics/store/${storeId}/products/slow-moving`, params);
};

export const fetchProductAnalyticsOverview = async (storeId, productId, params = {}) => {
  return fetchAnalytics(`/analytics/store/${storeId}/products/${productId}/overview`, params);
};
