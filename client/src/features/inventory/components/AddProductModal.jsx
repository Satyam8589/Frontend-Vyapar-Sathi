'use client';

import React, { useState, useEffect } from 'react';

const AddProductModal = ({ isOpen, onClose, onAction, loading, editingProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    qty: '',
    unit: 'Pieces',
    price: '',
    expDate: '',
    barcode: '',
  });

  // Reset/Populate form when modal opens or editingProduct changes
  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        // Format date to YYYY-MM-DD for input type="date"
        let formattedDate = '';
        if (editingProduct.expDate) {
          const date = new Date(editingProduct.expDate);
          formattedDate = date.toISOString().split('T')[0];
        }

        setFormData({
          name: editingProduct.name || '',
          category: editingProduct.category || 'General',
          qty: (editingProduct.quantity || editingProduct.qty || 0).toString(),
          unit: editingProduct.unit || 'Pieces',
          price: (editingProduct.price || 0).toString(),
          expDate: formattedDate,
          barcode: editingProduct.barcode || '',
        });
      } else {
        setFormData({
          name: '',
          category: 'General',
          qty: '',
          unit: 'Pieces',
          price: '',
          expDate: '',
          barcode: '',
        });
      }
    }
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map qty to quantity as expected by the backend and ensure numeric types
    const submissionData = {
      ...formData,
      quantity: Number(formData.qty),
      price: Number(formData.price)
    };
    
    // If editing, include the ID
    if (editingProduct) {
      submissionData._id = editingProduct._id;
    }
    
    onAction?.(submissionData);
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
              {editingProduct ? 'Update Asset' : 'Add New Asset'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {editingProduct ? `Modifying ${editingProduct.name}` : 'Register a new product to your inventory'}
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
                placeholder="Ex: Organic Almond Milk"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>

            {/* Department (Full Width now that SKU is gone) */}
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
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Initial Qty</label>
              <input
                required
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Unit of Measure</label>
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
                placeholder="0.00"
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

            {/* Barcode with Scanner Button */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Barcode / EAN</label>
              <div className="relative group flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="Scan or enter barcode"
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-900"
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                
                <button 
                  type="button"
                  className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-500/20 active:scale-95 group/scan"
                >
                  <svg className="h-5 w-5 animate-pulse group-hover/scan:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h10" />
                  </svg>
                  <span>Scan</span>
                </button>
              </div>
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary-yb py-4 font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              <span>{loading ? 'Processing...' : (editingProduct ? 'Commit Changes' : 'Initialize Stocks')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
