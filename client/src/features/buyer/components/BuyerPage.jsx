"use client";

import { useBuyerPage } from "../hooks/useBuyerPage";
import BuyerFormModal from "./BuyerFormModal";

const currencyFormat = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-slate-100 rounded-lg" />
      </td>
    ))}
  </tr>
);

export default function BuyerPage() {
  const {
    buyers, loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    page, setPage, totalPages, total,
    isAddModalOpen, setIsAddModalOpen,
    editBuyer, setEditBuyer,
    actionLoading,
    handleAddBuyer, handleEditBuyer, handleDeleteBuyer,
  } = useBuyerPage();

  return (
    <div className="min-h-screen pb-8 sm:pb-12">
      {/* Add Modal */}
      <BuyerFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBuyer}
        loading={actionLoading}
      />

      {/* Edit Modal */}
      <BuyerFormModal
        isOpen={!!editBuyer}
        onClose={() => setEditBuyer(null)}
        onSubmit={handleEditBuyer}
        loading={actionLoading}
        buyer={editBuyer}
      />

      <div className="w-full px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 max-w-7xl mx-auto">
        {/* Header */}
        <section className="mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between gap-2 sm:gap-3 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 truncate tracking-tight">
                  Buyer Management
                </h1>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  {total} buyer{total !== 1 ? "s" : ""} total
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add Buyer</span>
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-medium text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Filters */}
        <section className="mb-4 bg-white rounded-2xl border border-slate-100 p-2 sm:p-3 shadow-sm flex flex-col sm:flex-row gap-2 sm:gap-4 z-10 relative">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="block w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex-1 sm:w-36 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        {/* Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 sm:py-4 font-bold">Name</th>
                  <th className="px-4 py-3 sm:py-4 font-bold">Phone</th>
                  <th className="px-4 py-3 sm:py-4 font-bold">Email</th>
                  <th className="px-4 py-3 sm:py-4 font-bold text-right">Total Sales</th>
                  <th className="px-4 py-3 sm:py-4 font-bold text-right">Due</th>
                  <th className="px-4 py-3 sm:py-4 font-bold text-center">Status</th>
                  <th className="px-4 py-3 sm:py-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : buyers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-medium text-base">No buyers found</p>
                        <p className="text-slate-400 mt-1">Add your first buyer to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  buyers.map((buyer) => (
                    <tr key={buyer._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-emerald-700">
                              {buyer.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{buyer.name}</div>
                            {buyer.GSTIN && (
                              <div className="text-[10px] text-slate-400 font-mono">{buyer.GSTIN}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:py-4 text-slate-600 font-medium">{buyer.phone}</td>
                      <td className="px-4 py-3 sm:py-4 text-slate-500">{buyer.email || '—'}</td>
                      <td className="px-4 py-3 sm:py-4 font-black text-slate-900 text-right">
                        {currencyFormat(buyer.totalSales)}
                      </td>
                      <td className="px-4 py-3 sm:py-4 font-bold text-right">
                        <span className={buyer.totalDue > 0 ? "text-rose-600" : "text-slate-400"}>
                          {currencyFormat(buyer.totalDue)}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            buyer.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {buyer.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:py-4">
                        <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditBuyer(buyer)}
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteBuyer(buyer._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Page {page} of {totalPages} · {total} buyers
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  ← Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
