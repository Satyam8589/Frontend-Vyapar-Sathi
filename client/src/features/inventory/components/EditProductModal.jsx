'use client';

import React, { useState, useEffect } from 'react';

const EditProductModal = ({ isOpen, onClose, onUpdate, loading, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    qty: '',
    unit: 'Pieces',
    price: '',
    expDate: '',
    barcode: '',
  });

  // Populate form when product changes
  useEffect(() => {
    if (isOpen && product) {
      // Format date to YYYY-MM-DD for input type="date"
      let formattedDate = '';
      if (product.expDate) {
        try {
          const date = new Date(product.expDate);
          formattedDate = date.toISOString().split('T')[0];
        } catch (e) {
          console.error("Invalid date format:", product.expDate);
        }
      }

      setFormData({
        name: product.name || '',
        category: product.category || 'General',
        qty: (product.quantity || product.qty || 0).toString(),
        unit: product.unit || 'Pieces',
        price: (product.price || 0).toString(),
        expDate: formattedDate,
        barcode: product.barcode || '',
      });
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      _id: product._id,
      quantity: Number(formData.qty),
      price: Number(formData.price)
    };
    
    onUpdate?.(submissionData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed top-24 inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-y-auto max-h-[calc(100vh-8rem)] animate-scale-up scrollbar-hide">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              Update Asset
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Modifying <span className="text-blue-600">"{product?.name}"</span> in your inventory
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Product Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>

            {/* Department */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Department</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 cursor-pointer appearance-none"
              >
                <option>General</option>
                <option>Beverages</option>
                <option>Bakery</option>
                <option>Dairy</option>
                <option>Produce</option>
                <option>Pantry</option>
              </select>
            </div>

            {/* Qty & Unit */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Current Stock</label>
              <input
                required
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 cursor-pointer appearance-none"
              >
                <option>Pieces</option>
                <option>kg</option>
                <option>Liters</option>
                <option>Packs</option>
                <option>Bottles</option>
              </select>
            </div>

            {/* Price & Exp Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Unit Price (₹)</label>
              <input
                required
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Expiry Date</label>
              <input
                type="date"
                name="expDate"
                value={formData.expDate}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 cursor-pointer"
              />
            </div>

            {/* Barcode */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Barcode / EAN</label>
              <input
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-10 flex gap-4">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary-yb py-4 font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              <span>{loading ? 'Updating...' : 'Commit Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
