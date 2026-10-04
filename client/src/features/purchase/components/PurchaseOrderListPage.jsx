'use client';

import React, { useState, useEffect } from "react";
import { useAuthContext as useAuth } from "@/features/auth/context/AuthContext";
import { getPurchaseOrders } from "../services/purchaseOrderService";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { 
    Search, Plus, Filter, Eye, AlertCircle, FileText 
} from "lucide-react";
import toast from "react-hot-toast";

const currencyFormat = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0);
};

export default function PurchaseOrderListPage() {
  const { storeId } = useParams();
  const { user } = useAuth();
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPurchaseOrders();
  }, [storeId, statusFilter]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      const res = await getPurchaseOrders(storeId, filters);
      setPurchaseOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch purchase orders");
    } finally {
      setLoading(false);
    }
  };

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
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-slate-100 text-slate-800'}`}>
        {status}
      </span>
    );
  };

  const isOverdue = (po) => {
    if (po.status === 'Received' || po.status === 'Cancelled') return false;
    if (!po.expectedDeliveryDate) return false;
    return new Date() > new Date(po.expectedDeliveryDate);
  };

  const filteredOrders = purchaseOrders.filter(po => {
    if (!searchTerm) return true;
    return (
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            Purchase Orders
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your purchase requests and expected deliveries
          </p>
        </div>
        
        <Link
          to={`/storeDashboard/${storeId}/purchases/orders/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Purchase Order
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search PO Number or Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Partially Received">Partially Received</option>
            <option value="Received">Received</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">PO Number</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Delivery Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      Loading purchase orders...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((po) => (
                  <tr key={po._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {po.poNumber}
                    </td>
                    <td className="px-6 py-4">
                      {po.seller?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      {format(new Date(po.orderDate), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      {po.expectedDeliveryDate ? (
                        <div className="flex items-center gap-2">
                          {format(new Date(po.expectedDeliveryDate), "dd MMM yyyy")}
                          {isOverdue(po) && (
                            <span title="Delivery Overdue" className="text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4" />
                            </span>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {currencyFormat(po.grandTotal)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(po.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/storeDashboard/${storeId}/purchases/orders/${po._id}`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex justify-end items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}





