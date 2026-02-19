import toast from 'react-hot-toast';

/**
 * Toast Utility Functions
 * Centralized toast notification helpers with custom styling
 */

// Default toast options with custom styling
const defaultOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#fff',
    color: '#0f172a',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    fontWeight: '600',
    fontSize: '14px',
  },
};

/**
 * Success toast notification
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    icon: '✅',
    style: {
      ...defaultOptions.style,
      border: '2px solid #10b981',
      ...options.style,
    },
  });
};

/**
 * Error toast notification
 */
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...defaultOptions,
    duration: 5000,
    ...options,
    icon: '❌',
    style: {
      ...defaultOptions.style,
      border: '2px solid #ef4444',
      ...options.style,
    },
  });
};

/**
 * Warning toast notification
 */
export const showWarning = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: '⚠️',
    style: {
      ...defaultOptions.style,
      border: '2px solid #f59e0b',
      ...options.style,
    },
  });
};

/**
 * Info toast notification
 */
export const showInfo = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: 'ℹ️',
    style: {
      ...defaultOptions.style,
      border: '2px solid #3b82f6',
      ...options.style,
    },
  });
};

/**
 * Loading toast notification
 */
export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options,
    style: {
      ...defaultOptions.style,
      border: '2px solid #6366f1',
      ...options.style,
    },
  });
};

/**
 * Promise toast - shows loading, then success or error based on promise result
 */
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!',
    },
    {
      ...defaultOptions,
      ...options,
    }
  );
};

/**
 * Custom toast with full control
 */
export const showCustom = (message, options = {}) => {
  return toast(message, {
    ...defaultOptions,
    ...options,
  });
};

/**
 * Dismiss a specific toast or all toasts
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  promise: showPromise,
  custom: showCustom,
  dismiss: dismissToast,
};
