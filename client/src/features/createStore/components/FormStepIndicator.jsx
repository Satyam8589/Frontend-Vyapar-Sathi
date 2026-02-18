'use client';

import React from 'react';
import { FORM_STEPS } from '@/features/createStore/constants/index';

// Short labels for mobile screens
const MOBILE_LABELS = ['Info', 'Address', 'Business', 'Review'];

/**
 * FormStepIndicator - Visual progress indicator for multi-step form
 */
const FormStepIndicator = ({ currentStep }) => {
  return (
    <div className="w-full py-4">
      {/* ── Top row: circles + connector lines ── */}
      <div className="flex items-center">
        {FORM_STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === FORM_STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step circle */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-all duration-200
                    ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-200' : ''}
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-600' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
              </div>

              {/* Connector line between circles */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Bottom row: labels aligned under each circle ── */}
      <div className="flex mt-2">
        {FORM_STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === FORM_STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Label cell — same flex-shrink-0 as the circle above */}
              <div className="flex-shrink-0 flex flex-col items-center" style={{ width: '2.25rem' }}>
                {/* Mobile: short label  |  sm+: full label */}
                <p
                  className={`
                    text-[10px] sm:text-xs font-semibold text-center leading-tight whitespace-nowrap
                    ${isActive ? 'text-blue-600' : ''}
                    ${isCompleted ? 'text-green-600' : ''}
                    ${!isActive && !isCompleted ? 'text-gray-400' : ''}
                  `}
                >
                  <span className="sm:hidden">{MOBILE_LABELS[index]}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </p>
              </div>

              {/* Spacer that matches the connector line width */}
              {!isLast && <div className="flex-1 mx-1 sm:mx-2" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepIndicator;

