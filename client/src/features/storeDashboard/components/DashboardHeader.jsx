import MobileStorePanel from './MobileStorePanel';

const DashboardHeader = ({ onCreateStore, filters, updateFilters, refreshStores, stats }) => {
  return (
    <section className="pt-3 pb-2 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/70 border border-white/90 shadow-sm backdrop-blur-sm mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Command Center</span>
            </div>
            <h1 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">MY STORES</h1>
            <p className="mt-1 text-xs md:text-base text-slate-600 font-bold italic max-w-xl leading-snug">
              Manage and monitor your entire retail network from one central interface.
            </p>
          </div>

          <div className="animate-fade-in [animation-delay:200ms] flex items-center gap-2 mt-1 md:mt-0">
            <button
              onClick={onCreateStore}
              className="btn-primary-yb hover:scale-100 py-2.5 px-4 md:py-3 md:px-6 shadow-lg shadow-blue-500/10 flex items-center gap-2 group md:flex-none transition-all duration-200"
            >
              <svg className="h-3.5 w-3.5 md:h-4 md:w-4 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-black uppercase tracking-widest whitespace-nowrap text-[10px] md:text-sm">Create New Store</span>
            </button>

            <MobileStorePanel
              filters={filters}
              updateFilters={updateFilters}
              refreshStores={refreshStores}
              stats={stats}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default DashboardHeader;
