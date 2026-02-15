'use client';

import { useRouter } from 'next/navigation';
import { useCreateStoreContext } from '../../context/CreateStoreContext';
import { getCurrencySymbol } from '../../utils/helpers';
import { BUSINESS_TYPES } from '../../constants';
import Button from '../ui/Button';

/**
 * ReviewStep - Step 4: Review and submit
 */
const ReviewStep = () => {
  const router = useRouter();
  const { formData, submitError, submitSuccess, createdStore } = useCreateStoreContext();
  
  const getBusinessTypeLabel = (value) => {
    const type = BUSINESS_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Review Your Store Details
        </h3>
        <p className="text-sm text-gray-600">
          Please review all information before creating your store
        </p>
      </div>
      
      {/* Basic Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-600 w-32">Store Name:</span>
            <span className="text-gray-900 font-medium">{formData.name}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">Phone:</span>
            <span className="text-gray-900 font-medium">{formData.phone}</span>
          </div>
          {formData.email && (
            <div className="flex">
              <span className="text-gray-600 w-32">Email:</span>
              <span className="text-gray-900 font-medium">{formData.email}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Address */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Address</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-600 w-32">Street:</span>
            <span className="text-gray-900">{formData.address.street || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">City:</span>
            <span className="text-gray-900">{formData.address.city || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">State:</span>
            <span className="text-gray-900">{formData.address.state || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">Pincode:</span>
            <span className="text-gray-900">{formData.address.pincode || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-32">Full Address:</span>
            <span className="text-gray-900">{formData.address.fullAddress}</span>
          </div>
        </div>
      </div>
      
      {/* Business Details */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Business Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-600 w-32">Business Type:</span>
            <span className="text-gray-900">{getBusinessTypeLabel(formData.businessType)}</span>
          </div>
          {formData.description && (
            <div className="flex">
              <span className="text-gray-600 w-32">Description:</span>
              <span className="text-gray-900">{formData.description}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Settings */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Settings</h4>
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="text-gray-600 w-40">Low Stock Threshold:</span>
            <span className="text-gray-900">{formData.settings.lowStockThreshold} units</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-40">Expiry Alert Days:</span>
            <span className="text-gray-900">{formData.settings.expiryAlertDays} days</span>
          </div>
          <div className="flex">
            <span className="text-gray-600 w-40">Currency:</span>
            <span className="text-gray-900">
              {getCurrencySymbol(formData.settings.currency)} ({formData.settings.currency})
            </span>
          </div>
        </div>
      </div>
      


      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-red-800">{submitError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
