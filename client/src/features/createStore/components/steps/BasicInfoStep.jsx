'use client';

import React from 'react';
import { useCreateStoreContext } from '../../context/CreateStoreContext';
import Input from '../ui/Input';

/**
 * BasicInfoStep - Step 1: Store name, phone, and email
 */
const BasicInfoStep = () => {
  const { formData, updateField, errors } = useCreateStoreContext();
  
  const handlePhoneChange = (e) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      updateField('phone', value);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Basic Information
        </h3>
        <p className="text-sm text-gray-600">
          Let&apos;s start with the basic details of your store
        </p>
      </div>
      
      <div className="space-y-4">
        <Input
          label="Store Name"
          name="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          error={errors.name}
          placeholder="Enter your store name"
          required
          maxLength={100}
        />
        
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          error={errors.phone}
          placeholder="10-digit mobile number"
          required
          maxLength={10}
          pattern="[0-9]{10}"
        />
        
        <Input
          label="Email (Optional)"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          error={errors.email}
          placeholder="store@example.com"
        />
      </div>
    </div>
  );
};

export default BasicInfoStep;
