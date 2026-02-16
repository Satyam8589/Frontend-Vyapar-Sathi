'use client';

import React from 'react';

const InventoryFilters = ({ searchTerm, setSearchTerm, onMenuClick }) => {
  return (
    <section className="mb-6 animate-fade-in-up [animation-delay:400ms]">
      <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-4 border border-white/80 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search products, SKU or barcode..."
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex gap-3 items-center">
          <select className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer appearance-none min-w-[160px]">
            <option>All Categories</option>
            <option>Beverages</option>
            <option>Bakery</option>
            <option>Dairy</option>
          </select>

          {/* Navigation Menu Toggle - Store Information */}
          <button 
            onClick={onMenuClick}
            className="p-3 bg-white/50 border border-slate-200 rounded-full text-slate-600 hover:text-blue-600 hover:bg-white transition-all font-bold shadow-sm group"
            title="Store Information"
          >
            <svg className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
};

export default InventoryFilters;
