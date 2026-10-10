import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, ShoppingCart, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import api from "@/servies/api";

export default function DashboardAlertWidget() {
  const [counts, setCounts] = useState({ outOfStock: 0, lowStock: 0, purchaseDue: 0, poPending: 0 });
  const [loading, setLoading] = useState(true);
  const { storeId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!storeId) return;
    
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // Fetch out of stock
        const oosRes = await api.get(`/notifications/${storeId}?type=OUT_OF_STOCK&isRead=false`);
        // Fetch low stock
        const lsRes = await api.get(`/notifications/${storeId}?type=LOW_STOCK&isRead=false`);
        // Fetch purchase due
        const pdRes = await api.get(`/notifications/${storeId}?type=PURCHASE_DUE&isRead=false`);
        // Fetch purchase order pending
        const poRes = await api.get(`/notifications/${storeId}?type=PURCHASE_ORDER_PENDING&isRead=false`);
        
        setCounts({
          outOfStock: oosRes.data?.data?.pagination?.total || 0,
          lowStock: lsRes.data?.data?.pagination?.total || 0,
          purchaseDue: pdRes.data?.data?.pagination?.total || 0,
          poPending: poRes.data?.data?.pagination?.total || 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard alerts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [storeId]);

  if (loading || (counts.outOfStock === 0 && counts.lowStock === 0 && counts.purchaseDue === 0 && counts.poPending === 0)) {
    return null; // Don't show if no alerts or loading
  }

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800">Inventory Alerts</h3>
        <button 
          onClick={() => {
            // Trigger bell click or navigate to a dedicated alerts page if it exists
            const bellBtn = document.querySelector('button[aria-label="Open notifications"]');
            if (bellBtn) bellBtn.click();
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5 flex flex-wrap gap-4">
        {counts.outOfStock > 0 && (
          <button 
            onClick={() => router.push(`/storeDashboard/${storeId}/products`)}
            className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-red-700">{counts.outOfStock}</p>
              <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Out of Stock</p>
            </div>
          </button>
        )}
        
        {counts.lowStock > 0 && (
          <button 
            onClick={() => router.push(`/storeDashboard/${storeId}/products`)}
            className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-amber-700">{counts.lowStock}</p>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Low Stock</p>
            </div>
          </button>
        )}
        
        {counts.purchaseDue > 0 && (
          <button 
            onClick={() => router.push(`/storeDashboard/${storeId}/purchases`)}
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-blue-700">{counts.purchaseDue}</p>
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Purchases Due</p>
            </div>
          </button>
        )}
        
        {counts.poPending > 0 && (
          <button 
            onClick={() => router.push(`/storeDashboard/${storeId}/purchases/orders`)}
            className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-indigo-700">{counts.poPending}</p>
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Pending POs</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
