'use client';

import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

/**
 * DeleteStoreModal - Custom red popup for store deletion
 */
const DeleteStoreModal = ({ isOpen, onClose, onConfirm, storeName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300">
        <div className="relative flex flex-col w-full bg-white border border-rose-100 rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          {/* Top Warning Banner */}
          <div className="h-2 w-full bg-rose-500" />
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 pt-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase mb-3">
              Confirm Deletion
            </h3>
            <p className="text-slate-600 font-bold italic leading-relaxed">
              Are you sure you want to remove <span className="text-rose-600 not-italic">"{storeName}"</span>? 
              This action will hide the shop and all its data from your dashboard.
            </p>
            
            <div className="mt-6 p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-start gap-3">
               <div className="mt-0.5 text-rose-500 font-black">!</div>
               <p className="text-[11px] font-bold text-rose-700 leading-tight">
                 WARNING: This shop will no longer be accessible to you or your staff. This cannot be undone from the UI.
               </p>
            </div>
          </div>

          {/* Footer - Actions */}
          <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-95 border border-slate-200"
            >
              No, Keep it
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
              Delete Permanently
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeleteStoreModal;
