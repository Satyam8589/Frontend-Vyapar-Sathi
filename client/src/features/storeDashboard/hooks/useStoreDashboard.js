'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchAllStores } from '../services/storeDashboardService';
import { filterStores, sortStores } from '../utils/helpers';

/**
 * Custom hook for managing store dashboard
 */
export const useStoreDashboard = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    businessType: 'all',
    sortBy: 'created-desc'
  });

  /**
   * Fetch all stores
   */
  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchAllStores();
      const storesData = response?.data || [];
      
      setStores(storesData);
      setFilteredStores(storesData);
      setLoading(false);
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch stores';
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  /**
   * Apply filters and sorting
   */
  const applyFilters = useCallback(() => {
    let result = filterStores(stores, filters);
    result = sortStores(result, filters.sortBy);
    setFilteredStores(result);
  }, [stores, filters]);

  // Apply filters when stores or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
    fetchStores();
  }, [fetchStores]);

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
