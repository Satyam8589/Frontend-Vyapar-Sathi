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
      // Use transform + opacity only — these are compositor-thread properties
      // that don't trigger layout/paint, so they're smooth even on mobile.
      className="group relative bg-gradient-to-br from-white to-slate-50/30 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:border-blue-300/60 transition-shadow duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Accent bar — simple gradient, no blur */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Header */}
      <div className="relative pt-4 pb-3 px-5 flex items-start justify-between">
        {/* Logo / Initials */}
        <div className="relative z-10">
          {store.logo ? (
            <div className="h-14 w-14 rounded-xl overflow-hidden ring-2 ring-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Image src={store.logo} alt={store.name} width={56} height={56} className="object-cover" />
            </div>
          ) : (
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-md group-hover:scale-105 transition-transform duration-300"
              style={{ background: `linear-gradient(135deg, ${color}f0, ${color}cc)` }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1.5 relative z-10">
          {/* Active badge — static dot, no animate-ping (saves per-card animation) */}
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

      {/* Body */}
      <div className="px-5 pb-3 flex-1 flex flex-col">
        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
          {store.name}
        </h3>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100/50">
            <div className="flex items-center gap-1 mb-1.5">
              <svg className="h-2.5 w-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-[8px] font-black uppercase tracking-wider text-blue-600/80">Products</p>
            </div>
            <span className="text-xl font-black text-slate-900 leading-none">{store.totalProducts || 0}</span>
          </div>

          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100/50">
            <div className="flex items-center gap-1 mb-1.5">
              <svg className="h-2.5 w-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[8px] font-black uppercase tracking-wider text-emerald-600/80">Value</p>
            </div>
            <span className="text-xl font-black text-slate-900 leading-none">
              {store.settings?.currency === 'USD' ? '$' : '₹'}
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

        {/* Contact info */}
        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center gap-2.5 text-slate-600">
            <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200/50 flex items-center justify-center flex-shrink-0">
              <svg className="h-3 w-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold font-mono tracking-tight">{store.phone}</span>
          </div>

          {store.email && (
            <div className="flex items-center gap-2.5 text-slate-600">
              <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200/50 flex items-center justify-center flex-shrink-0">
                <svg className="h-3 w-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold truncate lowercase">{store.email}</span>
            </div>
          )}

          <div className="flex items-start gap-2.5 text-slate-600">
            <div className="h-7 w-7 rounded-lg bg-slate-100 border border-slate-200/50 flex items-center justify-center flex-shrink-0">
              <svg className="h-3 w-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold leading-relaxed text-slate-700">
                {store.address?.street && <span className="block truncate">{store.address.street}</span>}
                <span className="block">
                  {store.address?.city || store.city}
                  {(store.address?.state || store.state) && `, ${store.address?.state || store.state}`}
                  {(store.address?.pincode || store.pincode) && ` - ${store.address?.pincode || store.pincode}`}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 bg-slate-50/80 border-t border-slate-200/60 flex items-center justify-between">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">
          #{store._id?.slice(-6).toUpperCase()}
        </span>
        <button className="flex items-center gap-1.5 text-[9px] font-black text-white uppercase tracking-widest bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-1.5 rounded-lg shadow-sm transition-opacity duration-200 hover:opacity-90 active:scale-95">
          <span>Open</span>
          <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
