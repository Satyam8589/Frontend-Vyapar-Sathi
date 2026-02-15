'use client';

import React from 'react';

const InventoryTable = ({ inventory, loading, onEdit, onDelete, onProductClick, lowStockThreshold = 10, currencySymbol = '₹' }) => {
  if (loading && inventory.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-slate-200 p-20 flex flex-col items-center justify-center animate-pulse">
        <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-4"></div>
        <div className="h-4 w-48 bg-slate-200 rounded-lg mb-2"></div>
        <div className="h-3 w-32 bg-slate-100 rounded-lg"></div>
      </div>
    );
  }

  if (!loading && inventory.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-slate-200 p-20 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mb-6">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Empty Inventory</h3>
        <p className="text-slate-500 font-bold italic mt-2">No products found. Start by adding a new asset.</p>
      </div>
    );
  }

  return (
    <section className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up [animation-delay:600ms]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Product Info</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Category</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Stock Qty</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Unit Price</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Exp. Date</th>
              <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Barcode</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventory.map((item) => (
              <tr key={item._id || item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td 
                  className="px-8 py-5 cursor-pointer group/item"
                  onClick={() => onProductClick?.(item)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 overflow-hidden text-[10px] group-hover/item:border-blue-300 transition-colors">
                      IMG
                    </div>
                    <div>
                      <p className="font-black text-slate-900 group-hover/item:text-blue-600 transition-colors">{item.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">View Details</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 text-lg leading-none">{item.quantity || item.qty || 0}</span>
                    <span className={`text-[10px] font-bold uppercase italic mt-1 ${
                      (item.quantity || item.qty) > lowStockThreshold ? 'text-emerald-500' : 
                      (item.quantity || item.qty) > 0 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {(item.quantity || item.qty) > lowStockThreshold ? 'In Stock' : (item.quantity || item.qty) > 0 ? 'Low Stock' : 'Out of Stock'} ({item.unit || 'pieces'})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="font-black text-slate-900">{currencySymbol}{(item.price || 0).toFixed(2)}<span className="text-[10px] text-slate-400 font-bold tracking-tighter ml-0.5">/{(item.unit || 'unit').toLowerCase().replace(/s$/, '')}</span></p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                     <span className={`h-2 w-2 rounded-full ${item.expDate ? (new Date(item.expDate) < new Date('2026-03-01') ? 'bg-amber-500 animate-pulse' : 'bg-emerald-400') : 'bg-slate-300'}`}></span>
                     <span className="font-bold text-slate-600 italic text-sm">{item.expDate ? new Date(item.expDate).toLocaleDateString() : 'No Exp.'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <code className="text-[11px] font-bold bg-slate-50 px-2 py-1 rounded-md text-slate-600 border border-slate-200">
                    {item.barcode}
                  </code>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit?.(item)}
                      className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all" 
                      title="Edit Product"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete?.(item)}
                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all" 
                      title="Delete Product"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {inventory.length} results</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 transition-all hover:border-slate-300">PREV</button>
          <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-900 transition-all hover:border-slate-300">NEXT</button>
        </div>
      </div>
    </section>
  );
};

export default InventoryTable;
