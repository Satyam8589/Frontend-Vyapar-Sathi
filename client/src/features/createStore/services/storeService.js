import { apiPost } from '@/servies/api';

/**
 * Create Store Service - Handles store creation API calls
 */

// Create a new store
export const createStore = async (storeData) => {
  try {
    const response = await apiPost('/store/create', storeData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Validate store data before submission
 */
export const validateStoreData = (storeData) => {
  const errors = {};

  // Validate name
  if (!storeData.name?.trim()) {
    errors.name = 'Store name is required';
  } else if (storeData.name.length > 100) {
    errors.name = 'Store name cannot exceed 100 characters';
  }

  // Validate phone
  if (!storeData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[0-9]{10}$/.test(storeData.phone)) {
    errors.phone = 'Please provide a valid 10-digit phone number';
  }

  // Validate email (if provided)
  if (storeData.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(storeData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Validate address
  if (!storeData.address?.fullAddress?.trim()) {
    errors.fullAddress = 'Full address is required';
  }

  // Validate description length
  if (storeData.description && storeData.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
