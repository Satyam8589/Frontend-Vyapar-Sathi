'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import * as inventoryService from '../services/inventoryService';
import { fetchStoreById } from '@/features/storeDashboard/services/storeDashboardService';
import { showSuccess, showError } from '@/utils/toast';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const { user } = useAuthContext();
  const params = useParams();
  const storeId = params.storeId;

  const [products, setProducts] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch store details
  const fetchStoreDetails = useCallback(async () => {
    if (!storeId) return;
    try {
      const response = await fetchStoreById(storeId);
      // Backend returns ApiResponse { data: store, ... }
      setCurrentStore(response.data);
    } catch (err) {
      console.error('STORE_FETCH_ERROR:', err);
    }
  }, [storeId]);

  // Fetch products for the current store
  const fetchProducts = useCallback(async () => {
    if (!storeId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getStoreProducts(storeId);
      setProducts(data || []);
    } catch (err) {
      const msg = err?.message || err?.error || 'Failed to fetch products';
      setError(msg);
      showError(msg);
      console.error('INVENTORY_FETCH_ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  // Initial fetch
  useEffect(() => {
    fetchStoreDetails();
    fetchProducts();
  }, [fetchStoreDetails, fetchProducts]);

  // Add a new product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare data for backend as per user's snippet requirement
      const payload = {
        ...productData,
        store: storeId,
        createdBy: user?.uid, // Using Firebase UID as reference
      };

      const newProduct = await inventoryService.addProduct(payload);
      
      // Update local products state
      setProducts(prev => [newProduct, ...prev]);

      // Synchronize currentStore local stats
      if (currentStore) {
        const productValue = (newProduct.price || 0) * (newProduct.quantity || newProduct.qty || 0);
        setCurrentStore(prev => ({
          ...prev,
          totalProducts: (prev.totalProducts || 0) + 1,
          totalInventoryValue: (prev.totalInventoryValue || 0) + productValue
        }));
      }

      showSuccess(`Product "${productData.name}" added successfully!`);
      return { success: true, data: newProduct };
    } catch (err) {
      const errorMessage = err?.message || 'Failed to add product';
      setError(errorMessage);
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update a product
  const updateProduct = async (productId, updateData) => {
    try {
      setLoading(true);
      const updatedProduct = await inventoryService.updateProduct(productId, updateData);
      setProducts(prev => prev.map(p => p._id === productId ? updatedProduct : p));
      showSuccess('Product updated successfully!');
      return { success: true };
    } catch (err) {
      const errorMessage = err?.message || 'Failed to update product';
      setError(errorMessage);
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      // Get the product snapshot to update store stats locally
      const productToDelete = products.find(p => p._id === productId);
      const productValue = (productToDelete?.price || 0) * (productToDelete?.quantity || productToDelete?.qty || 0);

      await inventoryService.deleteProduct(productId);
      
      setProducts(prev => prev.filter(p => p._id !== productId));

      // Synchronize currentStore local stats
      if (currentStore) {
        setCurrentStore(prev => ({
          ...prev,
          totalProducts: Math.max(0, (prev.totalProducts || 1) - 1),
          totalInventoryValue: Math.max(0, (prev.totalInventoryValue || productValue) - productValue)
        }));
      }

      showSuccess('Product deleted successfully!');
      return { success: true };
    } catch (err) {
      const errorMessage = err?.message || 'Failed to delete product';
      setError(errorMessage);
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    currentStore,
    loading,
    error,
    storeId,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
};
