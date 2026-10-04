"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPurchaseById, updatePurchase, createPurchaseReturn, getPurchaseReturns, recordPurchasePayment, getPurchasePayments } from "../services/purchaseService";
import { fetchStoreById } from "@/features/storeDashboard/services/storeDashboardService";
import { showError, showSuccess } from "@/utils/toast";
import PurchaseFormModal from "./PurchaseFormModal";
import PurchaseReturnModal from "./PurchaseReturnModal";
import PurchasePaymentModal from "./PurchasePaymentModal";

const currencyFormat = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

export default function PurchaseDetailsPage({ storeId, purchaseId }) {
  const router = useRouter();
  const [purchase, setPurchase] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [returnsHistory, setReturnsHistory] = useState([]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentsHistory, setPaymentsHistory] = useState([]);

  const fetchPurchaseAndStore = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [purchaseRes, storeRes, returnsRes, paymentsRes] = await Promise.all([
        getPurchaseById(storeId, purchaseId),
        fetchStoreById(storeId).catch(() => null),
        getPurchaseReturns(storeId, purchaseId).catch(() => ({ data: [] })),
        getPurchasePayments(storeId, purchaseId).catch(() => ({ data: [] }))
      ]);
      
      setPurchase(purchaseRes.data || purchaseRes); 
      setReturnsHistory(returnsRes.data || []);
      setPaymentsHistory(paymentsRes.data || []);
      if (storeRes && storeRes.data) {
        const { userContext, ...storeData } = storeRes.data;
        setStore(storeData);
      }
    } catch (err) {
      let msg = err.message || "Unable to load purchase details. Please try again.";
      if (err.status === 404 || err.response?.status === 404 || err.response?.status === 403) {
        msg = "Purchase not found or you don't have permission to view this purchase.";
      }
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId && purchaseId) {
      fetchPurchaseAndStore();
    }
  }, [storeId, purchaseId]);

  const handleEditSubmit = async (payload) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await updatePurchase(storeId, purchaseId, payload);
      showSuccess("Purchase updated successfully.");
      setIsEditModalOpen(false);
      fetchPurchaseAndStore(); // Refresh data
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnSubmit = async (payload) => {
    if (isReturning) return;
    try {
      setIsReturning(true);
      await createPurchaseReturn(storeId, purchaseId, payload);
      showSuccess("Purchase returned successfully.");
      setIsReturnModalOpen(false);
      fetchPurchaseAndStore();
    } catch (err) {
      showError(err.message || "Failed to process return.");
    } finally {
      setIsReturning(false);
    }
  };

  const handlePaymentSubmit = async (payload) => {
    if (isPaying) return;
    try {
      setIsPaying(true);
      await recordPurchasePayment(storeId, purchaseId, payload);
      showSuccess("Payment recorded successfully.");
      setIsPaymentModalOpen(false);
      fetchPurchaseAndStore();
    } catch (err) {
      showError(err.message || "Failed to record payment.");
    } finally {
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-8 sm:pb-12 pt-6 print:hidden">
        <div className="w-full px-2 sm:px-3 md:px-4 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-slate-200 rounded w-1/4"></div>
            <div className="h-40 bg-slate-200 rounded"></div>
            <div className="h-60 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-8 sm:pb-12 pt-6 flex flex-col items-center justify-center print:hidden">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Purchase</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
            className="btn-primary-yb py-2.5 px-6 font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
          >
            Back to Purchases
          </button>
        </div>
      </div>
    );
  }

  if (!purchase) return null;

  return (
    <div className="min-h-screen pb-8 sm:pb-12 pt-4 print:min-h-0 print:p-0 print:m-0 print:bg-white bg-slate-50">
      
      {/* SCREEN ONLY HEADER */}
      <div className="w-full px-2 sm:px-3 md:px-4 max-w-5xl mx-auto space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Purchases
          </button>
          
          <div className="flex items-center gap-2">
            {purchase.returnStatus !== 'full' && (
              <button
                onClick={() => setIsReturnModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 shadow-sm rounded-lg text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors print:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                Return Items
              </button>
            )}
            {purchase.dueAmount > 0 && (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 shadow-sm rounded-lg text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors print:hidden"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Record Payment
              </button>
            )}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 shadow-sm rounded-lg text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors print:hidden"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Purchase
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors print:hidden"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Purchase Details</h1>
            <p className="text-slate-500 font-medium mt-1">#{purchase.invoiceNumber}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-700">
              Completed
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              purchase.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' :
              purchase.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' :
              'bg-rose-100 text-rose-700'
            }`}>
              {purchase.paymentStatus.toUpperCase()}
            </span>
            {purchase.returnStatus && purchase.returnStatus !== 'none' && (
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                purchase.returnStatus === 'full'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {purchase.returnStatus === 'full' ? '↩ Fully Returned' : '↩ Partially Returned'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* INVOICE CONTENT - SHOWN ON SCREEN & PRINT */}
      <div className="w-full px-2 sm:px-3 md:px-4 max-w-5xl mx-auto mt-6 print:m-0 print:p-8 print:max-w-none print:bg-white text-slate-800">
        
        {/* PRINT ONLY HEADER */}
        <div className="hidden print:block mb-10 border-b-2 border-slate-200 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">PURCHASE INVOICE</h1>
              <p className="text-slate-500 mt-2 font-medium">Original Copy</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-slate-800">{store?.name || "VyaparSathi Store"}</h2>
              {store?.address && <p className="text-slate-600 mt-1">{store.address}</p>}
              {store?.phone && <p className="text-slate-600">Ph: {store.phone}</p>}
              {store?.email && <p className="text-slate-600">Email: {store.email}</p>}
            </div>
          </div>
        </div>

        {/* Info Cards - Screen vs Print adapt automatically */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:mb-10 print:grid-cols-2 print:gap-12">
          
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 print:text-xl print:border-slate-800 print:text-black">Purchase Information</h2>
            <dl className="space-y-3 text-sm print:text-base">
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-slate-500 font-medium print:text-slate-600">Invoice Number:</dt>
                <dd className="col-span-2 font-bold text-slate-900 print:text-black">{purchase.invoiceNumber}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-slate-500 font-medium print:text-slate-600">Purchase Date:</dt>
                <dd className="col-span-2 font-semibold text-slate-900 print:text-black">{new Date(purchase.purchaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2 print:hidden">
                <dt className="text-slate-500 font-medium">Created At:</dt>
                <dd className="col-span-2 font-semibold text-slate-900">{new Date(purchase.createdAt).toLocaleString('en-GB')}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2 hidden print:grid">
                <dt className="text-slate-500 font-medium print:text-slate-600">Payment Status:</dt>
                <dd className="col-span-2 font-bold uppercase print:text-black">{purchase.paymentStatus}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 print:text-xl print:border-slate-800 print:text-black">Supplier / Seller</h2>
            {purchase.seller ? (
              <div className="space-y-2 text-sm text-slate-700 print:text-base print:text-black">
                <p className="font-bold text-slate-900 text-base print:text-lg">{purchase.seller.name}</p>
                {purchase.seller.phone && (
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium w-16">Phone:</span> {purchase.seller.phone}
                  </p>
                )}
                {purchase.seller.email && (
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium w-16">Email:</span> {purchase.seller.email}
                  </p>
                )}
                {purchase.seller.address && (
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium w-16">Address:</span> {purchase.seller.address}
                  </p>
                )}
                {purchase.seller.gstNumber && (
                  <p className="flex items-center gap-2 mt-2">
                    <span className="text-slate-500 font-medium w-16">GSTIN:</span> 
                    <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 print:bg-transparent print:border-none print:p-0 print:font-bold">{purchase.seller.gstNumber}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic print:text-black">No supplier information available.</p>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6 print:shadow-none print:border-none print:rounded-none">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 print:hidden">
            <h2 className="text-lg font-bold text-slate-800">Purchase Items</h2>
          </div>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left border-collapse print:border print:border-slate-300">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider print:bg-slate-100 print:text-black print:border-slate-300">
                  <th className="px-5 py-3 print:border-r print:border-slate-300">Product</th>
                  <th className="px-5 py-3 print:border-r print:border-slate-300">SKU</th>
                  <th className="px-5 py-3 text-right print:border-r print:border-slate-300">Price</th>
                  <th className="px-5 py-3 text-right print:border-r print:border-slate-300">Qty</th>
                  <th className="px-5 py-3 text-right print:border-r print:border-slate-300">Returned</th>
                  <th className="px-5 py-3 text-right print:border-r print:border-slate-300">Remaining</th>
                  <th className="px-5 py-3 text-right print:border-r print:border-slate-300">Discount</th>
                  <th className="px-5 py-3 text-right print:border-r print:border-slate-300">Tax</th>
                  <th className="px-5 py-3 text-right print:border-r print:border-slate-300">Total</th>
                  <th className="px-5 py-3 text-right print:hidden">Current Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm print:divide-slate-300 print:text-black">
                {purchase.items?.map((item, index) => (
                  <tr key={item._id || index} className="hover:bg-slate-50/30 print:hover:bg-transparent">
                    <td className="px-5 py-4 font-semibold text-slate-800 print:border-r print:border-slate-300 print:text-black">
                      {item.product?.name || "Unknown Product"}
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono text-xs print:border-r print:border-slate-300 print:text-black">
                      {item.product?.sku || "-"}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-700 print:border-r print:border-slate-300 print:text-black">
                      {currencyFormat(item.purchasePrice)}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-700 print:border-r print:border-slate-300 print:text-black">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-rose-600 print:border-r print:border-slate-300 print:text-black">
                      {item.returnedQuantity || 0}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-slate-800 print:border-r print:border-slate-300 print:text-black">
                      {item.quantity - (item.returnedQuantity || 0)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500 print:border-r print:border-slate-300 print:text-black">
                      {currencyFormat(item.discount)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500 print:border-r print:border-slate-300 print:text-black">
                      {currencyFormat(item.tax)}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-slate-900 print:border-r print:border-slate-300 print:text-black">
                      {currencyFormat(item.subtotal)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500 print:hidden">
                      {item.product?.quantity !== undefined ? item.product.quantity : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-12">
          {/* Notes */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full print:shadow-none print:border-none print:p-0">
            {purchase.notes ? (
              <>
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 print:text-xl print:border-slate-800 print:text-black">Notes / Remarks</h2>
                <p className="text-slate-700 text-sm whitespace-pre-wrap flex-grow bg-slate-50 p-4 rounded-xl border border-slate-100 print:bg-transparent print:border-none print:p-0 print:text-black">{purchase.notes}</p>
              </>
            ) : (
              <div className="print:hidden h-full flex flex-col">
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Notes / Remarks</h2>
                <p className="text-slate-400 text-sm italic flex-grow">No notes added.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border print:border-slate-300 print:p-4 print:rounded-none">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 print:hidden">Payment Summary</h2>
            <div className="space-y-3 print:text-black print:text-base">
              <div className="flex justify-between text-sm text-slate-600 print:text-black">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800 print:text-black">{currencyFormat(purchase.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 print:text-black">
                <span>Discount</span>
                <span className="font-medium text-slate-800 print:text-black">-{currencyFormat(purchase.discount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 pb-3 border-b border-dashed border-slate-200 print:text-black print:border-slate-300">
                <span>Tax</span>
                <span className="font-medium text-slate-800 print:text-black">{currencyFormat(purchase.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-slate-900 pt-1 print:text-black">
                <span>Grand Total</span>
                <span className="text-blue-600 print:text-black">{currencyFormat(purchase.grandTotal)}</span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl mt-4 border border-slate-100 space-y-2 print:bg-transparent print:border-t print:border-x-0 print:border-b-0 print:border-slate-300 print:rounded-none print:p-0 print:pt-4">
                <div className="flex justify-between text-sm text-slate-600 print:text-black">
                  <span className="font-medium print:font-bold">Amount Paid</span>
                  <span className="font-bold text-emerald-600 print:text-black">{currencyFormat(purchase.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 print:text-black">
                  <span className="font-medium print:font-bold">Amount Due</span>
                  <span className="font-bold text-rose-600 print:text-black">{currencyFormat(purchase.dueAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return History */}
        {returnsHistory && returnsHistory.length > 0 && (
          <div className="mt-6 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 print:text-xl print:border-slate-800 print:text-black">Return History</h2>
            <div className="space-y-4">
              {returnsHistory.map((ret, idx) => (
                <div key={ret._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">Return #{returnsHistory.length - idx}</h3>
                      <p className="text-sm text-slate-500">Date: {new Date(ret.returnDate).toLocaleDateString('en-GB')}</p>
                      <p className="text-sm text-slate-500 mt-1">Reason: <span className="font-medium text-slate-700">{ret.reason}</span></p>
                      {ret.notes && <p className="text-sm text-slate-500">Notes: <span className="text-slate-600">{ret.notes}</span></p>}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status: <span className="text-emerald-600">Completed</span></p>
                      <p className="text-lg font-black text-rose-600">Total: {currencyFormat(ret.totalReturnAmount)}</p>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Items Returned:</p>
                    <div className="space-y-1">
                      {ret.items.map(ri => (
                        <div key={ri.product?._id} className="flex justify-between text-sm">
                          <span className="font-semibold text-slate-700">{ri.product?.name || 'Unknown'}</span>
                          <span className="text-slate-600">
                            Returned: <span className="font-bold">{ri.quantity}</span> @ {currencyFormat(ri.purchasePrice)} = <span className="font-bold">{currencyFormat(ri.returnAmount)}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment History */}
        {paymentsHistory && paymentsHistory.length > 0 && (
          <div className="mt-6 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 print:text-xl print:border-slate-800 print:text-black">Payment History</h2>
            <div className="space-y-4">
              {paymentsHistory.map((payment, idx) => (
                <div key={payment._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Payment #{paymentsHistory.length - idx}</h3>
                    <p className="text-sm text-slate-500">Date: {new Date(payment.date).toLocaleDateString('en-GB')}</p>
                    <p className="text-sm text-slate-500 mt-1">Mode: <span className="font-medium text-slate-700 capitalize">{payment.paymentMode.replace('_', ' ')}</span></p>
                    {payment.notes && <p className="text-sm text-slate-500">Notes: <span className="text-slate-600">{payment.notes}</span></p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status: <span className="text-emerald-600">Completed</span></p>
                    <p className="text-lg font-black text-emerald-600">{currencyFormat(payment.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRINT ONLY FOOTER */}
        <div className="hidden print:block mt-16 pt-8 border-t border-slate-300 text-center text-slate-500">
          <p className="font-bold text-black text-lg">Thank You!</p>
          <p className="mt-2 text-sm">Generated by VyaparSathi • {new Date().toLocaleDateString('en-GB')}</p>
        </div>

      </div>
      
      {/* Edit Purchase Modal */}
      <PurchaseFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        loading={isSubmitting}
        storeId={storeId}
        initialData={purchase}
      />
      
      <PurchaseReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onSubmit={handleReturnSubmit}
        loading={isReturning}
        purchase={purchase}
      />

      <PurchasePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        loading={isPaying}
        purchase={purchase}
      />
    </div>
  );
}
