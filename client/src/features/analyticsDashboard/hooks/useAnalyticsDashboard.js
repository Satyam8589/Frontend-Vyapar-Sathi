'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchStoreById } from '@/features/storeDashboard/services/storeDashboardService';
import {
  fetchStoreAnalyticsSummary,
  fetchStoreAnalyticsTrend,
  fetchStoreCategoryAnalytics,
  fetchTopProductsAnalytics,
  fetchSlowMovingProductsAnalytics,
  fetchProductAnalyticsOverview,
} from '../services/analyticsDashboardService';

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const createRange = (rangeDays) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (Number(rangeDays) - 1));

  return {
    startDate: formatLocalDate(startDate),
    endDate: formatLocalDate(endDate),
  };
};

const emptyErrors = {
  store: '',
  summary: '',
  trend: '',
  categories: '',
  topProducts: '',
  slowMoving: '',
  productOverview: '',
};

const emptyLoading = {
  store: true,
  summary: true,
  trend: true,
  categories: true,
  topProducts: true,
  slowMoving: true,
  productOverview: true,
};

const unwrapMessage = (error, fallback) => error?.message || error?.error || fallback;

export const useAnalyticsDashboard = (storeId) => {
  const [store, setStore] = useState(null);
  const [rangeDays, setRangeDays] = useState('30');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [categories, setCategories] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [slowMoving, setSlowMoving] = useState([]);
  const [productOverview, setProductOverview] = useState(null);
  const [loading, setLoading] = useState(emptyLoading);
  const [error, setError] = useState(emptyErrors);

  const rangeQuery = useMemo(() => createRange(rangeDays), [rangeDays]);

  const loadDashboard = useCallback(async () => {
    if (!storeId) {
      return;
    }

    setLoading(emptyLoading);
    setError(emptyErrors);

    const params = { ...rangeQuery };

    const [storeResult, summaryResult, trendResult, categoriesResult, topProductsResult, slowMovingResult] =
      await Promise.allSettled([
        fetchStoreById(storeId),
        fetchStoreAnalyticsSummary(storeId, params),
        fetchStoreAnalyticsTrend(storeId, params),
        fetchStoreCategoryAnalytics(storeId, params),
        fetchTopProductsAnalytics(storeId, { ...params, limit: 8, sortBy: 'revenue' }),
        fetchSlowMovingProductsAnalytics(storeId, { inactivityDays: Number(rangeDays) >= 90 ? 45 : 30, limit: 8 }),
      ]);

    if (storeResult.status === 'fulfilled') {
      setStore(storeResult.value?.data || null);
    } else {
      setError((prev) => ({
        ...prev,
        store: unwrapMessage(storeResult.reason, 'Failed to load store details'),
      }));
    }

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value?.data || null);
    } else {
      setError((prev) => ({
        ...prev,
        summary: unwrapMessage(summaryResult.reason, 'Failed to load summary'),
      }));
    }

    if (trendResult.status === 'fulfilled') {
      setTrend(trendResult.value?.data || null);
    } else {
      setError((prev) => ({
        ...prev,
        trend: unwrapMessage(trendResult.reason, 'Failed to load trend data'),
      }));
    }

    if (categoriesResult.status === 'fulfilled') {
      setCategories(categoriesResult.value?.data || null);
    } else {
      setError((prev) => ({
        ...prev,
        categories: unwrapMessage(categoriesResult.reason, 'Failed to load categories'),
      }));
    }

    if (topProductsResult.status === 'fulfilled') {
      const rows = topProductsResult.value?.data?.rows || [];
      setTopProducts(rows);
      setSelectedProductId((current) => current || rows[0]?._id || rows[0]?.productId || '');
    } else {
      setError((prev) => ({
        ...prev,
        topProducts: unwrapMessage(topProductsResult.reason, 'Failed to load top products'),
      }));
    }

    if (slowMovingResult.status === 'fulfilled') {
      setSlowMoving(slowMovingResult.value?.data?.rows || []);
    } else {
      setError((prev) => ({
        ...prev,
        slowMoving: unwrapMessage(slowMovingResult.reason, 'Failed to load slow-moving products'),
      }));
    }

    setLoading((prev) => ({
      ...prev,
      store: false,
      summary: false,
      trend: false,
      categories: false,
      topProducts: false,
      slowMoving: false,
    }));
  }, [rangeQuery, rangeDays, storeId]);

  const loadProductOverview = useCallback(async () => {
    if (!storeId || !selectedProductId) {
      setProductOverview(null);
      setLoading((prev) => ({ ...prev, productOverview: false }));
      return;
    }

    setLoading((prev) => ({ ...prev, productOverview: true }));
    setError((prev) => ({ ...prev, productOverview: '' }));

    try {
      const response = await fetchProductAnalyticsOverview(storeId, selectedProductId, rangeQuery);
      setProductOverview(response?.data || null);
    } catch (error) {
      setError((prev) => ({
        ...prev,
        productOverview: unwrapMessage(error, 'Failed to load product overview'),
      }));
    } finally {
      setLoading((prev) => ({ ...prev, productOverview: false }));
    }
  }, [rangeQuery, selectedProductId, storeId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadProductOverview();
  }, [loadProductOverview]);

  const refresh = useCallback(() => {
    loadDashboard();
  }, [loadDashboard]);

  const selectedProduct = useMemo(() => {
    return topProducts.find((item) => String(item._id || item.productId) === String(selectedProductId)) || null;
  }, [selectedProductId, topProducts]);

  return {
    store,
    rangeDays,
    setRangeDays,
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
    summary,
    trend,
    categories,
    topProducts,
    slowMoving,
    productOverview,
    loading,
    error,
    refresh,
  };
};

export default useAnalyticsDashboard;
