const SearchFiltersSection = ({ filters, updateFilters, refreshStores }) => {
  return (
    <section className="py-3 px-4 md:px-6">
      <div className="max-w-7xl mx-auto transition-all duration-300 animate-fade-in-up [animation-delay:400ms]">
        <div className="bg-white/80 rounded-2xl p-3 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            {/* Search Input */}
            <div className="flex-1 max-w-md relative group">
              <input
                type="text"
                placeholder="Search stores..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-bold"
              />
              <svg className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-2">
              <select
                value={filters.businessType}
                onChange={(e) => updateFilters({ businessType: e.target.value })}
                className="px-3 py-2.5 text-sm bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="px-3 py-2.5 text-sm bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="created-desc">Newest</option>
                <option value="name-asc">A-Z</option>
              </select>

              <button
                onClick={refreshStores}
                className="p-2.5 bg-white/50 border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-white transition-all shadow-sm"
                title="Refresh"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFiltersSection;
