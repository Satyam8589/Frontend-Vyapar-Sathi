"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getGRNById } from "../services/grnService";
import { format } from "date-fns";
import { ArrowLeft, FileText, Package, Truck, Calendar, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const currencyFormat = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0);
};

export default function GRNDetailsPage() {
  const { storeId, grnId } = useParams();
  const [grn, setGrn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGRN();
  }, [storeId, grnId]);

  const fetchGRN = async () => {
    try {
      setLoading(true);
      const res = await getGRNById(storeId, grnId);
      setGrn(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load GRN details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!grn) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">GRN Not Found</h2>
        <Link to={`/storeDashboard/${storeId}/purchases/grns`} className="text-indigo-600 hover:underline mt-4 inline-block">
          Return to GRN List
        </Link>
      </div>
    );
  }

  const totalAccepted = grn.items.reduce((sum, i) => sum + i.acceptedQuantity, 0);
  const totalRejected = grn.items.reduce((sum, i) => sum + i.rejectedQuantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 print:m-0 print:p-8 print:max-w-none print:bg-white text-slate-800">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to={`/storeDashboard/${storeId}/purchases/grns`}
          className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 shadow-sm print:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">GRN: {grn.grnNumber}</h1>
            <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800">
              {grn.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Received on {format(new Date(grn.receivedDate), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm font-medium print:hidden"
          >
            <FileText className="h-4 w-4" />
            Print GRN
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
                Received Items
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4 text-center">Ordered</th>
                    <th className="px-6 py-4 text-center">Total Received</th>
                    <th className="px-6 py-4 text-center">Accepted</th>
                    <th className="px-6 py-4 text-center">Rejected</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {grn.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.product?.name}</div>
                        <div className="text-xs text-gray-500">SKU: {item.product?.sku}</div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {item.orderedQuantity}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-700">
                        {item.receivedQuantity}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-emerald-600">{item.acceptedQuantity}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${item.rejectedQuantity > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {item.rejectedQuantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:shadow-none print:border-none print:p-0">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 print:text-black">
              <Package className="h-5 w-5 text-indigo-500 print:hidden" />
              Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total Items Received</span>
                <span className="font-medium text-gray-900">{totalAccepted + totalRejected}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Accepted Items</span>
                <span className="font-medium text-emerald-600">{totalAccepted}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Rejected Items</span>
                <span className="font-medium text-red-600">{totalRejected}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 print:shadow-none print:border-none print:p-0 print:mt-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 print:text-black">
              <AlertCircle className="h-5 w-5 text-indigo-500 print:hidden" />
              Details
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Supplier</span>
                <div className="font-medium text-gray-900">{grn.seller?.name}</div>
                <div className="text-gray-500 mt-0.5">{grn.seller?.phone}</div>
              </div>
              
              {grn.purchaseOrder && (
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Linked PO</span>
                  <Link to={`/storeDashboard/${storeId}/purchases/orders/${grn.purchaseOrder._id}`} className="font-medium text-indigo-600 hover:underline flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {grn.purchaseOrder.poNumber}
                  </Link>
                </div>
              )}

              {grn.linkedPurchase && (
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Linked Purchase</span>
                  <Link to={`/storeDashboard/${storeId}/purchases/${grn.linkedPurchase._id}`} className="font-medium text-indigo-600 hover:underline flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {grn.linkedPurchase.invoiceNumber}
                  </Link>
                </div>
              )}

              {grn.notes && (
                <div>
                  <span className="block text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Notes</span>
                  <div className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{grn.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}



