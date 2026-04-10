import EmptyState from '../EmptyState';
import SvgBarChart from '../charts/SvgBarChart';

const CategorySection = ({ categories, loading, error, store }) => {
  const rows = categories?.rows || [];
  const chart = categories?.chart || {};
  const currency = store?.settings?.currency || 'INR';

  if (loading) {
    return <EmptyState title="Loading category performance" description="Category contribution is being calculated from sales snapshots." />;
  }

  if (error) {
    return <EmptyState title="Category analytics unavailable" description={error} />;
  }

  if (!rows.length) {
    return <EmptyState title="No category data" description="Category charts will appear once sales are available." />;
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">Categories</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Sales by category</h3>
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-4">
        <SvgBarChart labels={chart.labels || []} values={(chart.datasets?.[0]?.data || [])} color="#0f172a" accent="#10b981" />
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              {['Category', 'Revenue', 'Units', 'Avg Unit Price'].map((label) => (
                <th key={label} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.category} className="border-t border-slate-100">
                <td className="px-4 py-4 text-sm font-black text-slate-900">{row.category}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-600">₹{Number(row.revenue || 0).toLocaleString('en-IN')}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-600">{Number(row.unitsSold || 0).toLocaleString('en-IN')}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-600">₹{Number(row.averageUnitPrice || 0).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CategorySection;
