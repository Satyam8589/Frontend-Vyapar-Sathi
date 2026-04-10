import EmptyState from '../EmptyState';

const URGENCY_STYLE = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const SlowMovingSection = ({ slowMoving, loading, error }) => {
  const rows = slowMoving || [];

  if (loading) {
    return <EmptyState title="Loading slow-moving products" description="Inactive and slow stock are being evaluated." />;
  }

  if (error) {
    return <EmptyState title="Slow-moving products unavailable" description={error} />;
  }

  if (!rows.length) {
    return <EmptyState title="No slow-moving products" description="Nothing is currently below the inactivity threshold." />;
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-rose-600">Attention list</p>
        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Slow-moving products</h3>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50">
            <tr>
              {['Product', 'Category', 'Days Since Sale', 'Stock', 'Urgency'].map((label) => (
                <th key={label} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.productId} className="border-t border-slate-100">
                <td className="px-4 py-4 text-sm font-black text-slate-900">{row.productName}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-600">{row.category}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-600">{Number(row.daysSinceLastSale || 0).toLocaleString('en-IN')}</td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-600">{Number(row.currentStock || 0).toLocaleString('en-IN')}</td>
                <td className="px-4 py-4 text-sm">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${URGENCY_STYLE[row.urgency] || URGENCY_STYLE.low}`}>
                    {row.urgency}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SlowMovingSection;
