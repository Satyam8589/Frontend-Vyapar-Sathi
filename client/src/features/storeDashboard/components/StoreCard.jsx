'use client';

import React from 'react';
import Image from 'next/image';
import { getStoreInitials, getStoreColor, formatDate } from '../utils/helpers';

/**
 * StoreCard Component
 * Performance-optimised: removed backdrop-blur, blur-2xl, animate-ping,
 * and transition-all in favour of targeted GPU-friendly transitions.
 */
const StoreCard = ({ store, index, onClick }) => {
  const initials = getStoreInitials(store.name);
  const color = getStoreColor(index);

  return (
    <div
      onClick={() => onClick?.(store)}
      // Standard rounding for mobile (rounded-2xl), Super-curvy for desktop (lg:rounded-[2.5rem])
      className="group relative bg-white border border-slate-200/80 rounded-2xl lg:rounded-[2.5rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:border-blue-400/50 transition-all duration-500 cursor-pointer flex flex-col lg:flex-row lg:items-center overflow-hidden h-full lg:h-[300px]"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Accent bar - Full width on top for mobile, Vertical bar on left for desktop */}
      <div
        className="h-1 lg:h-full w-full lg:w-1.5 flex-shrink-0"
        style={{ background: `linear-gradient(${typeof window !== 'undefined' && window.innerWidth < 1024 ? '90deg' : '180deg'}, ${color}, ${color}cc)` }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-2.5 lg:gap-8 px-5 py-3 lg:py-0">
        
        {/* Top Header Section (Mobile) / Left Logo (Desktop) */}
        <div className="flex items-start justify-between lg:justify-start lg:items-center gap-4">
          {/* Logo / Initials */}
          <div className="flex-shrink-0 relative">
            {store.logo ? (
              <div className="h-14 w-14 lg:h-32 lg:w-32 rounded-xl lg:rounded-[2rem] overflow-hidden ring-2 ring-white lg:ring-8 lg:ring-slate-50 shadow-md lg:shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Image src={store.logo} alt={store.name} width={128} height={128} className="object-cover" />
              </div>
            ) : (
              <div
                className="h-14 w-14 lg:h-32 lg:w-32 rounded-xl lg:rounded-[2rem] flex items-center justify-center text-xl lg:text-5xl font-black text-white shadow-md lg:shadow-xl group-hover:scale-105 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
              >
                {initials}
              </div>
            )}
            {/* Active Status Dot for Desktop Only */}
            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 h-4 w-4 lg:h-8 lg:w-8 rounded-full bg-white p-0.5 lg:p-1.5 shadow-sm hidden lg:flex">
              <div className="h-full w-full rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            </div>
          </div>

          {/* Badges - Visible mostly on Mobile at top right */}
          <div className="lg:hidden flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
            </div>
            <div className="px-2 py-0.5 rounded-md bg-slate-100">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                {store.businessType || 'Retail'}
              </span>
            </div>
          </div>
        </div>

        {/* Identity & Location */}
        <div className="flex-[2] min-w-0">
          <div className="flex flex-col lg:gap-2 mb-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg lg:text-4xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors line-clamp-1 pr-1">
                {store.name}
              </h3>
              {/* Business Type Badge - Desktop Only */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 shadow-sm">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{store.businessType || 'Retail'}</span>
              </div>
            </div>
            <span className="hidden lg:inline-block text-[11px] font-black text-slate-400 font-mono tracking-[0.2em] uppercase opacity-70">
              ID: {store._id?.toUpperCase()}
            </span>
          </div>
          
          <div className="flex flex-col lg:gap-3 text-[10px] lg:text-sm font-bold text-slate-500">
            <div className="flex items-center gap-2 lg:gap-3 bg-slate-50 lg:w-fit lg:px-4 lg:py-2 lg:rounded-2xl lg:border lg:border-slate-100">
              <svg className="h-3 w-3 lg:h-5 lg:w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="truncate lg:text-slate-700 lg:font-extrabold">{store.address?.city || store.city}, {store.address?.state || store.state}</span>
            </div>

            {/* Desktop Full Address */}
            <div className="hidden lg:flex items-start gap-4 mt-2 max-w-md">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Address</span>
                <span className="text-lg font-black text-slate-800 leading-snug">
                  {store.address?.street || 'No street address provided'}
                  <span className="block text-slate-500 font-bold text-sm mt-0.5">
                    Pincode: {store.address?.pincode || 'N/A'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Grid on mobile, Row on desktop */}
        <div className="grid grid-cols-2 lg:flex lg:flex-col lg:justify-center flex-1 lg:items-center gap-2 lg:gap-8 lg:px-8 lg:border-x lg:border-slate-100">
          {/* Inventory Stat */}
          <div className="bg-blue-50 lg:bg-transparent rounded-xl lg:rounded-none p-3 lg:p-0 border border-blue-100/50 lg:border-none flex flex-col lg:items-center gap-1">
            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-blue-600/80">Active Inventory</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl lg:text-5xl font-black text-slate-900 leading-none">{store.totalProducts || 0}</span>
              <span className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest">SKUs</span>
            </div>
          </div>

          <div className="hidden lg:block w-12 h-px bg-slate-100" />

          {/* Value Stat */}
          <div className="bg-emerald-50 lg:bg-transparent rounded-xl lg:rounded-none p-3 lg:p-0 border border-emerald-100/50 lg:border-none flex flex-col lg:items-center gap-1">
            <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/80">Net Valuation</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm lg:text-2xl font-black text-emerald-500">{store.settings?.currency === 'USD' ? '$' : '₹'}</span>
              <span className="text-xl lg:text-5xl font-black text-slate-900 leading-none">
                {(() => {
                  const value = store.totalInventoryValue || 0;
                  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
                  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                  return value.toLocaleString();
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Contact info - Sidebar Desktop Only */}
        <div className="hidden xl:flex flex-[1.5] flex-col gap-4 justify-center">
          <div className="flex items-center gap-4 text-slate-600 group/item">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-blue-600 group-hover/item:border-blue-600 transition-all duration-300">
              <svg className="h-5 w-5 text-blue-500 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Contact</span>
              <span className="text-sm font-black font-mono tracking-tight text-slate-900 underline decoration-blue-500/30">{store.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600 group/item">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-indigo-600 group-hover/item:border-indigo-600 transition-all duration-300">
              <svg className="h-5 w-5 text-indigo-500 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Email</span>
              <span className="text-sm font-black lowercase text-slate-700 max-w-[220px] truncate">{store.email || 'No email provided'}</span>
            </div>
          </div>
        </div>

        {/* Mobile-only Contact & Address Snippets */}
        <div className="lg:hidden flex flex-col gap-1.5 mt-1 pt-1.5 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-slate-600">
            <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200/50 flex items-center justify-center flex-shrink-0">
              <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold font-mono tracking-tight text-slate-700">{store.phone}</span>
          </div>
          
          {store.email && (
            <div className="flex items-center gap-2.5 text-slate-600">
              <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200/50 flex items-center justify-center flex-shrink-0">
                <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold truncate lowercase text-slate-500">{store.email}</span>
            </div>
          )}

          <div className="flex items-start gap-2.5 text-slate-600">
            <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200/50 flex items-center justify-center flex-shrink-0">
              <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight">
              {store.address?.street && <span className="block truncate">{store.address.street}</span>}
              <span>{store.address?.city || store.city}, {store.address?.state || store.state}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Action Section */}
      <div className="lg:h-full px-5 py-2 lg:py-0 lg:w-32 bg-slate-50/80 lg:bg-transparent border-t lg:border-t-0 lg:border-l border-slate-200/60 flex items-center justify-between lg:justify-center">
        <span className="lg:hidden text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">
          #{store._id?.slice(-6).toUpperCase()}
        </span>
        <button className="flex items-center justify-center gap-2 text-[10px] lg:text-xs font-black text-white uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 lg:from-blue-600 lg:to-blue-500 lg:h-12 lg:w-full px-5 py-2 lg:px-0 lg:py-0 rounded-xl lg:rounded-none lg:group-hover:bg-blue-600 transition-all duration-300 shadow-md lg:shadow-none hover:shadow-lg lg:hover:shadow-none active:scale-95 lg:active:scale-100">
          <span className="lg:hidden xl:inline">Open</span>
          <svg className="h-3 w-3 lg:h-4 lg:w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
