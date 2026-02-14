'use client';

import React from 'react';

/**
 * ProductDetailModal Component - Displays comprehensive information about a specific product.
 */
const ProductDetailModal = ({ isOpen, onClose, product, currencySymbol = '₹' }) => {
  if (!isOpen || !product) return null;

  const lowStockThreshold = 10;
  const currentStock = product.quantity || product.qty || 0;
  const isLowStock = currentStock <= lowStockThreshold && currentStock > 0;
  const isOutOfStock = currentStock === 0;

  return (
    <div className="fixed top-24 inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-up">
        {/* Decorative Header Background */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-slate-900 to-slate-800 -z-10" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pt-12">
          {/* Hero section with Product Identifiers */}
          <div className="flex items-start gap-6 mb-10">
            <div className="h-24 w-24 rounded-3xl bg-white shadow-xl flex items-center justify-center font-black text-slate-300 border border-slate-100 overflow-hidden text-sm uppercase italic">
              Asset
            </div>
            <div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                {product.category || 'General'}
              </span>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                {product.name}
              </h2>
            </div>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Level</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">{currentStock}</span>
                <span className="text-sm font-bold text-slate-500 pb-1 italic">{product.unit || 'Units'}</span>
              </div>
              <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                isOutOfStock ? 'bg-red-100 text-red-600' : 
                isLowStock ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                {isOutOfStock ? 'Critical: Out of Stock' : isLowStock ? 'Alert: Low Stock' : 'Optimized'}
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Valuation</p>
              <div className="flex items-end justify-end gap-1">
                <span className="text-3xl font-black text-slate-900">{currencySymbol}{(product.price || 0).toFixed(2)}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 italic mt-1">Net Price per Unit</p>
            </div>
          </div>

          {/* Secondary Details List */}
          <div className="space-y-4 px-2">
            <div className="flex justify-between items-center py-3 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Universal Barcode</span>
              </div>
              <span className="text-sm font-bold text-slate-900 select-all">{product.barcode || 'NO-BARCODE'}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Expiration Date</span>
              </div>
              <span className={`text-sm font-bold ${product.expDate ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                {product.expDate ? new Date(product.expDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No data provided'}
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-10">
            <button 
              onClick={onClose}
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
            >
              Back to Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
