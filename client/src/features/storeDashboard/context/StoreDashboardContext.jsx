'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchAllStores } from '../services/storeDashboardService';
import { filterStores, sortStores } from '../utils/helpers';
import { VIEW_MODES } from '../constants';
import { showError } from '@/utils/toast';

// Create Context
const StoreDashboardContext = createContext(undefined);

// Initial state
const initialFilters = {
  search: '',
  businessType: 'all',
  sortBy: 'created-desc'
};

// Provider Component
export const StoreDashboardProvider = ({ children }) => {
  // Store state
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [selectedStore, setSelectedStore] = useState(null);

  /**
   * Apply filters and sorting
   */
  const applyFiltersAndSort = useCallback((storeList, currentFilters) => {
    let result = filterStores(storeList, currentFilters);
    result = sortStores(result, currentFilters.sortBy);
    setFilteredStores(result);
  }, []);

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
      applyFiltersAndSort(storesData, filters);
      setLoading(false);
      
      return { success: true, data: storesData };
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch stores';
      setError(errorMessage);
      showError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [applyFiltersAndSort, filters]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      applyFiltersAndSort(stores, updated);
      return updated;
    });
  }, [stores, applyFiltersAndSort]);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    applyFiltersAndSort(stores, initialFilters);
  }, [stores, applyFiltersAndSort]);

  /**
   * Toggle view mode
   */
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => 
      prev === VIEW_MODES.GRID ? VIEW_MODES.LIST : VIEW_MODES.GRID
    );
  }, []);

  /**
   * Select a store
   */
  const selectStore = useCallback((store) => {
    setSelectedStore(store);
  }, []);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedStore(null);
  }, []);

  /**
   * Refresh stores
   */
  const refreshStores = useCallback(() => {
    return fetchStores();
  }, [fetchStores]);

  const value = {
    // Data
    stores: filteredStores,
    allStores: stores,
    selectedStore,
    
    // State
    loading,
    error,
    filters,
    viewMode,
    
    // Actions
    fetchStores,
    updateFilters,
    resetFilters,
    toggleViewMode,
    selectStore,
    clearSelection,
    refreshStores,
  };

  return (
    <StoreDashboardContext.Provider value={value}>
      {children}
    </StoreDashboardContext.Provider>
  );
};

// Custom hook to use the context
export const useStoreDashboardContext = () => {
  const context = useContext(StoreDashboardContext);
  if (context === undefined) {
    throw new Error('useStoreDashboardContext must be used within StoreDashboardProvider');
  }
  return context;
};

export default StoreDashboardContext;
