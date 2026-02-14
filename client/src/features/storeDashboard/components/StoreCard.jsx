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
      className="group bg-white/70 backdrop-blur-md rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Visual Header */}
      <div className="relative h-32 flex items-center justify-center overflow-hidden">
        {/* Abstract Background Design */}
        <div 
          className="absolute inset-0 opacity-20 transform group-hover:scale-110 transition-transform duration-700"
          style={{ 
            background: `radial-gradient(circle at 20% 20%, ${color}, transparent), radial-gradient(circle at 80% 80%, ${color}, transparent)` 
          }}
        />
        <div className="absolute inset-0 bg-mesh-light opacity-10" />
        
        <div className="relative z-10">
          {store.logo ? (
            <div className="h-20 w-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl group-hover:rotate-3 transition-transform duration-300">
              <Image 
                src={store.logo} 
                alt={store.name} 
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ) : (
            <div 
              className="h-20 w-20 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-xl group-hover:-rotate-3 transition-transform duration-300"
              style={{ backgroundColor: color }}
            >
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-7">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {store.businessType || 'Retail'}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors truncate">
          {store.name}
        </h3>
        
        <div className="space-y-3">
          {/* Phone */}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-sm font-bold italic">{store.phone}</span>
          </div>

          {/* Location */}
          {store.address?.city && (
            <div className="flex items-center gap-3 text-slate-600">
              <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-bold italic truncate">{store.address.city}, {store.address.state}</span>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            ID: {store._id?.slice(-6).toUpperCase()}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Enter Store
            <svg className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
