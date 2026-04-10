import EmptyState from '../EmptyState';
import SvgBarChart from '../charts/SvgBarChart';

const TopProductsSection = ({ topProducts, loading, error, onSelectProduct, selectedProductId, store }) => {
  const rows = topProducts || [];

  if (loading) {
    return <EmptyState title="Loading top products" description="Product ranking is being assembled from sales data." />;
  }

  if (error) {
    return <EmptyState title="Top products unavailable" description={error} />;
  }

  if (!rows.length) {
    return <EmptyState title="No top products yet" description="Product rankings will appear once products start selling." />;
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-indigo-600">Products</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Top performing products</h3>
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-4">
        <SvgBarChart labels={rows.slice(0, 6).map((row) => row.productName)} values={rows.slice(0, 6).map((row) => row.revenue)} color="#111827" accent="#4f46e5" />
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              {['Product', 'Revenue', 'Units', 'Orders'].map((label) => (
                <th key={label} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const active = String(selectedProductId) === String(row._id || row.productId);
              return (
                <tr
                  key={row._id || row.productId}
                  onClick={() => onSelectProduct(row._id || row.productId)}
                  className={`cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 ${active ? 'bg-indigo-50/60' : ''}`}
                >
                  <td className="px-4 py-4 text-sm font-black text-slate-900">{row.productName}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-600">₹{Number(row.revenue || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-600">{Number(row.unitsSold || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-600">{Number(row.orderCount || 0).toLocaleString('en-IN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TopProductsSection;
