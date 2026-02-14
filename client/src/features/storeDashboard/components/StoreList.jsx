'use client';

import React from 'react';
import Image from 'next/image';
import StoreCard from './StoreCard';

/**
 * StoreList Component - Display grid or list of stores
 */
const StoreList = ({ stores, loading, error, onStoreClick, viewMode = 'grid' }) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!stores || stores.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No stores found</h3>
          <p className="mt-2 text-gray-500">
            Get started by creating your first store.
          </p>
        </div>
      </div>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stores.map((store, index) => (
          <StoreCard
            key={store._id}
            store={store}
            index={index}
            onClick={onStoreClick}
          />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {stores.map((store, index) => (
        <div
          key={store._id}
          onClick={() => onStoreClick?.(store)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Store Logo/Initial */}
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: getStoreColor(index) }}
              >
                {store.logo ? (
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <Image src={store.logo} alt={store.name} width={48} height={48} className="object-cover" />
                  </div>
                ) : (
                  getStoreInitials(store.name)
                )}
              </div>

              {/* Store Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="capitalize">{store.businessType}</span>
                  <span>•</span>
                  <span>{store.phone}</span>
                  {store.address?.city && (
                    <>
                      <span>•</span>
                      <span>{store.address.city}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow Icon */}
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper functions (if not importing)
const getStoreInitials = (name) => {
  if (!name) return '??';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const getStoreColor = (index) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
  return colors[index % colors.length];
};

export default StoreList;
