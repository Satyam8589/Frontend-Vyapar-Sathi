import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchStoreById } from "@/features/storeDashboard/services/storeDashboardService";
import { RANGE_OPTIONS } from "../constants";
import { createDateRange } from "../utils";
import { fetchProductAnalytics } from "../services/productAnalyticsService";

const getErrorMessage = (error) =>
  error?.message || "Unable to load product analytics right now.";

const useProductAnalytics = (storeId, productId) => {
  const [rangeDays, setRangeDays] = useState(30);
  const [page, setPage] = useState(1);
  const [store, setStore] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rangeQuery = useMemo(() => createDateRange(rangeDays), [rangeDays]);

  const load = useCallback(async () => {
    if (!storeId || !productId) return;

    setLoading(true);
    setError("");

    try {
      const [storeResponse, overviewResponse] = await Promise.all([
        fetchStoreById(storeId),
        fetchProductAnalytics(storeId, productId, {
          ...rangeQuery,
          page,
          limit: 8,
        }),
      ]);

      setStore(storeResponse?.data || null);
      setOverview(overviewResponse?.data || null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [page, productId, rangeQuery, storeId]);

  useEffect(() => {
    load();
  }, [load]);

  const changeRange = (value) => {
    setRangeDays(value);
    setPage(1);
  };

  return {
    rangeDays,
    rangeOptions: RANGE_OPTIONS,
    setRangeDays: changeRange,
    page,
    setPage,
    store,
    overview,
    loading,
    error,
    refresh: load,
  };
};

export default useProductAnalytics;
