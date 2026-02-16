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
      className="group relative bg-gradient-to-br from-white to-slate-50/30 rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-blue-300/60 ring-1 ring-blue-500/0 hover:ring-blue-500/20 transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden backdrop-blur-sm"
    >
      {/* Gradient Accent Bar with Glow */}
      <div className="relative h-1 w-full overflow-hidden">
        <div 
          className="absolute inset-0 opacity-90" 
          style={{ 
            background: `linear-gradient(90deg, ${color}00, ${color}, ${color}, ${color}00)` 
          }}
        />
        <div 
          className="absolute inset-0 blur-sm opacity-50" 
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Visual Header with Subtle Background */}
      <div className="relative pt-4 pb-3 px-5 flex items-start justify-between">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        
        <div className="relative z-10">
          {store.logo ? (
            <div className="relative h-14 w-14 rounded-xl overflow-hidden ring-2 ring-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Image 
                src={store.logo} 
                alt={store.name} 
                width={56}
                height={56}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          ) : (
            <div 
              className="relative h-14 w-14 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${color}f0, ${color}cc)` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="relative z-10">{initials}</span>
              <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full blur-xl opacity-50" style={{ backgroundColor: color }} />
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 relative z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200/60 shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
          </div>
          <div className="px-2 py-0.5 rounded-md bg-slate-100/80 backdrop-blur-sm">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
              {store.businessType || 'Retail'}
            </span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-5 pb-3 flex-1 flex flex-col relative">
        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
          {store.name}
        </h3>
        
        {/* Stats Section - Premium Cards */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-3 border border-blue-100/50 group-hover:shadow-md transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-1 mb-1.5">
                <div className="p-1 bg-blue-500/10 rounded-md">
                  <svg className="h-2.5 w-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-[8px] font-black uppercase tracking-wider text-blue-600/80">
                  Products
                </p>
              </div>
              <span className="text-xl font-black text-slate-900 leading-none">{store.totalProducts || 0}</span>
            </div>
          </div>
          
          <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl p-3 border border-emerald-100/50 group-hover:shadow-md transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-1 mb-1.5">
                <div className="p-1 bg-emerald-500/10 rounded-md">
                  <svg className="h-2.5 w-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-[8px] font-black uppercase tracking-wider text-emerald-600/80">
                  Value
                </p>
              </div>
              <span className="text-xl font-black text-slate-900 leading-none">
                {store.settings?.currency === 'USD' ? '$' : '₹'}{((store.totalInventoryValue || 0) / 1000).toFixed(0)}k
              </span>
            </div>
          </div>
        </div>

        {/* Contact info - Refined */}
        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center gap-2.5 text-slate-600 group/link">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 flex items-center justify-center group-hover/link:from-blue-50 group-hover/link:to-blue-100/50 group-hover/link:border-blue-200/50 transition-all">
              <svg className="h-3 w-3 text-slate-500 group-hover/link:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-[11px] font-bold font-mono tracking-tight">{store.phone}</span>
          </div>

          {store.email && (
            <div className="flex items-center gap-2.5 text-slate-600 group/link">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 flex items-center justify-center group-hover/link:from-indigo-50 group-hover/link:to-indigo-100/50 group-hover/link:border-indigo-200/50 transition-all">
                <svg className="h-3 w-3 text-slate-500 group-hover/link:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold truncate lowercase">{store.email}</span>
            </div>
          )}

          <div className="flex items-start gap-2.5 text-slate-600 group/link">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 flex items-center justify-center group-hover/link:from-amber-50 group-hover/link:to-amber-100/50 group-hover/link:border-amber-200/50 transition-all flex-shrink-0">
              <svg className="h-3 w-3 text-slate-500 group-hover/link:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Premium Footer */}
      <div className="relative px-5 py-2.5 bg-gradient-to-r from-slate-50/80 to-slate-100/40 border-t border-slate-200/60 flex items-center justify-between backdrop-blur-sm">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">#{store._id?.slice(-6).toUpperCase()}</span>
        <button className="flex items-center gap-1.5 text-[9px] font-black text-white uppercase tracking-widest bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-1.5 rounded-lg shadow-md shadow-blue-500/25 transition-all hover:shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95">
          <span>Open</span>
          <svg className="h-2.5 w-2.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
