'use client';

import React from 'react';
import { CreateStoreProvider } from '@/features/createStore/context/CreateStoreContext';
import StoreForm from '@/features/createStore/components/StoreForm';

/**
 * Create Store Page
 * Main page for creating a new store
 */
function CreateStorePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Create Your Store
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Set up your store in a few simple steps
          </p>
        </div>

        {/* Store Creation Form */}
        <CreateStoreProvider>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <StoreForm />
          </div>
        </CreateStoreProvider>
      </div>
    </div>
  );
}

export default CreateStorePage;
