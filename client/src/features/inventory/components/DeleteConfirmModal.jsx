'use client';

import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, loading, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop with extreme blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-red-100 overflow-hidden animate-scale-up">
        {/* Danger Pattern Header */}
        <div className="h-32 bg-red-50 relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-xl shadow-red-500/10 flex items-center justify-center text-red-500 animate-bounce-subtle">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
            Secure Deletion
          </h2>
          <p className="mt-4 text-slate-500 font-bold leading-relaxed px-4">
            Are you absolutely sure you want to remove <span className="text-red-500 italic font-black">"{productName || 'this item'}"</span> from your database?
          </p>
          <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 py-2 inline-block px-4 rounded-full">
            This action cannot be undone
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 pt-0 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-[1.5] px-6 py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Permanently Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
