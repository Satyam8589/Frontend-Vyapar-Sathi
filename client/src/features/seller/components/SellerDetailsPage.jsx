"use client";

import { useSellerDetails } from "../hooks/useSellerDetails";
import Link from "next/link";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const currencyFormat = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

const formatAddress = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  if (typeof addr === "object") {
    if (addr.fullAddress) return addr.fullAddress;
    const parts = [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean);
    return parts.join(", ") || "";
  }
  return String(addr);
};

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
    {[...Array(7)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-slate-100 rounded-lg" />
      </td>
    ))}
  </tr>
);

export default function SellerDetailsPage() {
  const {
    storeId,
    seller,
    summary,
    purchases,
    payments,
    loading,
    error,
    search,
    setSearch,
    paymentStatus,
    setPaymentStatus,
    returnStatus,
    setReturnStatus,
    page,
    setPage,
    totalPages,
    total
  } = useSellerDetails();

  if (loading && !seller) {
    return (
      <div className="min-h-screen pb-12 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
          <h2 className="text-lg font-bold text-red-700 mb-2">Error Loading Supplier</h2>
          <p className="text-red-600 mb-4">{error || "Supplier not found"}</p>
          <Link href={`/storeDashboard/${storeId}/sellers`} className="text-indigo-600 font-bold hover:underline">
            ← Back to Sellers
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "S";

  const chartData = {
    labels: summary?.trend?.map(t => `${t.month} ${t.year}`) || [],
    datasets: [
      {
        label: 'Purchases',
        data: summary?.trend?.map(t => t.purchase) || [],
        fill: true,
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderColor: '#4F46E5',
        tension: 0.4,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4F46E5',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => currencyFormat(context.parsed.y)
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => currencyFormat(value)
        },
        grid: {
          color: '#f1f5f9',
          borderDash: [4, 4]
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="min-h-screen pb-8 sm:pb-12">
      <div className="w-full px-2 sm:px-4 py-4 md:py-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link 
                href={`/storeDashboard/${storeId}/sellers`}
                className="h-10 w-10 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </Link>
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/30">
                {getInitials(seller.name)}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{seller.name}</h1>
                <p className="text-slate-500 font-medium">{seller.businessName || "No Business Name"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm bg-slate-50 px-4 py-3 rounded-2xl">
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-0.5">Contact</p>
                <p className="font-semibold text-slate-700">{seller.phone}</p>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-0.5">Email</p>
                <p className="font-semibold text-slate-700">{seller.email || "—"}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Stats */}
        {summary && (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Net Purchases"
              value={currencyFormat(summary.netPurchase)}
              color="bg-gradient-to-br from-blue-500 to-indigo-600"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
            />
            <StatCard
              label="Total Paid"
              value={currencyFormat(summary.amountPaid)}
              color="bg-gradient-to-br from-emerald-500 to-green-600"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Outstanding Due"
              value={currencyFormat(summary.amountDue)}
              color={`bg-gradient-to-br ${summary.amountDue > 0 ? 'from-rose-500 to-red-600' : 'from-slate-400 to-slate-500'}`}
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              label="Total Returned"
              value={currencyFormat(summary.returnedAmount)}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>}
            />
          </section>
        )}

        {/* Layout for Chart and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-6">Purchase Trend (6 Months)</h3>
            <div className="h-64">
              {(summary?.trend?.length > 0) ? (
                <Line options={chartOptions} data={chartData} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  Not enough data for chart
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-6">Supplier Details</h3>
            <div className="space-y-4">
              <div className="flex flex-col pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">GSTIN</span>
                <span className="font-semibold text-slate-800 mt-1">{seller.GSTIN || "Not Provided"}</span>
              </div>
              <div className="flex flex-col pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Address</span>
                <span className="font-semibold text-slate-800 mt-1">{formatAddress(seller.address) || "Not Provided"}</span>
              </div>
              <div className="flex flex-col pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</span>
                <span className={`mt-1 inline-flex self-start px-2.5 py-1 rounded-full text-xs font-bold ${
                  seller.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {seller.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Added On</span>
                <span className="font-semibold text-slate-800 mt-1">
                  {format(new Date(seller.createdAt), "dd MMM yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4">Purchase History</h3>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search invoice number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Unpaid">Unpaid</option>
              </select>
              <select
                value={returnStatus}
                onChange={(e) => setReturnStatus(e.target.value)}
                className="py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Returns</option>
                <option value="No Return">No Return</option>
                <option value="Returned">Returned</option>
                <option value="Partially Returned">Partially Returned</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left font-bold text-slate-500">Date</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500">Invoice #</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-500">Grand Total</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-500">Paid</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-500">Due</th>
                  <th className="px-6 py-4 text-center font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && purchases.length === 0 ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : purchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No purchases found matching your filters.
                    </td>
                  </tr>
                ) : (
                  purchases.map(purchase => (
                    <tr key={purchase._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {format(new Date(purchase.date), "dd MMM yyyy")}
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-600">
                        {purchase.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        {currencyFormat(purchase.grandTotal)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                        {currencyFormat(purchase.amountPaid)}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-rose-600">
                        {currencyFormat(purchase.amountDue)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            purchase.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                            purchase.paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {purchase.paymentStatus}
                          </span>
                          {purchase.returnStatus && purchase.returnStatus !== 'No Return' && (
                            <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                              {purchase.returnStatus}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/storeDashboard/${storeId}/purchases/${purchase._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-xs font-bold text-slate-600 transition-colors"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Showing page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Payment History Section */}
        {payments && payments.length > 0 && (
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left font-bold text-slate-500">Date</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500">Related Purchase</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500">Mode</th>
                    <th className="px-6 py-4 text-left font-bold text-slate-500">Notes</th>
                    <th className="px-6 py-4 text-right font-bold text-slate-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payments.map(payment => (
                    <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {format(new Date(payment.date), "dd MMM yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        {payment.transaction ? (
                          <Link href={`/storeDashboard/${storeId}/purchases/${payment.transaction}`} className="text-indigo-600 font-bold hover:underline">
                            View Purchase
                          </Link>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 capitalize">
                        {payment.paymentMode.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {payment.notes || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        {currencyFormat(payment.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

