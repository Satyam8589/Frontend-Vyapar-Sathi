import { useRouter } from 'next/navigation';

const InventoryHeader = ({ storeId, storeName, onAddProductClick }) => {
  const router = useRouter();

  return (
    <section className="mb-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
        {/* Store Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg
              className="w-6 h-6 text-white"
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
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 truncate tracking-tight">
              {storeName || 'Stock Control'}
            </h1>
            <p className="text-xs text-slate-600 truncate font-semibold">
              Store ID: <span className="font-mono text-slate-700">{storeId}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => router.push('/storeDashboard')}
            className="px-4 py-2.5 bg-slate-100/80 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-200/80 transition-all shadow-sm flex items-center gap-2 text-sm"
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
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            onClick={onAddProductClick}
            className="btn-primary-yb py-2.5 px-5 shadow-lg flex items-center gap-2 text-sm font-bold"
          >
            <svg
              className="h-5 w-5"
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
            <span>Add Product</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default InventoryHeader;
