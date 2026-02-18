'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';

/**
 * FormNavigation - Navigation buttons for multi-step form
 */
const FormNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  loading = false,
  canGoNext = true,
}) => {
  const router = useRouter();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center pt-6 border-t mt-8">
      <div>
        {isFirstStep ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/storeDashboard')}
            disabled={loading}
          >
            {/* Mobile: compact */}
            <span className="sm:hidden">← Back</span>
            {/* Desktop: full label */}
            <span className="hidden sm:inline">← Back to Dashboard</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
            disabled={loading}
          >
            ← Previous
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        {!isLastStep ? (
          <Button
            type="button"
            variant="primary"
            onClick={onNext}
            disabled={!canGoNext || loading}
          >
            Next →
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            onClick={onSubmit}
            loading={loading}
            disabled={loading}
          >
            Create Store
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
