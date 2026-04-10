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
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-rose-600 sm:text-[10px]">Attention</p>
        <h3 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:mt-2 sm:text-2xl\">Slow-moving products</h3>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[1.75rem] border border-slate-200">
        <table className="w-full border-collapse text-left min-w-max">
          <thead className="bg-slate-50">
            <tr>
              {['Product', 'Days Since Sale', 'Urgency'].map((label) => (
                <th key={label} className="px-3 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 sm:px-4 sm:text-[10px]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.productId} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-3 text-xs font-black text-slate-900 sm:px-4 sm:py-4 sm:text-sm">{row.productName}</td>
                <td className="px-3 py-3 text-xs font-semibold text-slate-600 sm:px-4 sm:py-4 sm:text-sm">{Number(row.daysSinceLastSale || 0)}</td>
                <td className="px-3 py-3 text-xs sm:px-4 sm:py-4 sm:text-sm">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.2em] sm:px-3 sm:text-[10px] ${URGENCY_STYLE[row.urgency] || URGENCY_STYLE.low}`}>
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
