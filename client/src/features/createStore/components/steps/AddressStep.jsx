'use client';

import React, { useEffect } from 'react';
import { useCreateStoreContext } from '../../context/CreateStoreContext';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { INDIAN_STATES } from '../../constants';
import { generateFullAddress } from '../../utils/helpers';

/**
 * AddressStep - Step 2: Store address details
 */
const AddressStep = () => {
  const { formData, updateField, errors } = useCreateStoreContext();
  
  const handlePincodeChange = (e) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      updateField('address.pincode', value);
    }
  };
  
  // Auto-generate full address when fields change
  useEffect(() => {
    const fullAddress = generateFullAddress(formData.address);
    if (fullAddress && fullAddress !== formData.address.fullAddress) {
      updateField('address.fullAddress', fullAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.address.street,
    formData.address.city,
    formData.address.state,
    formData.address.pincode,
    formData.address.country
  ]);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Store Address
        </h3>
        <p className="text-sm text-gray-600">
          Provide the complete address of your store
        </p>
      </div>
      
      <div className="space-y-4">
        <Input
          label="Street Address"
          name="street"
          value={formData.address.street}
          onChange={(e) => updateField('address.street', e.target.value)}
          error={errors.street}
          placeholder="Shop/Building No., Street Name"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.address.city}
            onChange={(e) => updateField('address.city', e.target.value)}
            error={errors.city}
            placeholder="Enter city"
          />
          
          <Select
            label="State"
            name="state"
            value={formData.address.state}
            onChange={(e) => updateField('address.state', e.target.value)}
            options={INDIAN_STATES}
            error={errors.state}
            placeholder="Select state"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Pincode"
            name="pincode"
            type="tel"
            value={formData.address.pincode}
            onChange={handlePincodeChange}
            error={errors.pincode}
            placeholder="6-digit pincode"
            maxLength={6}
            pattern="[0-9]{6}"
          />
          
          <Input
            label="Country"
            name="country"
            value={formData.address.country}
            onChange={(e) => updateField('address.country', e.target.value)}
            error={errors.country}
            placeholder="Country"
            disabled
          />
        </div>
        
        <Input
          label="Full Address"
          name="fullAddress"
          value={formData.address.fullAddress}
          onChange={(e) => updateField('address.fullAddress', e.target.value)}
          error={errors.fullAddress}
          placeholder="Complete address will be auto-generated"
          required
        />
        
        <p className="text-xs text-gray-500">
          * Full address is auto-generated from the fields above, but you can edit it if needed.
        </p>
      </div>
    </div>
  );
};

export default AddressStep;
