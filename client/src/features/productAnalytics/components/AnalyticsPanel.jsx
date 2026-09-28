const AnalyticsPanel = ({ title, icon: Icon, children, action }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-black text-slate-900">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
);

export const DetailRow = ({ label, value, valueClass = "text-slate-900" }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
    <span className="text-xs font-semibold text-slate-500">{label}</span>
    <span className={`text-right text-xs font-black ${valueClass}`}>{value}</span>
  </div>
);

export default AnalyticsPanel;
