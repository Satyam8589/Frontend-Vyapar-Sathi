'use client';

import React from 'react';

/**
 * StoreDetailsSidebar - A slide-over panel that displays comprehensive store information.
 */
const StoreDetailsSidebar = ({ isOpen, onClose, store }) => {
  if (!store) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 top-24 bg-slate-900/40 backdrop-blur-sm z-[110] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-24 left-0 h-[calc(100vh-6rem)] w-full max-w-sm bg-white shadow-2xl z-[120] transition-transform duration-500 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Store Profile</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          {/* Logo & Basic Info */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-xl mb-4 border-4 border-white">
              {store.name?.substring(0, 2).toUpperCase() || 'ST'}
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{store.name}</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border border-blue-100">
              {store.businessType || 'Retailer'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-8">
            {/* Contact Section */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Gateway</h4>
              <div className="space-y-4">
                <DetailRow 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                  label="Direct Phone"
                  value={store.phone}
                />
                <DetailRow 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                  label="Official Email"
                  value={store.email || 'Not Available'}
                />
              </div>
            </div>

            {/* Logistics Section */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Location & Logistics</h4>
              <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 flex-shrink-0">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 mb-1">Base of Operations</p>
                    <p className="text-sm font-bold text-slate-500 leading-relaxed italic">
                      {store.address?.fullAddress || `${store.address?.city}, ${store.address?.state}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Config */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">System Parameters</h4>
              <div className="grid grid-cols-2 gap-3">
                <ConfigCard label="Threshold" value={`${store.settings?.lowStockThreshold || 10} Units`} color="amber" />
                <ConfigCard label="Alerts" value={`${store.settings?.expiryAlertDays || 7} Days`} color="blue" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">
            Authorized Vyapar Sathi Access
          </p>
        </div>
      </aside>
    </>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shadow-sm">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const ConfigCard = ({ label, value, color }) => {
  const colors = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  
  return (
    <div className={`${colors[color]} p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-1`}>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-sm font-black">{value}</p>
    </div>
  );
};

export default StoreDetailsSidebar;
