'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';

const CreationFlowModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading, 
  success, 
  storeName, 
  storeId,
  error 
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleEnterStore = () => {
    if (storeId) {
      router.push(`/storeDashboard/${storeId}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" 
        onClick={!loading && !success ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-10 text-center animate-scale-up">
        
        {loading ? (
          /* Loading State */
          <div className="space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <div className="h-10 w-10 border-[3px] border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              Initializing Store...
            </h2>
            
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mx-auto">
              Please wait while we set up your business environment...
            </p>
          </div>
        ) : success ? (
          /* Success State */
          <div className="animate-scale-up">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/40 relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20" />
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-3">
              Congratulations!
            </h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 leading-relaxed max-w-[240px] mx-auto">
              Your business <span className="text-blue-600">"{storeName}"</span> has been successfully registered.
            </p>

            <Button
              variant="primary"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-sm mb-4"
              onClick={handleEnterStore}
            >
              Enter Your Store
            </Button>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Ready for operations
            </p>
          </div>
        ) : error ? (
           /* Error State */
           <div className="space-y-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-red-900 tracking-tighter uppercase">Creation Failed</h2>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-600 text-[10px] font-black uppercase tracking-widest">
              {error}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all text-[10px]"
            >
              Go Back & Fix
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CreationFlowModal;
