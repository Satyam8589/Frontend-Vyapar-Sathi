'use client';

import React from 'react';

const InventoryFilters = ({ searchTerm, setSearchTerm }) => {
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
        
        <div className="flex gap-3">
          <select className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer">
            <option>All Categories</option>
            <option>Beverages</option>
            <option>Bakery</option>
            <option>Dairy</option>
          </select>
          <button className="p-3 bg-white/50 border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 transition-all font-bold">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4.5h18m-18 5h18m-18 5h18m-18 5h18" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InventoryFilters;
