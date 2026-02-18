import React from 'react';
import StoreModalContent from './StoreModalContent';

const MobileStorePanel = ({ filters, updateFilters, refreshStores, stats }) => {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Only render portal after client mount (avoids SSR mismatch)
  React.useEffect(() => { setMounted(true); }, []);

  return (
    <div className="md:hidden">
      {/* Store-sign trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open store overview"
        className="relative flex flex-col items-center justify-center gap-0.5 w-14 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <svg className="h-5 w-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="text-[7px] font-black uppercase tracking-widest text-blue-100 relative z-10 leading-none">
          STORES
        </span>
      </button>

      {/* Portal modal — only after client mount */}
      {mounted && (
        <StoreModalContent
          open={open}
          onClose={() => setOpen(false)}
          filters={filters}
          updateFilters={updateFilters}
          refreshStores={refreshStores}
          stats={stats}
        />
      )}
    </div>
  );
};

export default MobileStorePanel;
