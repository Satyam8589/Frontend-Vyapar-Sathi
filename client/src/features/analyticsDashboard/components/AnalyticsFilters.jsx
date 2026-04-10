const RANGE_OPTIONS = [
  { label: '7D', value: '7' },
  { label: '30D', value: '30' },
  { label: '90D', value: '90' },
];

const AnalyticsFilters = ({ rangeDays, onRangeChange, store }) => {
  return (
    <section className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-slate-500 sm:text-[10px]">Date Range</p>
        <div className="mt-2 flex flex-wrap gap-2 sm:mt-3">
          {RANGE_OPTIONS.map((option) => {
            const active = String(rangeDays) === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onRangeChange(option.value)}
                className={`rounded-2xl px-3 py-1.5 text-xs font-black transition sm:px-4 sm:py-2 sm:text-sm ${
                  active
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        <div className="rounded-2xl bg-slate-50 px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">Store Type</p>
          <p className="mt-0.5 text-xs font-black text-slate-900 sm:mt-1 sm:text-sm">{store?.businessType || 'Store'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">Currency</p>
          <p className="mt-0.5 text-xs font-black text-slate-900 sm:mt-1 sm:text-sm">{store?.settings?.currency || 'INR'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 sm:px-4 sm:py-3">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">Scope</p>
          <p className="mt-0.5 text-xs font-black text-slate-900 sm:mt-1 sm:text-sm">Store + Drill-down</p>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsFilters;
