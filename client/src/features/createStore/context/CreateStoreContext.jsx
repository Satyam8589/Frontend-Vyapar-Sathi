'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { createStore, validateStoreData } from '../services/storeService';
import { showSuccess, showError, showWarning } from '@/utils/toast';

// Create Context
const CreateStoreContext = createContext(undefined);

// Initial form state
const initialFormState = {
  name: '',
  phone: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    fullAddress: ''
  },
  businessType: 'retail',
  settings: {
    lowStockThreshold: 10,
    expiryAlertDays: 7,
    currency: 'INR'
  },
  description: '',
  logo: ''
};

// Provider Component
export const CreateStoreProvider = ({ children }) => {
  // Form state
  const [formData, setFormData] = useState(initialFormState);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // For multi-step form
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdStore, setCreatedStore] = useState(null);

  /**
   * Update form field
   */
  const updateField = useCallback((field, value) => {
    setFormData(prev => {
      // Handle nested fields (e.g., address.city)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
    
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Update multiple fields at once
   */
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
    setStep(1);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  /**
   * Validate current step
   */
  const validateStep = useCallback((currentStep) => {
    const validation = validateStoreData(formData);
    
    // For multi-step forms, validate only relevant fields per step
    if (currentStep === 1) {
      // Basic info validation
      const stepErrors = {};
      if (validation.errors.name) stepErrors.name = validation.errors.name;
      if (validation.errors.phone) stepErrors.phone = validation.errors.phone;
      if (validation.errors.email) stepErrors.email = validation.errors.email;
      
      setErrors(stepErrors);
      const isValid = Object.keys(stepErrors).length === 0;
      if (!isValid) {
        showWarning('Please fill in all required fields correctly.');
      }
      return isValid;
    } else if (currentStep === 2) {
      // Address validation
      const stepErrors = {};
      if (validation.errors.fullAddress) stepErrors.fullAddress = validation.errors.fullAddress;
      
      setErrors(stepErrors);
      const isValid = Object.keys(stepErrors).length === 0;
      if (!isValid) {
        showWarning('Please provide a valid address.');
      }
      return isValid;
    }
    
    return validation.isValid;
  }, [formData]);

  /**
   * Move to next step
   */
  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      return true;
    }
    return false;
  }, [step, validateStep]);

  /**
   * Move to previous step
   */
  const previousStep = useCallback(() => {
    setStep(prev => Math.max(1, prev - 1));
    setErrors({});
  }, []);

  /**
   * Submit store creation form
   */
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      setSubmitError(null);
      
      // Validate all data
      const validation = validateStoreData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setLoading(false);
        showError('Please fix the errors before submitting.');
        return { success: false, errors: validation.errors };
      }

      // Submit to API
      const response = await createStore(formData);
      
      setCreatedStore(response.data); // Store the response data
      setSubmitSuccess(true);
      setLoading(false);
      showSuccess(`Store "${formData.name}" created successfully!`);
      
      return { success: true, data: response };
    } catch (error) {
      setLoading(false);
      const errorMessage = error?.message || 'Failed to create store. Please try again.';
      setSubmitError(errorMessage);
      showError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [formData]);

  /**
   * Context value
   */
  const value = {
    // Form data
    formData,
    updateField,
    updateFormData,
    resetForm,
    
    // UI state
    loading,
    errors,
    submitError,
    submitSuccess,
    createdStore, // Add createdStore to context
    
    // Multi-step form
    step,
    nextStep,
    previousStep,
    setStep,
    
    // Actions
    handleSubmit,
    validateStep
  };

  return (
    <CreateStoreContext.Provider value={value}>
      {children}
    </CreateStoreContext.Provider>
  );
};

/**
 * Custom hook to use the CreateStoreContext
 */
export const useCreateStoreContext = () => {
  const context = useContext(CreateStoreContext);
  if (context === undefined) {
    throw new Error('useCreateStoreContext must be used within a CreateStoreProvider');
  }
  return context;
};

export default CreateStoreContext;
