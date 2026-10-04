"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext as useAuth } from "@/features/auth/context/AuthContext";
import { getPurchaseOrderById, receivePurchaseOrderItems, approvePurchaseOrder, cancelPurchaseOrder } from "../services/purchaseOrderService";
import { format } from "date-fns";
import { 
  ArrowLeft, FileText, CheckCircle, XCircle, AlertCircle, Package, Truck, Calendar, DollarSign
} from "lucide-react";
import toast from "react-hot-toast";

const currencyFormat = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0);
};

export default function PurchaseOrderDetailsPage() {
  const { storeId, poId } = useParams();
  const { user } = useAuth();
  
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Receiving Modal State
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [receiveItems, setReceiveItems] = useState([]);

  useEffect(() => {
    fetchPO();
  }, [storeId, poId]);

  const fetchPO = async () => {
    try {
      setLoading(true);
      const res = await getPurchaseOrderById(storeId, poId);
      setPo(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load Purchase Order details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this purchase order?")) return;
    try {
      setProcessing(true);
      await approvePurchaseOrder(storeId, poId);
      toast.success("Purchase order approved successfully");
      fetchPO();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this purchase order?")) return;
    try {
      setProcessing(true);
      await cancelPurchaseOrder(storeId, poId);
      toast.success("Purchase order cancelled");
      fetchPO();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    } finally {
      setProcessing(false);
    }
  };

  const openReceiveModal = () => {
    if (!po || !['Approved', 'Partially Received'].includes(po.status)) return;
    
    const initialReceiveItems = po.items.map(item => ({
      productId: item.product._id,
      name: item.product.name,
      ordered: item.quantity,
      alreadyReceived: item.receivedQuantity,
      remaining: item.quantity - item.receivedQuantity,
      acceptedQty: 0,
      rejectedQty: 0
    })).filter(i => i.remaining > 0);

    if (initialReceiveItems.length === 0) {
      toast.error("All items have already been received.");
      return;
    }

    setReceiveItems(initialReceiveItems);
    setShowReceiveModal(true);
  };

  const handleReceiveItemsChange = (productId, field, val) => {
    const value = Math.max(0, Number(val));
    setReceiveItems(prev => prev.map(i => {
      if (i.productId === productId) {
        const otherField = field === 'acceptedQty' ? 'rejectedQty' : 'acceptedQty';
        if (value + i[otherField] > i.remaining) {
          toast.error(`Total received cannot be more than ${i.remaining}`);
          return { ...i, [field]: i.remaining - i[otherField] };
        }
        return { ...i, [field]: value };
      }
      return i;
    }));
  };

  const submitReceive = async () => {
    const toSubmit = receiveItems
      .filter(i => i.acceptedQty > 0 || i.rejectedQty > 0)
      .map(i => ({
        productId: i.productId,
        acceptedQuantity: i.acceptedQty,
        rejectedQuantity: i.rejectedQty
      }));

    if (toSubmit.length === 0) {
      toast.error("Please enter a quantity greater than 0 to receive.");
      return;
    }

    try {
      setProcessing(true);
      await receivePurchaseOrderItems(storeId, poId, toSubmit);
      toast.success("Items received, GRN created, and Purchase recorded successfully!");
      setShowReceiveModal(false);
      fetchPO();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to receive items");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Purchase Order Not Found</h2>
        <Link href={`/storeDashboard/${storeId}/purchases/orders`} className="text-indigo-600 hover:underline mt-4 inline-block">
          Return to Purchase Orders
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Draft': 'bg-slate-100 text-slate-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Approved': 'bg-blue-100 text-blue-800',
      'Partially Received': 'bg-indigo-100 text-indigo-800',
      'Received': 'bg-emerald-100 text-emerald-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 print:m-0 print:p-8 print:max-w-none print:bg-white text-slate-800">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/storeDashboard/${storeId}/purchases/orders`}
          className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm print:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">PO: {po.poNumber}</h1>
            {getStatusBadge(po.status)}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created on {format(new Date(po.orderDate), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-3 print:hidden">
          {(po.status === 'Draft' || po.status === 'Pending') && (
            <>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={handleCancel}
                disabled={processing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}

          {['Approved', 'Partially Received'].includes(po.status) && (
            <>
              <button
                onClick={openReceiveModal}
                disabled={processing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium disabled:opacity-50"
              >
                <Package className="h-4 w-4" />
                Receive Items
              </button>
              <button
                onClick={handleCancel}
                disabled={processing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm font-medium print:hidden"
          >
            <FileText className="h-4 w-4" />
            Print PO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center print:bg-white print:px-0">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 print:text-black">
                <Package className="h-5 w-5 text-indigo-500 print:hidden" />
                Order Items
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-center">Ordered</th>
                    <th className="px-6 py-4 text-center">Received</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {po.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.product?.name}</div>
                        <div className="text-xs text-gray-500">SKU: {item.product?.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          item.receivedQuantity === item.quantity 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : item.receivedQuantity > 0 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.receivedQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-700">
                        {currencyFormat(item.purchasePrice)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-indigo-700">
                        {currencyFormat(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Linked Purchases */}
          {po.linkedPurchases && po.linkedPurchases.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:shadow-none print:border-none print:p-0 print:mt-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 print:text-black">
                <Truck className="h-5 w-5 text-indigo-500 print:hidden" />
                Linked Purchases (Receipts)
              </h3>
              <div className="space-y-3">
                {po.linkedPurchases.map(purchase => (
                  <div key={purchase._id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-white transition-colors print:bg-white print:border-slate-300">
                    <div>
                      <div className="font-medium text-gray-900 print:text-black">Invoice: {purchase.invoiceNumber}</div>
                      <div className="text-xs text-gray-500 print:text-gray-700">{format(new Date(purchase.purchaseDate), "dd MMM yyyy, hh:mm a")}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 print:text-black">{currencyFormat(purchase.grandTotal)}</div>
                      <Link href={`/storeDashboard/${storeId}/purchases/${purchase._id}`} className="text-indigo-600 text-sm font-medium hover:underline print:hidden">
                        View Purchase
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:shadow-none print:border-none print:p-0">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 print:text-black">
              <DollarSign className="h-5 w-5 text-indigo-500 print:hidden" />
              Order Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 print:text-gray-800">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 print:text-black">{currencyFormat(po.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 print:text-gray-800">
                <span>Total Tax</span>
                <span className="font-medium text-gray-900 print:text-black">{currencyFormat(po.tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600 print:text-gray-800">
                <span>Total Discount</span>
                <span className="font-medium text-gray-900 print:text-black">-{currencyFormat(po.discount)}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center print:border-slate-300">
                <span className="font-bold text-gray-900 print:text-black">Grand Total</span>
                <span className="font-black text-xl text-indigo-700 print:text-black">{currencyFormat(po.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:shadow-none print:border-none print:p-0 print:mt-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 print:text-black">
              <AlertCircle className="h-5 w-5 text-indigo-500 print:hidden" />
              Details
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1 print:text-gray-700">Supplier</span>
                <div className="font-medium text-gray-900 print:text-black">{po.seller?.name}</div>
                <div className="text-gray-500 mt-0.5 print:text-gray-800">{po.seller?.phone}</div>
              </div>
              <div>
                <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1 print:text-gray-700">Order Date</span>
                <div className="font-medium text-gray-900 flex items-center gap-2 print:text-black">
                  <Calendar className="h-4 w-4 text-gray-400 print:hidden" />
                  {format(new Date(po.orderDate), "dd MMM yyyy")}
                </div>
              </div>
              <div>
                <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1 print:text-gray-700">Expected Delivery</span>
                <div className="font-medium text-gray-900 flex items-center gap-2 print:text-black">
                  <Truck className="h-4 w-4 text-gray-400 print:hidden" />
                  {po.expectedDeliveryDate ? format(new Date(po.expectedDeliveryDate), "dd MMM yyyy") : "Not specified"}
                </div>
              </div>
              {po.notes && (
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1 print:text-gray-700">Notes</span>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 print:bg-white print:border-slate-300">{po.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Receive Purchase Order Items</h2>
              <button onClick={() => setShowReceiveModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-lg">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium mb-6 flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>Receiving items will automatically create a Goods Received Note (GRN) and a linked Purchase for accepted items.</p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-center">Remaining</th>
                      <th className="px-4 py-3 w-32 text-center">Accepted Qty</th>
                      <th className="px-4 py-3 w-32 text-center">Rejected Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {receiveItems.map(item => (
                      <tr key={item.productId} className="bg-white">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.remaining}</td>
                        <td className="px-4 py-3">
                          <input 
                            type="number"
                            min="0"
                            max={item.remaining}
                            value={item.acceptedQty}
                            onChange={(e) => handleReceiveItemsChange(item.productId, 'acceptedQty', e.target.value)}
                            className="w-full text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number"
                            min="0"
                            max={item.remaining}
                            value={item.rejectedQty}
                            onChange={(e) => handleReceiveItemsChange(item.productId, 'rejectedQty', e.target.value)}
                            className="w-full text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={submitReceive}
                disabled={processing}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? "Processing..." : "Confirm Receipt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





