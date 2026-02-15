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
      className="group relative bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      {/* Decorative Top Bar */}
      <div 
        className="h-1.5 w-full" 
        style={{ backgroundColor: color }}
      />

      {/* Visual Header - Minimal & Premium */}
      <div className="relative pt-6 pb-4 px-8 flex items-start justify-between">
        <div className="relative z-10">
          {store.logo ? (
            <div className="h-16 w-16 rounded-2xl overflow-hidden ring-4 ring-slate-50 shadow-lg transform group-hover:scale-105 transition-transform duration-500">
              <Image 
                src={store.logo} 
                alt={store.name} 
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          ) : (
            <div 
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-black/5 transform group-hover:scale-105 transition-transform duration-500"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Active Store</span>
          </div>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Type: {store.businessType || 'Retail'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="px-8 pb-4 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none mb-3 group-hover:text-blue-600 transition-colors">
          {store.name}
        </h3>
        
        {/* Stats Section - Highly Professional Grid */}
        <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 mb-4">
          <div className="bg-white p-4 group-hover:bg-slate-50/50 transition-colors">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 flex items-center gap-1.5">
              <svg className="h-3 w-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Assets
            </p>
            <span className="text-xl font-black text-slate-900 leading-none">{store.totalProducts || 0}</span>
          </div>
          <div className="bg-white p-4 group-hover:bg-slate-50/50 transition-colors">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2 flex items-center gap-1.5">
              <svg className="h-3 w-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
              Value
            </p>
            <span className="text-xl font-black text-slate-900 leading-none">
              {store.settings?.currency === 'USD' ? '$' : '₹'}{(store.totalInventoryValue || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Contact info - Subtle & Elegant */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-3 text-slate-500 group/link">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-blue-50 transition-colors">
              <svg className="h-4 w-4 text-slate-400 group-hover/link:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-xs font-bold font-mono tracking-tight">{store.phone}</span>
          </div>

          {store.email && (
            <div className="flex items-center gap-3 text-slate-500 group/link">
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-indigo-50 transition-colors">
                <svg className="h-4 w-4 text-slate-400 group-hover/link:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-bold truncate lowercase">{store.email}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-slate-500 group/link">
            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-amber-50 transition-colors">
              <svg className="h-4 w-4 text-slate-400 group-hover/link:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold italic truncate">{store.address?.city || store.city}, {store.address?.state || store.state}</span>
          </div>
        </div>
      </div>

      {/* Premium Footer Action */}
      <div className="px-8 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">ID: {store._id?.slice(-6).toUpperCase()}</span>
        <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20">
          Open Store
          <svg className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
