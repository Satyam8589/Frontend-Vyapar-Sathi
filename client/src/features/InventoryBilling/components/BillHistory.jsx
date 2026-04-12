"use client";

import { useState, useEffect, useMemo } from "react";
import { getBillHistory } from "../services/billingService";
import { downloadBillPDF } from "../utils/pdfGenerator";
import { useParams } from "next/navigation";
import { showError } from "@/utils/toast";
import {
  Calendar,
  User,
  CreditCard,
  Package,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  History,
  TrendingUp,
  Receipt,
  Clock,
  ArrowRight,
  Filter,
  X,
  Search,
} from "lucide-react";

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 3 }, (_, i) => CURRENT_YEAR - i);

export const BillHistory = ({ isMobile = false, defaultOpen = false }) => {
  const params = useParams();
  const storeId = params.storeId;

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(defaultOpen || isMobile);
  const [historyPage, setHistoryPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100, // Fetch a large batch to catch today's bills
    total: 0,
    totalPages: 0,
  });
  const [expandedBill, setExpandedBill] = useState(null);
  const [filters, setFilters] = useState({
    date: "",
    month: "",
    year: "",
  });

  // Fetch bill history
  const fetchBills = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      const limit = 100;
      const response = await getBillHistory(storeId, limit, page, currentFilters);
      setBills(response.bills || []);
      setPagination(response.data?.pagination || { ...pagination, total: (response.bills || []).length });
    } catch (error) {
      console.error("Failed to fetch bill history:", error);
      showError("Failed to load bill history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId && isOpen) {
      fetchBills(1);
    }
  }, [storeId, isOpen, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      // If date is selected, clear month/year as date is more specific
      if (name === "date" && value) {
        newFilters.month = "";
        newFilters.year = "";
      }
      // If month/year is selected, clear date
      if ((name === "month" || name === "year") && value) {
        newFilters.date = "";
      }
      return newFilters;
    });
    setHistoryPage(1);
  };

  const clearFilters = () => {
    setFilters({ date: "", month: "", year: "" });
    setHistoryPage(1);
  };

  // Grouping logic
  const { todayBills, olderBills, todayTotal } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const grouped = bills.reduce(
      (acc, bill) => {
        const billDate = new Date(bill.createdAt);
        billDate.setHours(0, 0, 0, 0);

        if (billDate.getTime() === today.getTime()) {
          acc.todayBills.push(bill);
          acc.todayTotal += bill.totalPrice || 0;
        } else {
          acc.olderBills.push(bill);
        }
        return acc;
      },
      { todayBills: [], olderBills: [], todayTotal: 0 }
    );

    return grouped;
  }, [bills]);

  // Local pagination for history
  const historyLimit = 5;
  const paginatedOlderBills = useMemo(() => {
    const start = (historyPage - 1) * historyLimit;
    return olderBills.slice(start, start + historyLimit);
  }, [olderBills, historyPage]);

  const totalHistoryPages = Math.ceil(olderBills.length / historyLimit);

  const isFiltered = !!(filters.date || filters.month || filters.year);
  
  // Pagination for filtered results
  const filtratedLimit = 10;
  const paginatedFilteredBills = useMemo(() => {
    const start = (historyPage - 1) * filtratedLimit;
    return bills.slice(start, start + filtratedLimit);
  }, [bills, historyPage]);
  const totalFilteredPages = Math.ceil(bills.length / filtratedLimit);

  const toggleBillExpansion = (billId) => {
    setExpandedBill(expandedBill === billId ? null : billId);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatFullDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const BillCard = ({ bill, isToday = false }) => (
    <div
      key={bill._id}
      className={`group mb-3 rounded-xl border transition-all duration-300 ${
        expandedBill === bill._id
          ? "border-blue-200 bg-blue-50/30 ring-1 ring-blue-100"
          : "border-gray-100 bg-white hover:border-blue-200 hover:shadow-md"
      }`}
    >
      <div
        className="cursor-pointer p-2.5 md:p-4"
        onClick={() => toggleBillExpansion(bill._id)}
      >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <Receipt size={22} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <p className="font-mono text-xs font-medium text-gray-400">
                  #{bill._id.slice(-8).toUpperCase()}
                </p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    bill.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {bill.paymentStatus}
                </span>
              </div>
              <h4 className="mt-1 text-base font-bold text-gray-800">
                {bill.user?.name || "Guest Customer"}
              </h4>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  {isToday ? formatDate(bill.createdAt) : formatFullDate(bill.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Package size={14} className="text-gray-400" />
                  {bill.products.length} Items
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 pt-3 sm:border-0 sm:pt-0">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Amount</p>
              <p className="text-xl font-black text-gray-900">₹{bill.totalPrice.toLocaleString()}</p>
            </div>
            <div className="ml-6 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadBillPDF(bill);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                title="Download PDF"
              >
                <Download size={18} />
              </button>
              <div className={`transition-transform duration-300 ${expandedBill === bill._id ? "rotate-180" : ""}`}>
                <ChevronDown size={20} className="text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {expandedBill === bill._id && (
        <div className="border-t border-blue-100 px-5 py-4">
          <div className="rounded-xl border border-blue-50 bg-white p-1 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-gray-50 pb-3">
              <h5 className="text-xs font-bold uppercase tracking-widest text-blue-600">Product Details</h5>
              <span className="text-xs text-gray-400">{bill.products.length} Items Total</span>
            </div>
            <div className="space-y-3">
              {bill.products.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-[10px] font-bold text-gray-400">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{item.product?.name || "Product"}</p>
                      <p className="text-[11px] text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t-2 border-gray-100 pt-4">
              {/* Calculate subtotal fallback for older bills */}
              <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
                <span>Gross Amount:</span>
                <span>₹{(bill.subtotal || (bill.totalPrice + (bill.discount?.amount || 0))).toLocaleString()}</span>
              </div>
              
              {bill.discount?.amount > 0 ? (
                <div className="flex justify-between items-center text-sm font-bold text-green-600 bg-green-50/50 p-2 rounded-lg border border-green-100/50">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    Applied Discount ({bill.discount.type === "percent" ? `${bill.discount.value}%` : `₹${bill.discount.value}`})
                  </span>
                  <span>-₹{(bill.discount.amount || 0).toLocaleString()}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs font-medium text-gray-400 px-2 italic">
                  <span>No discounts applied to this bill</span>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl bg-gray-900 p-4 mt-2 text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Total Payable</p>
                  <p className="text-xs font-medium text-blue-300/80">{bill.paymentMethod || "Cash"} • {bill.paymentStatus}</p>
                </div>
                <div className="relative z-10 text-right">
                  <p className="text-2xl font-black tracking-tighter text-white">₹{bill.totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Search and Filters Section */}
      <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Filter size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Filter History</h3>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Refine your search</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
            {/* Specific Date Filter */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Calendar size={14} />
              </span>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>

            {/* Month Filter */}
            <div className="relative">
              <select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                className="w-full h-10 px-3 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white appearance-none transition-all"
              >
                <option value="">Select Month</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={14} />
              </span>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="w-full h-10 px-3 rounded-xl border border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white appearance-none transition-all"
              >
                <option value="">Select Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={14} />
              </span>
            </div>
          </div>

          {(filters.date || filters.month || filters.year) && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-red-50 bg-red-50/30 text-red-600 text-xs font-bold hover:bg-red-50 transition-all"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </section>

      {isFiltered ? (
        /* Filtered Results View */
        <section className="animate-in fade-in slide-in-from-top-4 duration-500">
           <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <Search size={18} />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-gray-900">Filtered Results</h2>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">
                  {filters.date ? `For ${new Date(filters.date).toLocaleDateString()}` : 
                   filters.month ? `For ${MONTHS.find(m => m.value == filters.month)?.label} ${filters.year}` : 
                   filters.year ? `For Year ${filters.year}` : "Searching..."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-3 shadow-sm">
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">Total Hits</p>
                <p className="text-lg font-black text-gray-900 leading-none">{bills.length}</p>
              </div>
              <div className="h-8 w-px bg-gray-100"></div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">Result Total</p>
                <p className="text-lg font-black text-blue-600 leading-none">₹{bills.reduce((acc, b) => acc + (b.totalPrice || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100"></div>
                ))}
              </div>
            ) : bills.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
                  {paginatedFilteredBills.map((bill) => (
                    <BillCard key={bill._id} bill={bill} isToday={false} />
                  ))}
                </div>
                
                {/* Pagination for Filtered Results */}
                {totalFilteredPages > 1 && (
                  <div className="mt-8 flex items-center justify-between px-2 pt-4 border-t border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Page {historyPage} of {totalFilteredPages}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                        disabled={historyPage === 1}
                        className="h-10 px-6 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setHistoryPage((p) => Math.min(totalFilteredPages, p + 1))}
                        disabled={historyPage === totalFilteredPages}
                        className="h-10 px-8 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 disabled:opacity-30 transition-all flex items-center gap-2"
                      >
                        Next
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-60 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-white p-6">
                <div className="mb-4 text-gray-200">
                  <Search size={48} />
                </div>
                <p className="text-base font-bold text-gray-900">No results found</p>
                <p className="mt-1 text-xs text-gray-500">Try adjusting your filters to find what you're looking for</p>
                <button 
                  onClick={clearFilters}
                  className="mt-6 text-xs font-bold text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        /* Default Split View (Today/Past) */
        <>
          {/* Today's Section - Full List */}
          <section>
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/50">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-gray-900">Today's Sales</h2>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">Real-time tracking</p>
                </div>
              </div>

              <div className="flex items-stretch gap-2">
                <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-3 shadow-sm">
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">Total Items</p>
                    <p className="text-lg font-black text-gray-900 leading-none">{todayBills.length}</p>
                  </div>
                  <div className="h-8 w-px bg-gray-100"></div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">Today's Total</p>
                    <p className="text-lg font-black text-green-600 leading-none">₹{todayTotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {loading && bills.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hydrating data...</p>
                </div>
              </div>
            ) : todayBills.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3 items-start">
                {todayBills.map((bill) => (
                  <BillCard key={bill._id} bill={bill} isToday={true} />
                ))}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-2 text-gray-300">
                  <FileText size={32} />
                </div>
                <p className="text-sm font-bold text-gray-400">No sales recorded yet today</p>
              </div>
            )}
          </section>

          {/* Older History Section - Paginated in 5s */}
          <section className="pt-2 bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div className="mb-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 shadow-sm">
                  <Clock size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-gray-900">Past History</h2>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">Archived transactions</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {loading && bills.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100"></div>
                  ))}
                </div>
              ) : olderBills.length > 0 ? (
                <>
                  {paginatedOlderBills.map((bill) => (
                    <BillCard key={bill._id} bill={bill} isToday={false} />
                  ))}
                  
                  {/* Local History Pagination */}
                  {totalHistoryPages > 1 && (
                    <div className="mt-8 flex items-center justify-between px-2 pt-4 border-t border-gray-200/60">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Page {historyPage} of {totalHistoryPages}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                          disabled={historyPage === 1}
                          className="flex items-center gap-1 rounded-xl bg-white border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-30"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setHistoryPage((p) => Math.min(totalHistoryPages, p + 1))}
                          disabled={historyPage === totalHistoryPages}
                          className="flex items-center gap-1 rounded-xl bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 disabled:opacity-30"
                        >
                          Next
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-medium italic">No historical records found</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
