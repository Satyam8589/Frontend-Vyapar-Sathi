const formatMoney = (value, currency) => {
  const amount = Number(value || 0);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency || '₹'}${amount.toLocaleString('en-IN')}`;
  }
};

const SummaryCard = ({ label, value, hint, tone = 'slate' }) => {
  const tones = {
    slate: 'from-slate-900 to-slate-700',
    indigo: 'from-indigo-600 to-indigo-500',
    emerald: 'from-emerald-600 to-emerald-500',
    amber: 'from-amber-600 to-amber-500',
    cyan: 'from-cyan-600 to-cyan-500',
  };

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-2xl bg-gradient-to-r ${tones[tone] || tones.slate} px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em] text-white`}>
        {label}
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">{hint}</p>
    </article>
  );
};

const AnalyticsSummaryGrid = ({ summary, store }) => {
  const cards = summary?.cards || {};
  const currency = store?.settings?.currency || 'INR';

  const items = [
    {
      label: 'Revenue',
      value: formatMoney(cards.revenue, currency),
      hint: 'Total sales value for the selected period.',
      tone: 'indigo',
    },
    {
      label: 'Units Sold',
      value: Number(cards.unitsSold || 0).toLocaleString('en-IN'),
      hint: 'Number of individual product units sold.',
      tone: 'emerald',
    },
    {
      label: 'Orders',
      value: Number(cards.orderCount || 0).toLocaleString('en-IN'),
      hint: 'Completed sale transactions.',
      tone: 'amber',
    },
    {
      label: 'Avg. Order Value',
      value: formatMoney(cards.averageOrderValue, currency),
      hint: 'Average value per completed order.',
      tone: 'cyan',
    },
    {
      label: 'Active Products',
      value: Number(cards.activeProducts || 0).toLocaleString('en-IN'),
      hint: 'Products currently active in this store.',
      tone: 'slate',
    },
    {
      label: 'Products Sold',
      value: Number(cards.productsSold || 0).toLocaleString('en-IN'),
      hint: 'Unique products that moved in this range.',
      tone: 'indigo',
    },
    {
      label: 'Low Stock',
      value: Number(cards.lowStockCount || 0).toLocaleString('en-IN'),
      hint: 'Items close to threshold.',
      tone: 'amber',
    },
    {
      label: 'Out of Stock',
      value: Number(cards.outOfStockCount || 0).toLocaleString('en-IN'),
      hint: 'Items needing immediate attention.',
      tone: 'emerald',
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-indigo-600">Snapshot</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Store performance at a glance</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
};

export default AnalyticsSummaryGrid;
