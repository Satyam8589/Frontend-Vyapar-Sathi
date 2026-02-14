'use client';

import React from 'react';
import { useCreateStoreContext } from '../context/CreateStoreContext';
import FormStepIndicator from './FormStepIndicator';
import FormNavigation from './FormNavigation';
import BasicInfoStep from './steps/BasicInfoStep';
import AddressStep from './steps/AddressStep';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import ReviewStep from './steps/ReviewStep';
import { FORM_STEPS } from '../constants';

/**
 * StoreForm - Main multi-step form component
 */
const StoreForm = () => {
  const {
    step,
    nextStep,
    previousStep,
    handleSubmit,
    loading,
    submitSuccess,
  } = useCreateStoreContext();
  
  // Render current step component
  const renderStep = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <AddressStep />;
      case 3:
        return <BusinessDetailsStep />;
      case 4:
        return <ReviewStep />;
      default:
        return <BasicInfoStep />;
    }
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit();
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Step Indicator */}
      <FormStepIndicator currentStep={step} />
      
      {/* Current Step Content */}
      <div className="min-h-[400px] py-6">
        {renderStep()}
      </div>
      
      {/* Navigation Buttons */}
      {!submitSuccess && (
        <FormNavigation
          currentStep={step}
          totalSteps={FORM_STEPS.length}
          onNext={nextStep}
          onPrevious={previousStep}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}
    </form>
  );
};

export default StoreForm;
