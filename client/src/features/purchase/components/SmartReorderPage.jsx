"use client";
import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Truck, 
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { getReorderSuggestions } from '../services/purchaseService';
import PageLoader from '@/components/PageLoader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SmartReorderPage = ({ storeId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  useEffect(() => {
    fetchSuggestions();
  }, [storeId]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReorderSuggestions(storeId);
      setSuggestions(data.data || []);
      setFilteredSuggestions(data.data || []);
    } catch (err) {
      console.error("Failed to fetch reorder suggestions:", err);
      setError("Failed to fetch smart reorder suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = suggestions;
    
    if (searchTerm) {
      result = result.filter(s => 
        s.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (urgencyFilter !== 'All') {
      result = result.filter(s => s.urgency === urgencyFilter);
    }
    
    setFilteredSuggestions(result);
  }, [searchTerm, urgencyFilter, suggestions]);

  const handleCreatePO = (suggestion) => {
    // Navigate to PO creation page with pre-filled data via query params
    const queryParams = new URLSearchParams({
      productId: suggestion.productId,
      supplierId: suggestion.preferredSupplier?.sellerId || '',
      quantity: suggestion.suggestedQuantity,
      price: suggestion.estimatedPrice
    }).toString();
    
    router.push(`/storeDashboard/${storeId}/purchases/orders?create=true&${queryParams}`);
  };

  const getUrgencyBadge = (urgency) => {
    switch(urgency) {
      case 'Critical':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1"><AlertCircle size={12}/> Critical</span>;
      case 'At Risk':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1"><AlertTriangle size={12}/> At Risk</span>;
      case 'Watch':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12}/> Watch</span>;
      case 'Safe':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12}/> Safe</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Reorder Suggestions</h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-driven insights based on sales velocity, lead times, and current stock levels.
          </p>
        </div>
        <button 
          onClick={fetchSuggestions}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Critical Items</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {suggestions.filter(s => s.urgency === 'Critical').length}
              </h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle size={20} className="text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Suggestions</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{suggestions.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package size={20} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Est. Restock Cost</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ₹{suggestions.reduce((sum, s) => sum + (s.estimatedCost || 0), 0).toFixed(2)}
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <ShoppingCart size={20} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Preferred Suppliers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(suggestions.map(s => s.preferredSupplier?.sellerId).filter(Boolean)).size}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Truck size={20} className="text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={20} className="text-gray-500" />
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Urgency Levels</option>
            <option value="Critical">Critical</option>
            <option value="At Risk">At Risk</option>
            <option value="Watch">Watch</option>
            <option value="Safe">Safe</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4">Demand & Urgency</th>
                <th className="px-6 py-4">Suggested Reorder</th>
                <th className="px-6 py-4">Supplier Suggestion</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuggestions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900">No Reorder Suggestions Found</p>
                    <p className="mt-1">All your products have sufficient stock levels.</p>
                  </td>
                </tr>
              ) : (
                filteredSuggestions.map((suggestion) => (
                  <tr key={suggestion.productId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {suggestion.image ? (
                          <img src={suggestion.image} alt={suggestion.productName} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{suggestion.productName}</p>
                          <p className="text-xs text-gray-500">SKU: {suggestion.sku || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current:</span>
                          <span className={`font-medium ${suggestion.currentStock <= suggestion.reorderThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                            {suggestion.currentStock} {suggestion.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Incoming:</span>
                          <span className="font-medium text-blue-600">{suggestion.incomingStock} {suggestion.unit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Threshold:</span>
                          <span className="font-medium text-gray-900">{suggestion.reorderThreshold}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {getUrgencyBadge(suggestion.urgency)}
                        <div className="text-sm">
                          <span className="text-gray-500">Avg Demand: </span>
                          <span className="font-medium">{suggestion.avgDailyDemand} / day</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Stock lasts: </span>
                          <span className="font-medium">{suggestion.daysOfStock} days</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-xl font-bold text-gray-900">
                          {suggestion.suggestedQuantity} <span className="text-sm font-normal text-gray-500">{suggestion.unit}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Est. Cost: <span className="font-medium text-gray-900">₹{suggestion.estimatedCost}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Lead Time: {suggestion.leadTimeDays} days
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {suggestion.preferredSupplier ? (
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-gray-900">{suggestion.preferredSupplier.sellerName}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-500">Delivery rate:</span>
                            <span className={`font-medium ${suggestion.preferredSupplier.onTimeDeliveryRate >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                              {suggestion.preferredSupplier.onTimeDeliveryRate}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Last bought @ ₹{suggestion.estimatedPrice}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">No supplier history</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCreatePO(suggestion)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <Plus size={16} /> Create PO
                      </button>
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
};

export default SmartReorderPage;

