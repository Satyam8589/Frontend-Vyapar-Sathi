import { apiGet } from "@/servies/api";

const buildQueryString = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  if (!entries.length) return "";

  const searchParams = new URLSearchParams();
  entries.forEach(([key, value]) => searchParams.set(key, String(value)));
  return `?${searchParams.toString()}`;
};

export const fetchProductAnalytics = async (
  storeId,
  productId,
  params = {},
) => {
  const response = await apiGet(
    `/analytics/store/${storeId}/products/${productId}/overview${buildQueryString(params)}`,
  );
  return response;
};
