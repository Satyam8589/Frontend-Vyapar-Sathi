"use client";

import { useSellerPage } from "../hooks/useSellerPage";
import SellerFormModal from "./SellerFormModal";
import SellerDeleteModal from "./SellerDeleteModal";
import SellerDetailModal from "./SellerDetailModal";

const currencyFormat = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4 flex items-center gap-4">
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-slate-100 rounded-lg" />
      </td>
    ))}
  </tr>
);

export default function SellerPage() {
  const {
    sellers, stats, loading, statsLoading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    page, setPage, totalPages, total,
    isAddModalOpen, setIsAddModalOpen,
    isEditModalOpen, setIsEditModalOpen,
    isDeleteModalOpen, setIsDeleteModalOpen,
    isDetailModalOpen, setIsDetailModalOpen,
    selectedSeller,
    actionLoading,
    handleAddSeller,
    handleEditSeller,
    handleDeleteSeller,
    openEditModal,
    openDeleteModal,
    openDetailModal,
  } = useSellerPage();

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "S";

  return (
    <div className="min-h-screen pb-8 sm:pb-12">
      <div className="w-full px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 max-w-7xl mx-auto">

        {/* Header */}
        <section className="mb-4 animate-fade-in-up">
          <div className="flex items-center justify-between gap-2 sm:gap-3 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 truncate tracking-tight">
                Seller Management
              </h1>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-shrink-0 btn-primary-yb py-2 sm:py-2.5 px-3 sm:px-4 shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add Seller</span>
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-medium text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Stats */}
        <section className="mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statsLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="h-8 bg-slate-100 rounded-lg mb-2" />
                <div className="h-3 bg-slate-100 rounded-lg w-2/3" />
              </div>
            ))
          ) : (
            <>
              <StatCard
                label="Total Sellers"
                value={stats?.totalSellers ?? "—"}
                color="bg-gradient-to-br from-indigo-500 to-purple-600"
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              />
              <StatCard
                label="Active Sellers"
                value={stats?.activeSellers ?? "—"}
                color="bg-gradient-to-br from-green-500 to-emerald-600"
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard
                label="Total Purchases"
                value={currencyFormat(stats?.totalPurchaseAmount)}
                color="bg-gradient-to-br from-blue-500 to-cyan-600"
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              />
              <StatCard
                label="Total Paid"
                value={currencyFormat(stats?.totalPaid)}
                color="bg-gradient-to-br from-teal-500 to-green-600"
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard
                label="Outstanding Due"
                value={currencyFormat(stats?.totalDue)}
                color={`bg-gradient-to-br ${(stats?.totalDue ?? 0) > 0 ? "from-red-500 to-rose-600" : "from-slate-400 to-slate-500"}`}
                icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </>
          )}
        </section>

        {/* Filters */}
        <section className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">
              {loading ? "Loading..." : `${total} seller${total !== 1 ? "s" : ""} found`}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Contact</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">Total Purchase</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">Paid</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">Due</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : sellers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                          <svg className="h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-semibold">No sellers found</p>
                        <p className="text-slate-400 text-xs">
                          {search ? "Try adjusting your search" : "Add your first supplier to get started"}
                        </p>
                        {!search && (
                          <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all"
                          >
                            + Add First Seller
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  sellers.map((seller) => (
                    <tr
                      key={seller._id}
                      className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                      onClick={() => openDetailModal(seller)}
                    >
                      {/* Seller info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-indigo-700 text-xs font-black flex-shrink-0">
                            {getInitials(seller.name)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{seller.name}</p>
                            {seller.businessName && (
                              <p className="text-xs text-slate-500 font-medium">{seller.businessName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Contact */}
                      <td className="px-4 py-3.5">
                        <p className="text-slate-800 font-medium text-sm">{seller.phone}</p>
                        {seller.email && (
                          <p className="text-xs text-slate-400 font-medium">{seller.email}</p>
                        )}
                      </td>
                      {/* Financials */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-bold text-slate-800">{currencyFormat(seller.totalPurchase)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="font-bold text-green-600">{currencyFormat(seller.totalPaid)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`font-bold ${seller.totalDue > 0 ? "text-red-600" : "text-slate-400"}`}>
                          {currencyFormat(seller.totalDue)}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          seller.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {seller.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openEditModal(seller)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="Edit"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteModal(seller)}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          {!loading && totalPages > 1 && (
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500 font-medium">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-slate-300 disabled:opacity-40 transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:border-slate-300 disabled:opacity-40 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      <SellerFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSeller}
        loading={actionLoading}
        seller={null}
      />
      <SellerFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSeller}
        loading={actionLoading}
        seller={selectedSeller}
      />
      <SellerDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSeller}
        loading={actionLoading}
        sellerName={selectedSeller?.name}
      />
      <SellerDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        seller={selectedSeller}
        onEdit={openEditModal}
      />
    </div>
  );
}
