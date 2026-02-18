'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import { useStoreDashboard } from '@/features/storeDashboard/hooks/useStoreDashboard';
import { StoreList } from '@/features/storeDashboard/components';

/**
 * Store Dashboard Page
 */
const StoreDashboard = () => {
  const router = useRouter();
  const { stores, loading, error, filters, updateFilters, refreshStores } = useStoreDashboard();

  const handleStoreClick = (store) => {
    router.push(`/storeDashboard/${store._id}`);
  };

  const handleCreateStore = () => {
    router.push('/createStore');
  };

  const stats = [
    { label: 'Total Stores', value: loading ? '...' : stores.length },
    { label: 'Active',        value: loading ? '...' : stores.length },
    { label: 'Retail',        value: loading ? '...' : stores.filter(s => s.businessType === 'retail').length },
    { label: 'Wholesale',     value: loading ? '...' : stores.filter(s => s.businessType === 'wholesale').length },
  ];

  return (
    <div className="flex flex-col relative selection:bg-blue-500/20 antialiased">
      <main className="relative z-10">

        {/* ── Header ── */}
        <section className="pt-6 pb-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/70 border border-white/90 shadow-sm backdrop-blur-sm mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Command Center</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">MY STORES</h1>
                <p className="mt-2 text-sm md:text-base text-slate-600 font-bold italic max-w-xl">
                  Manage and monitor your entire retail network from one central interface.
                </p>
              </div>

              <div className="animate-fade-in-up [animation-delay:200ms] flex items-center gap-2">
                <button
                  onClick={handleCreateStore}
                  className="btn-primary-yb py-3 px-6 shadow-lg shadow-blue-500/10 flex items-center gap-2 group text-sm"
                >
                  <svg className="h-4 w-4 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-black uppercase tracking-widest">Create New Store</span>
                </button>

                <MobileStorePanel
                  filters={filters}
                  updateFilters={updateFilters}
                  refreshStores={refreshStores}
                  stats={stats}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── Stats Bar — desktop only ── */}
        <section className="hidden md:block py-3 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-4 gap-3 animate-fade-in-up [animation-delay:300ms]">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Search & Filters ── */}
        <section className="py-3 px-4 md:px-6">
          <div className="max-w-7xl mx-auto transition-all duration-300 animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-white/80 rounded-2xl p-3 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                <div className="flex-1 max-w-md relative group">
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-bold"
                  />
                  <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <select
                    value={filters.businessType}
                    onChange={(e) => updateFilters({ businessType: e.target.value })}
                    className="px-3 py-2.5 text-sm bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                  </select>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                    className="px-3 py-2.5 text-sm bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="created-desc">Newest</option>
                    <option value="name-asc">A-Z</option>
                  </select>

                  <button
                    onClick={refreshStores}
                    className="p-2.5 bg-white/50 border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-white transition-all shadow-sm"
                    title="Refresh"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── Store List ── */}
        <section className="px-4 md:px-6 pb-12 mt-4 animate-fade-in-up [animation-delay:500ms]">
          <div className="max-w-7xl mx-auto">
            <StoreList
              stores={stores}
              loading={loading}
              error={error}
              onStoreClick={handleStoreClick}
              viewMode="grid"
            />
          </div>
        </section>

      </main>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   StoreModalContent — the actual modal UI, rendered via portal
   Kept as a separate component so React properly manages event handlers
───────────────────────────────────────────────────────────────────────────── */
const StoreModalContent = ({ open, onClose, filters, updateFilters, refreshStores, stats }) => {
  return ReactDOM.createPortal(
    <>
      {/* Blurred backdrop */}
      <div
        onClick={onClose}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        className={[
          'fixed inset-0 z-[99998]',
          'bg-slate-900/50 backdrop-blur-sm',
          'transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* Centred card */}
      <div
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        className={[
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[88vw] max-w-sm z-[99999]',
          'transition-all duration-300 origin-center',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
        ].join(' ')}
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/30 overflow-hidden border border-slate-200/60">

          {/* Gradient header */}
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 pt-5 pb-6">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-8 -translate-x-8 pointer-events-none" />

            {/* ✕ Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/40 text-white transition-all duration-200 z-20"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-200">Command Center</p>
                <h2 className="text-lg font-black text-white tracking-tight leading-none">Store Overview</h2>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-1 mt-4 relative z-10">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black text-white leading-none">{stat.value}</p>
                  <p className="text-[8px] font-bold text-blue-200 uppercase tracking-wide mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filter controls */}
          <div className="px-5 py-4 space-y-3 bg-slate-50/60">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Filters</p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</label>
              <div className="relative">
                <select
                  value={filters.businessType}
                  onChange={(e) => updateFilters({ businessType: e.target.value })}
                  className="w-full px-3 py-2.5 pr-8 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="all">All Types</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                </select>
                <svg className="absolute right-2.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="w-full px-3 py-2.5 pr-8 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="created-desc">Newest First</option>
                  <option value="name-asc">Name A–Z</option>
                </select>
                <svg className="absolute right-2.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { refreshStores(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Stores
            </button>
          </div>

        </div>
      </div>
    </>,
    document.body
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MobileStorePanel — store-sign trigger button + modal (mobile only)
───────────────────────────────────────────────────────────────────────────── */
const MobileStorePanel = ({ filters, updateFilters, refreshStores, stats }) => {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Only render portal after client mount (avoids SSR mismatch)
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <div className="md:hidden">
      {/* Store-sign trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open store overview"
        className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <svg className="h-5 w-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="text-[7px] font-black uppercase tracking-widest text-blue-100 relative z-10 leading-none">
          STORES
        </span>
      </button>

      {/* Portal modal — only after client mount */}
      {mounted && (
        <StoreModalContent
          open={open}
          onClose={() => setOpen(false)}
          filters={filters}
          updateFilters={updateFilters}
          refreshStores={refreshStores}
          stats={stats}
        />
      )}
    </div>
  );
};

export default StoreDashboard;
