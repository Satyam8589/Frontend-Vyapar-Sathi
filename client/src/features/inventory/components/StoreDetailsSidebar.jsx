'use client';

import React from 'react';

/**
 * StoreDetailsSidebar - A performance-optimized slide-over panel for store information.
 */
const StoreDetailsSidebar = ({ isOpen, onClose, store }) => {
  if (!store) return null;

  return (
    <>
      {/* Backdrop - Simplified for performance */}
      <div 
        className={`fixed inset-0 top-24 bg-slate-900/40 z-[110] transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel - Optimized with hardware acceleration */}
      <aside 
        className={`fixed top-24 left-0 h-[calc(100vh-6rem)] w-full max-w-sm bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.12)] z-[120] border-r border-slate-100 will-change-transform transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Header - Optimized */}
        <div className="relative overflow-hidden p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="relative z-10 transition-opacity duration-300">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Store <span className="text-indigo-600">Hub</span>
            </h2>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-indigo-500"></span>
              Management Terminal
            </p>
          </div>
          <button 
            onClick={onClose}
            className="group relative z-10 p-2.5 bg-slate-50 hover:bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-colors duration-300 border border-slate-100 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Optimized scrolling */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
          {/* Identity Section */}
          <div className="flex flex-col items-center text-center">
            <div className="relative h-28 w-28 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white overflow-hidden">
              <span className="relative z-10">
                {store.name?.substring(0, 2).toUpperCase() || 'ST'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/50 to-transparent"></div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                {store.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                  {store.businessType || 'Premium Retailer'}
                </span>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info Sections */}
          <div className="space-y-10">
            {/* About Section */}
            {store.description && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[2px] w-6 bg-slate-200"></div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Narrative</h4>
                  <div className="h-[2px] flex-1 bg-slate-100"></div>
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50/50 p-5 rounded-3xl border border-slate-100 italic">
                  {store.description}
                </p>
              </div>
            )}

            {/* Communication Gateway */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-6 bg-indigo-500/20"></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Connect</h4>
                <div className="h-[2px] flex-1 bg-indigo-500/10"></div>
              </div>
              <div className="grid gap-5">
                <DetailRow 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                  label="Secure Line"
                  value={store.phone}
                  color="blue"
                />
                <DetailRow 
                  icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                  label="Official Channel"
                  value={store.email || 'Encrypted - N/A'}
                  color="indigo"
                />
              </div>
            </div>

            {/* Logistics Module */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-6 bg-violet-500/20"></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Locate</h4>
                <div className="h-[2px] flex-1 bg-violet-500/10"></div>
              </div>
              <div className="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-100">
                <div className="flex gap-4 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-violet-500 shadow-sm border border-slate-50">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <circle cx="12" cy="10" r="3" strokeWidth={2} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Operations</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                      {store.address?.fullAddress || `${store.address?.city}, ${store.address?.state}`}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/50 text-center">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pincode</p>
                    <p className="text-xs font-bold text-slate-700">{store.address?.pincode || '400001'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Region</p>
                    <p className="text-xs font-bold text-slate-700">{store.address?.country || 'India'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Module */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-6 bg-amber-500/20"></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Currency</h4>
                <div className="h-[2px] flex-1 bg-amber-500/10"></div>
              </div>
              <div className="bg-amber-50/50 rounded-3xl p-5 flex items-center justify-between border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white border border-amber-100 flex items-center justify-center text-amber-600 font-black">
                    {store.settings?.currency === 'INR' ? '₹' : store.settings?.currency}
                  </div>
                  <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Base Currency</p>
                </div>
                <span className="text-xs font-black text-primary-yb">{store.settings?.currency || 'INR'}</span>
              </div>
            </div>

            {/* Control Parameters */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400 pb-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[2px] w-6 bg-emerald-500/20"></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Configs</h4>
                <div className="h-[2px] flex-1 bg-emerald-500/10"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ConfigCard label="Threshold" value={`${store.settings?.lowStockThreshold || 10}`} suffix="UNITS" color="amber" />
                <ConfigCard label="Monitoring" value={`${store.settings?.expiryAlertDays || 7}`} suffix="DAYS" color="emerald" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-white shrink-0">
          <div className="flex flex-col items-center gap-2 opacity-50 cursor-default">
            <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.5em]">
              VYAPAR SATHI OS
            </p>
            <div className="h-0.5 w-8 bg-slate-900 rounded-full"></div>
          </div>
        </div>
      </aside>
    </>
  );
};

const DetailRow = ({ icon, label, value, color }) => {
  const themes = {
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
  };

  return (
    <div className="flex items-center gap-5 p-2 rounded-3xl">
      <div className={`h-11 w-11 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors duration-300 ${themes[color]}`}>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">{label}</p>
        <p className="text-sm font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

const ConfigCard = ({ label, value, suffix, color }) => {
  const colors = {
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };
  
  return (
    <div className={`${colors[color]} p-5 rounded-[2rem] border flex flex-col items-center justify-center text-center gap-1 shadow-sm transition-transform duration-300 hover:scale-[1.02]`}>
      <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black">{value}</span>
        <span className="text-[8px] font-bold opacity-50">{suffix}</span>
      </div>
    </div>
  );
};

export default StoreDetailsSidebar;
