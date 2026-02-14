'use client';

import { useState, useCallback } from 'react';
import { createStore, validateStoreData } from '../services/storeService';

/**
 * Custom hook for creating a store
 * Can be used independently or alongside CreateStoreContext
 */
export const useCreateStore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCreateStore = useCallback(async (storeData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate data
      const validation = validateStoreData(storeData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Create store
      const response = await createStore(storeData);
      
      setSuccess(true);
      setLoading(false);
      
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err?.message || 'Failed to create store';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    createStore: handleCreateStore,
    loading,
    error,
    success,
    resetState
  };
};



/**
 * Custom hook for form validation
 */
export const useStoreValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = useCallback((storeData) => {
    const validation = validateStoreData(storeData);
    setErrors(validation.errors);
    return validation.isValid;
  }, []);

  const clearError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    clearError,
    clearAllErrors
  };
};

export default useCreateStore;
