const StatsBar = ({ stats }) => {
  return (
    <section className="hidden md:block py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-3 animate-fade-in-up [animation-delay:300ms]">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
