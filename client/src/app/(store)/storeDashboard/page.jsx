'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreDashboard } from '@/features/storeDashboard/hooks/useStoreDashboard';
import { StoreList } from '@/features/storeDashboard/components';

/**
 * Store Dashboard Page
 * Displays all stores for the current user with option to create new store
 */
const StoreDashboard = () => {
  const router = useRouter();
  const {
    stores,
    loading,
    error,
    filters,
    updateFilters,
    refreshStores
  } = useStoreDashboard();

  // Handle store click
  const handleStoreClick = (store) => {
    // Navigate to store details page (to be implemented)
    console.log('Store clicked:', store);
    // router.push(`/store/${store._id}`);
  };

  // Handle create store
  const handleCreateStore = () => {
    router.push('/createStore');
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-blue-500/20 antialiased overflow-x-hidden">
      {/* Fixed Background Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-rad-yb"></div>
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] animate-blob"></div>
        <div className="absolute top-[60%] left-[80%] w-40 h-40 bg-yellow-600/10 rounded-full blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[10%] right-[15%] w-24 h-24 bg-amber-400/10 rounded-full blur-[50px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[20%] left-[30%] w-36 h-36 bg-yellow-700/10 rounded-full blur-[70px] animate-blob"></div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <div className="absolute inset-0 bg-noise opacity-[0.02] contrast-150 brightness-100"></div>
        <div className="absolute inset-0 bg-mesh-light opacity-40"></div>
      </div>

      <main className="relative z-10">
        {/* Header */}
        <section className="pt-12 pb-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/90 shadow-sm backdrop-blur-sm mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Command Center
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                  MY STORES
                </h1>
                <p className="mt-4 text-lg text-slate-600 font-bold italic max-w-xl">
                  Manage and monitor your entire retail network from one central interface.
                </p>
              </div>
              
              <div className="animate-fade-in-up [animation-delay:200ms]">
                <button
                  onClick={handleCreateStore}
                  className="btn-primary-yb py-4 px-8 shadow-lg shadow-blue-500/10 flex items-center gap-2 group"
                >
                  <svg 
                    className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-black uppercase tracking-widest">Create New Store</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up [animation-delay:300ms]">
              {[
                { label: 'Total Stores', value: loading ? '...' : stores.length, color: 'blue' },
                { label: 'Active', value: loading ? '...' : stores.length, color: 'emerald' },
                { label: 'Retail', value: loading ? '...' : stores.filter(s => s.businessType === 'retail').length, color: 'violet' },
                { label: 'Wholesale', value: loading ? '...' : stores.filter(s => s.businessType === 'wholesale').length, color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black text-slate-900`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-4 px-4 md:px-6">
          <div className="max-w-7xl mx-auto transition-all duration-300 animate-fade-in-up [animation-delay:400ms]">
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-4 border border-white/80 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 max-w-md relative group">
                  <input
                    type="text"
                    placeholder="Search stores..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-bold"
                  />
                  <svg 
                    className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={filters.businessType}
                    onChange={(e) => updateFilters({ businessType: e.target.value })}
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                  </select>

                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value })}
                    className="px-4 py-3 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="created-desc">Newest</option>
                    <option value="name-asc">A-Z</option>
                  </select>

                  <button
                    onClick={refreshStores}
                    className="p-3 bg-white/50 border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:bg-white transition-all shadow-sm"
                    title="Refresh"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Store List */}
        <section className="px-4 md:px-6 pb-20 mt-8 animate-fade-in-up [animation-delay:500ms]">
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

export default StoreDashboard;
