'use client';

import React from 'react';
import { FORM_STEPS } from '@/features/createStore/constants/index';

/**
 * FormStepIndicator - Visual progress indicator for multi-step form
 */
const FormStepIndicator = ({ currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {FORM_STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === FORM_STEPS.length - 1;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold transition-all duration-200
                    ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-200' : ''}
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                
                <div className="mt-2 text-center">
                  <p
                    className={`
                      text-sm font-medium
                      ${isActive ? 'text-blue-600' : ''}
                      ${isCompleted ? 'text-green-600' : ''}
                      ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                    `}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-1 mx-2 transition-all duration-200
                    ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                  `}
                  style={{ marginTop: '-40px' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepIndicator;
