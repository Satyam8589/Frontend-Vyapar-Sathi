'use client';

import React from 'react';
import { useCreateStoreContext } from '../../context/CreateStoreContext';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import { BUSINESS_TYPES, CURRENCY_OPTIONS } from '../../constants';

/**
 * BusinessDetailsStep - Step 3: Business type and settings
 */
const BusinessDetailsStep = () => {
  const { formData, updateField, errors } = useCreateStoreContext();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Business Details
        </h3>
        <p className="text-sm text-gray-600">
          Tell us more about your business and configure settings
        </p>
      </div>
      
      <div className="space-y-4">
        <Select
          label="Business Type"
          name="businessType"
          value={formData.businessType}
          onChange={(e) => updateField('businessType', e.target.value)}
          options={BUSINESS_TYPES}
          error={errors.businessType}
          placeholder="Select business type"
          required
        />
        
        <Textarea
          label="Store Description (Optional)"
          name="description"
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          error={errors.description}
          placeholder="Brief description of your store and products/services"
          maxLength={500}
          rows={4}
        />
        
        <div className="border-t pt-4 mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Store Settings
          </h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Low Stock Threshold"
                name="lowStockThreshold"
                type="number"
                value={formData.settings.lowStockThreshold}
                onChange={(e) =>
                  updateField('settings.lowStockThreshold', parseInt(e.target.value) || 0)
                }
                error={errors.lowStockThreshold}
                placeholder="10"
                min="0"
              />
              
              <Input
                label="Expiry Alert Days"
                name="expiryAlertDays"
                type="number"
                value={formData.settings.expiryAlertDays}
                onChange={(e) =>
                  updateField('settings.expiryAlertDays', parseInt(e.target.value) || 0)
                }
                error={errors.expiryAlertDays}
                placeholder="7"
                min="0"
              />
            </div>
            
            <Select
              label="Currency"
              name="currency"
              value={formData.settings.currency}
              onChange={(e) => updateField('settings.currency', e.target.value)}
              options={CURRENCY_OPTIONS}
              error={errors.currency}
              placeholder="Select currency"
            />
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> These settings can be modified later from your store dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsStep;
