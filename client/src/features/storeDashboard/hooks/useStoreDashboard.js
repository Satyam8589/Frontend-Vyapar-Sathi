'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { fetchAllStores } from '../services/storeDashboardService';
import { filterStores, sortStores } from '../utils/helpers';

/**
 * Custom hook for managing store dashboard
 */
export const useStoreDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    businessType: 'all',
    sortBy: 'created-desc'
  });

  /**
   * Load stores from API
   */
  const loadStores = useCallback(async () => {
    try {
      const response = await fetchAllStores();
      const storesData = response?.data || [];
      
      setStores(storesData);
      setError(null);
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch stores';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all stores
   */
  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    await loadStores();
  }, [loadStores]);

  const filteredStores = useMemo(() => {
    let result = filterStores(stores, filters);
    return sortStores(result, filters.sortBy);
  }, [stores, filters]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      businessType: 'all',
      sortBy: 'created-desc'
    });
  }, []);

  /**
   * Refresh stores
   */
  const refreshStores = useCallback(() => {
    fetchStores();
  }, [fetchStores]);

  // Fetch stores on mount
  useEffect(() => {
    loadStores();
  }, [loadStores]);

  return {
    stores: filteredStores,
    allStores: stores,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refreshStores,
    fetchStores
  };
};

export default useStoreDashboard;
