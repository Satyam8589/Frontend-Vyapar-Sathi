'use client';

import React from 'react';
import Image from 'next/image';
import { getStoreInitials, getStoreColor, formatDate } from '../utils/helpers';

/**
 * StoreCard Component - Display individual store information
 */
const StoreCard = ({ store, index, onClick }) => {
  const initials = getStoreInitials(store.name);
  const color = getStoreColor(index);

  return (
    <div
      onClick={() => onClick?.(store)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer border border-gray-200 overflow-hidden"
    >
      {/* Header with colored background */}
      <div 
        className="h-24 flex items-center justify-center text-white text-3xl font-bold"
        style={{ backgroundColor: color }}
      >
        {store.logo ? (
          <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white">
            <Image 
              src={store.logo} 
              alt={store.name} 
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-16 w-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center border-4 border-white">
            {initials}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
          {store.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          {/* Business Type */}
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {store.businessType}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{store.phone}</span>
          </div>

          {/* Email */}
          {store.email && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{store.email}</span>
            </div>
          )}

          {/* Location */}
          {store.address?.city && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{store.address.city}, {store.address.state}</span>
            </div>
          )}

          {/* Created Date */}
          {store.createdAt && (
            <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
              Created: {formatDate(store.createdAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
