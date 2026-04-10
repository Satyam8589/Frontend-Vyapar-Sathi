import PriorityPill from "../PriorityPill";
import EmptyState from "./EmptyState";

const formatNumber = (value) => Number(value || 0).toFixed(1);

const RestockRow = ({ item }) => (
  <tr className="border-b border-slate-100 last:border-b-0">
    <td className="px-4 py-4">
      <div>
        <p className="font-black text-slate-900">{item.productName}</p>
        <p className="text-xs font-bold text-slate-500">
          {formatNumber(item.predictedDemand7d)} units forecasted in 7d
        </p>
      </div>
    </td>
    <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.currentStock}</td>
    <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.recommendedQty}</td>
    <td className="px-4 py-4 text-sm font-bold text-slate-700">
      {item.reorderDate ? new Date(item.reorderDate).toLocaleDateString() : "Monitor"}
    </td>
    <td className="px-4 py-4">
      <PriorityPill value={item.priority} />
    </td>
    <td className="px-4 py-4">
      <PriorityPill value={item.basis} />
    </td>
  </tr>
);

const RestockSection = ({ restock = [], loading, error }) => {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">
          Restock Engine
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Smart Restock Plan
        </h2>
      </div>

      {loading ? (
        <div className="p-6">
          <EmptyState
            title="Loading restock plan"
            description="Computing reorder priorities from demand and stock levels."
          />
        </div>
      ) : error ? (
        <div className="p-6">
          <EmptyState title="Restock unavailable" description={error} />
        </div>
      ) : restock.length ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Product</th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Stock</th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Recommended Qty</th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Reorder Date</th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Priority</th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Basis</th>
              </tr>
            </thead>
            <tbody>
              {restock.map((item) => (
                <RestockRow key={item.productId} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState
            title="No restock actions needed"
            description="Tracked products currently have enough inventory for the forecast horizon."
          />
        </div>
      )}
    </section>
  );
};

export default RestockSection;
