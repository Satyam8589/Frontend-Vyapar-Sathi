'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStoreInitials, getStoreColor } from '../utils/helpers';

/**
 * StoreCard Component
 * Fixed duplication and added Staff Management link.
 */
const StoreCard = ({ store, index, onClick, onDelete }) => {
  const initials = getStoreInitials(store.name);
  const color = getStoreColor(index);

  return (
    <div
      onClick={() => onClick?.(store)}
      className="group relative bg-white border border-slate-200/80 rounded-2xl lg:rounded-[1.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-blue-400/50 transition-all duration-500 cursor-pointer flex flex-col lg:flex-row lg:items-center overflow-hidden h-full lg:h-[180px]"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Accent bar */}
      <div
        className="h-1 lg:h-full w-full lg:w-1.5 flex-shrink-0"
        style={{ background: `linear-gradient(${typeof window !== 'undefined' && window.innerWidth < 1024 ? '90deg' : '180deg'}, ${color}, ${color}cc)` }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-2.5 lg:gap-8 px-5 py-3 lg:py-0">
        
        {/* Logo Section */}
        <div className="flex items-start justify-between lg:justify-start lg:items-center gap-4">
          <div className="flex-shrink-0 relative">
            {store.logo ? (
              <div className="h-14 w-14 lg:h-24 lg:w-24 rounded-xl lg:rounded-[1.25rem] overflow-hidden ring-2 ring-white lg:ring-4 lg:ring-slate-50 shadow-md lg:shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Image src={store.logo} alt={store.name} width={96} height={96} className="object-cover" />
              </div>
            ) : (
              <div
                className="h-14 w-14 lg:h-24 lg:w-24 rounded-xl lg:rounded-[1.25rem] flex items-center justify-center text-xl lg:text-3xl font-black text-white shadow-md lg:shadow-lg group-hover:scale-105 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
              >
                {initials}
              </div>
            )}
            <div className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 h-4 w-4 lg:h-6 lg:w-6 rounded-full bg-white p-0.5 lg:p-1 shadow-sm hidden lg:flex">
              <div className="h-full w-full rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>
        </div>

        {/* Identity & Details */}
        <div className="flex-[2] min-w-0">
          <div className="flex flex-col lg:gap-2 mb-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg lg:text-3xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors line-clamp-1 pr-1">
                {store.name}
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full bg-slate-100 border border-slate-200 shadow-sm shrink-0">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">#{store.seqNumber || index + 1}</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <div className="px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-100 shadow-sm">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{store.businessType || 'Retail'}</span>
                </div>
                {store.isEmployee && (
                  <div className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-100 shadow-sm flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest whitespace-nowrap">
                      {store.userRole}
                      {store.permissions?.length > 0 && (
                        <span className="ml-1 opacity-80 lowercase font-bold">
                          ({store.permissions.map(p => {
                            if (p === 'billing:create') return 'Billing';
                            if (p === 'inventory:add') return 'Add';
                            if (p === 'inventory:manage') return 'Manage';
                            return p;
                          }).join(', ')})
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:gap-3 text-[10px] lg:text-sm font-bold text-slate-500">
            <div className="flex items-center gap-2 lg:gap-3 bg-slate-50 lg:w-fit lg:px-4 lg:py-2 lg:rounded-2xl lg:border lg:border-slate-100">
              <svg className="h-3 w-3 lg:h-5 lg:w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{store.address?.city || store.city}, {store.address?.state || store.state}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`flex flex-col lg:justify-center flex-1 lg:items-center gap-2 lg:gap-8 lg:px-8 lg:border-x lg:border-slate-100 ${store.isEmployee ? '' : 'grid grid-cols-2 lg:grid-cols-1'}`}>
          <div className="flex flex-col lg:items-center gap-1">
            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/80">Products</p>
            <span className="text-xl lg:text-3xl font-black text-slate-900">{store.totalProducts || 0}</span>
          </div>
          {!store.isEmployee && (
            <div className="flex flex-col lg:items-center gap-1">
              <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/80">valuation</p>
              <span className="text-xl lg:text-3xl font-black text-slate-900">
                  ₹{((store.totalInventoryValue || 0) / 1000).toFixed(1)}k
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Action Section */}
      <div className="lg:h-full px-5 py-2 lg:py-0 lg:w-36 bg-slate-50/80 lg:bg-transparent border-t lg:border-t-0 lg:border-l border-slate-200/60 flex items-center justify-between lg:flex-col lg:justify-center lg:gap-3">
        {/* Open Button */}
        <button 
           className="flex items-center justify-center gap-2 text-[10px] lg:text-xs font-black text-white uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 lg:w-full px-5 py-2 lg:px-0 lg:py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
        >
          Open
        </button>

        {/* Staff Management Link — Only for Owners or those with manage permissions */}
        {(!store.isEmployee || store.permissions?.includes('inventory:manage')) && (
          <Link
            href={`/storeDashboard/${store._id}/staff`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-200 lg:w-full px-5 py-2 lg:px-0 lg:py-2.5 rounded-xl transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95"
          >
            🛡️ <span>Staff</span>
          </Link>
        )}

        {/* Delete Store — ONLY for Owners */}
        {!store.isEmployee && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(store);
            }}
            className="flex items-center justify-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-200 lg:w-full px-5 py-2 lg:px-0 lg:py-2.5 rounded-xl transition-all duration-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 active:scale-95"
          >
            🗑️ <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StoreCard;
