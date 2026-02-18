const MetricsSection = () => {
  const metrics = [
    { label: 'Active Stores',       value: '500+' },
    { label: 'Daily Transactions',  value: '10k+' },
    { label: 'Uptime Guaranteed',   value: '99.9%' },
    { label: 'Data Security',       value: 'Enterprise' },
  ];

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="text-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm"
          >
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-1 sm:mb-2 leading-none">
              {metric.value}
            </p>
            <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest leading-tight">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MetricsSection;
