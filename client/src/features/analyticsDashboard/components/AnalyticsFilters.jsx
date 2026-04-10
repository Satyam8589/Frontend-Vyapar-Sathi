const RANGE_OPTIONS = [
  { label: "7D", value: "7" },
  { label: "30D", value: "30" },
  { label: "90D", value: "90" },
];

const AnalyticsFilters = ({ rangeDays, onRangeChange, store }) => {
  return (
    <section className="flex flex-col gap-2 sm:gap-3 md:gap-4 rounded-[2rem] border border-slate-200 bg-white px-2.5 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
          Date Range
        </p>
        <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1.5 sm:gap-2">
          {RANGE_OPTIONS.map((option) => {
            const active = String(rangeDays) === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onRangeChange(option.value)}
                className={`rounded-2xl px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 md:px-4 md:py-2 md:text-xs lg:text-sm font-black transition ${
                  active
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:gap-2 md:gap-3">
        <div className="rounded-2xl bg-slate-50 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">
            Store Type
          </p>
          <p className="mt-0.5 text-[10px] sm:text-xs md:text-sm font-black text-slate-900 sm:mt-1">
            {store?.businessType || "Store"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">
            Currency
          </p>
          <p className="mt-0.5 text-[10px] sm:text-xs md:text-sm font-black text-slate-900 sm:mt-1">
            {store?.settings?.currency || "INR"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">
            Scope
          </p>
          <p className="mt-0.5 text-[10px] sm:text-xs md:text-sm font-black text-slate-900 sm:mt-1">
            Store + Drill-down
          </p>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsFilters;
