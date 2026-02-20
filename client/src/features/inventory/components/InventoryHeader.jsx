import { useRouter } from 'next/navigation';

const InventoryHeader = ({ storeId, storeName, onAddProductClick }) => {
  const router = useRouter();

  return (
    <section className="mb-4 animate-fade-in-up">
      <div className="flex items-center justify-between gap-2 sm:gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
        {/* Back Button - Left */}
        <button
          onClick={() => router.push('/storeDashboard')}
          className="flex-shrink-0 p-2 sm:px-4 sm:py-2.5 bg-slate-100/80 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-200/80 transition-all shadow-sm flex items-center gap-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden sm:inline text-sm">Back</span>
        </button>

        {/* Store Info - Center */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 truncate tracking-tight">
            {storeName || 'Stock Control'}
          </h1>
        </div>

        {/* Add Product Button - Right */}
        <button
          onClick={onAddProductClick}
          className="flex-shrink-0 btn-primary-yb py-2 sm:py-2.5 px-3 sm:px-4 shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="sm:hidden">Add</span>
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>
    </section>
  );
};

export default InventoryHeader;
