"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getGRNs } from "../services/grnService";
import { format } from "date-fns";
import { Package, Search, Calendar, FileText, ArrowRight, Truck } from "lucide-react";
import toast from "react-hot-toast";

export default function GRNListPage() {
  const { storeId } = useParams();
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGRNs();
  }, [storeId]);

  const fetchGRNs = async (search = "") => {
    try {
      setLoading(true);
      const res = await getGRNs(storeId, { search });
      setGrns(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load GRNs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGRNs(searchTerm);
  };

  const currencyFormat = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-indigo-600" />
            Goods Received Notes (GRN)
          </h1>
          <p className="text-gray-500 mt-1">Manage and track received goods against Purchase Orders.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search GRN #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading GRNs...</div>
        ) : grns.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No GRNs Found</h3>
            <p className="text-gray-500 mt-1">You haven't received any goods yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">GRN Info</th>
                  <th className="px-6 py-4">Purchase Order</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Items Received</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {grns.map((grn) => {
                  const totalAccepted = grn.items.reduce((sum, i) => sum + i.acceptedQuantity, 0);
                  const totalRejected = grn.items.reduce((sum, i) => sum + i.rejectedQuantity, 0);

                  return (
                    <tr key={grn._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{grn.grnNumber}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(grn.receivedDate), "dd MMM yyyy")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {grn.purchaseOrder ? (
                          <Link to={`/storeDashboard/${storeId}/purchases/orders/${grn.purchaseOrder._id}`} className="font-medium text-indigo-600 hover:underline flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            {grn.purchaseOrder.poNumber}
                          </Link>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{grn.seller?.name}</div>
                        <div className="text-xs text-gray-500">{grn.seller?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="font-semibold text-emerald-600">{totalAccepted} Accepted</span>
                          {totalRejected > 0 && (
                            <span className="ml-2 font-semibold text-red-600">{totalRejected} Rejected</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                          {grn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/storeDashboard/${storeId}/purchases/grns/${grn._id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



