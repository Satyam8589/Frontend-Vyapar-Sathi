'use client';

import React from 'react';
import { useCreateStoreContext } from '../context/CreateStoreContext';
import FormStepIndicator from './FormStepIndicator';
import FormNavigation from './FormNavigation';
import BasicInfoStep from './steps/BasicInfoStep';
import AddressStep from './steps/AddressStep';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import ReviewStep from './steps/ReviewStep';
import SuccessModal from './SuccessModal';
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
    formData,
    createdStore,
    submitError
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
  
  const handleFinalCreate = async () => {
    // This is explicitly called ONLY when the "Create Store" button is clicked on Step 4
    await handleSubmit();
  };

  const onFormSubmit = (e) => {
    if (e) e.preventDefault();
    
    // This handles the "Enter" key press. 
    // If not on the last step, it just moves forward.
    // If on the last step, we do nothing here to prevent auto-submission on page load/transition.
    if (step < 4) {
      nextStep();
    }
  };
  
  return (
    <>
      <form onSubmit={onFormSubmit} className="space-y-6">
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
            onSubmit={handleFinalCreate}
            loading={loading}
          />
        )}
      </form>

      {/* Creation Flow Modal (Handles Loading -> Success) */}
      <SuccessModal 
        isOpen={loading || submitSuccess || submitError} 
        onClose={() => {}} // Handle error close if needed
        loading={loading}
        success={submitSuccess}
        storeName={formData.name} 
        storeId={createdStore?._id} 
        error={submitError}
      />
    </>
  );
};

export default StoreForm;
