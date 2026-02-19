import ReactDOM from 'react-dom';

const StoreModalContent = ({ open, onClose, filters, updateFilters, refreshStores, stats }) => {
  return ReactDOM.createPortal(
    <>
      {/* Blurred backdrop */}
      <div
        onClick={onClose}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        className={[
          'fixed inset-0 z-[99998]',
          'bg-slate-900/50 backdrop-blur-sm',
          'transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      />

      {/* Centred card */}
      <div
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        className={[
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'w-[88vw] max-w-sm z-[99999]',
          'transition-all duration-300 origin-center',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
        ].join(' ')}
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/30 overflow-hidden border border-slate-200/60">

          {/* Gradient header */}
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 pt-5 pb-6">
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-10 translate-x-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-8 -translate-x-8 pointer-events-none" />

            {/* ✕ Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/40 text-white transition-all duration-200 z-20"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-200">Command Center</p>
                <h2 className="text-lg font-black text-white tracking-tight leading-none">Store Overview</h2>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-1 mt-4 relative z-10">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black text-white leading-none">{stat.value}</p>
                  <p className="text-[8px] font-bold text-blue-200 uppercase tracking-wide mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filter controls */}
          <div className="px-5 py-4 space-y-3 bg-slate-50/60">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Filters</p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</label>
              <div className="relative">
                <select
                  value={filters.businessType}
                  onChange={(e) => updateFilters({ businessType: e.target.value })}
                  className="w-full px-3 py-2.5 pr-8 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="all">All Types</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                </select>
                <svg className="absolute right-2.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort By</label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilters({ sortBy: e.target.value })}
                  className="w-full px-3 py-2.5 pr-8 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                >
                  <option value="created-desc">Newest First</option>
                  <option value="name-asc">Name A–Z</option>
                </select>
                <svg className="absolute right-2.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { refreshStores(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Stores
            </button>
          </div>

        </div>
      </div>
    </>,
    document.body
  );
};

export default StoreModalContent;
