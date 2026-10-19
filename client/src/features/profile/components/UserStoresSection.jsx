'use client';

import React from 'react';
import Link from 'next/link';

export default function UserStoresSection({ stores = [] }) {
  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Associated Stores ({stores.length})</h2>
            <p className="text-xs text-slate-500">Retail and wholesale outlets linked to your account</p>
          </div>
        </div>

        <Link
          href="/createStore"
          className="btn-primary-yb py-2 px-3 sm:px-4 text-xs font-bold shadow-sm flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Store</span>
        </Link>
      </div>

      <div className="p-6 sm:p-8">
        {stores.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-slate-800">No stores created yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first retail counter or wholesale business to start managing billing and inventory.
            </p>
            <Link
              href="/createStore"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <span>Create First Store</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => {
              const initials = store.name?.substring(0, 2).toUpperCase() || 'ST';
              const isOwner = !store.isEmployee;

              return (
                <div
                  key={store._id}
                  className="group relative p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-400/60 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate" title={store.name}>
                        {store.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                          {store.businessType || 'Retail'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isOwner ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {isOwner ? 'Owner' : 'Staff'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/storeDashboard/${store._id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white group-hover:bg-blue-600 border border-slate-200 group-hover:border-blue-600 text-slate-700 group-hover:text-white text-xs font-bold transition-all"
                  >
                    <span>Open Store Workspace</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
