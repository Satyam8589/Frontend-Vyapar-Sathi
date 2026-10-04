"use client";

import { useRouter } from "next/navigation";
import { usePurchasePage } from "../hooks/usePurchasePage";

import PurchaseFormModal from "./PurchaseFormModal";

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

export default function PurchasePage() {
  const router = useRouter();
  const {
    storeId,
    purchases, loading, error,
    search, setSearch,
    paymentStatusFilter, setPaymentStatusFilter,
    page, setPage, totalPages, total,
    isAddModalOpen, setIsAddModalOpen,
    actionLoading, handleAddPurchase
  } = usePurchasePage();

  return (
    <div className="min-h-screen pb-8 sm:pb-12">
      {/* Purchase Form Modal */}
      <PurchaseFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPurchase}
        loading={actionLoading}
        storeId={storeId}
      />

      <div className="w-full px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 max-w-7xl mx-auto">
        {/* Header */}
        <section className="mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between gap-2 sm:gap-3 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 truncate tracking-tight">
                Purchase Management
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/storeDashboard/${storeId}/purchases/analytics`)}
                className="flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                title="View Purchase Analytics"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button
                onClick={() => router.push(`/storeDashboard/${storeId}/purchases/orders`)}
                className="flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                title="Manage Purchase Orders"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden sm:inline">Purchase Orders</span>
              </button>
              <button
                onClick={() => router.push(`/storeDashboard/${storeId}/purchases/grns`)}
                className="flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                title="Manage GRNs"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="hidden sm:inline">GRNs</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex-shrink-0 btn-primary-yb py-2 sm:py-2.5 px-3 sm:px-4 shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add Purchase</span>
              </button>
            </div>
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
              placeholder="Search by Invoice Number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="block w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 font-medium"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
              className="flex-1 sm:w-40 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-slate-700 cursor-pointer appearance-none"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </section>

        {/* Purchases Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative z-0">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3 sm:py-4 font-bold">Invoice No</th>
                  <th className="px-4 py-3 sm:py-4 font-bold">Seller</th>
                  <th className="px-4 py-3 sm:py-4 font-bold">Date</th>
                  <th className="px-4 py-3 sm:py-4 font-bold text-right">Grand Total</th>
                  <th className="px-4 py-3 sm:py-4 font-bold text-right">Paid</th>
                  <th className="px-4 py-3 sm:py-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs sm:text-sm">
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : purchases.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-medium text-base">No purchases found</p>
                        <p className="text-slate-400 mt-1">Try adjusting your filters or add a new purchase.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr 
                      key={purchase._id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/storeDashboard/${storeId}/purchases/${purchase._id}`)}
                    >
                      <td className="px-4 py-3 sm:py-4 font-bold text-slate-800">
                        {purchase.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 sm:py-4 text-slate-600 font-medium">
                        {purchase.seller?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 sm:py-4 text-slate-500">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 sm:py-4 font-black text-slate-900 text-right">
                        {currencyFormat(purchase.grandTotal)}
                      </td>
                      <td className="px-4 py-3 sm:py-4 font-bold text-emerald-600 text-right">
                        {currencyFormat(purchase.paidAmount)}
                      </td>
                      <td className="px-4 py-3 sm:py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold ${
                            purchase.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                            purchase.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {purchase.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="bg-white border-t border-slate-100 px-4 py-3 sm:py-4 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden sm:block">
                Showing <span className="font-bold text-slate-900">{(page - 1) * 10 + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * 10, total)}</span> of <span className="font-bold text-slate-900">{total}</span> results
              </p>
              <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold border border-slate-200 rounded-lg disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 transition-colors text-slate-700"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold border border-slate-200 rounded-lg disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 transition-colors text-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
