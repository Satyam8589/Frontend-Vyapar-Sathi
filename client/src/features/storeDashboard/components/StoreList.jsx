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
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="h-16 w-16 rounded-3xl bg-slate-200 mb-4"></div>
        <div className="h-4 w-48 bg-slate-200 rounded-lg mb-2"></div>
        <div className="h-3 w-32 bg-slate-100 rounded-lg"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center p-8 rounded-[2.5rem] bg-white border border-red-100 shadow-sm">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Sync Connection Lost</h3>
          <p className="text-slate-600 font-bold italic mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/10"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!stores || stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-24 w-24 bg-white rounded-[2.5rem] border border-slate-200 flex items-center justify-center mb-8 shadow-sm">
          <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">No Active Outlets</h3>
        <p className="text-slate-600 font-bold italic max-w-sm leading-relaxed mb-10">
          Your network is ready to expand. Connect your first physical store or warehouse to begin.
        </p>
      </div>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
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
    <div className="space-y-6">
      {stores.map((store, index) => (
        <div
          key={store._id}
          onClick={() => onStoreClick?.(store)}
          className="group relative bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-shadow duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Store Logo/Initial */}
              <div 
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                style={{ backgroundColor: getStoreColor(index) }}
              >
                {store.logo ? (
                  <div className="h-16 w-16 rounded-2xl overflow-hidden">
                    <Image src={store.logo} alt={store.name} width={64} height={64} className="object-cover" />
                  </div>
                ) : (
                  getStoreInitials(store.name)
                )}
              </div>

              {/* Store Info */}
              <div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{store.name}</h3>
                <div className="flex items-center gap-4 text-xs font-bold italic text-slate-500 mt-1">
                  <span className="uppercase tracking-widest">{store.businessType}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                  <span>{store.phone}</span>
                  {store.address?.city && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                      <span>{store.address.city}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Enter Icon */}
            <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <svg className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
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
