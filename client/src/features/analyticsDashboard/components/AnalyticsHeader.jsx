import { ArrowLeft, RefreshCw } from 'lucide-react';

const AnalyticsHeader = ({ store, onBack, onAiDashboard, onRefresh, refreshing = false }) => {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-5 text-white shadow-[0_25px_90px_rgba(15,23,42,0.35)] sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-5">
        <div className="max-w-3xl">
          <p className="text-[8px] font-black uppercase tracking-[0.45em] text-indigo-300 sm:text-[10px]">
            Analytics Command Center
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight sm:mt-3 sm:text-3xl md:text-5xl">
            {store?.name || 'Store'} Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-xs font-semibold leading-relaxed text-slate-300 sm:mt-4 sm:text-sm md:text-base">
            Track sales, categories, products, and slow-moving stock in one view.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-black text-white backdrop-blur transition hover:bg-white/10 sm:px-4 sm:py-3 sm:text-sm"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back
          </button>
          <button
            onClick={onAiDashboard}
            className="rounded-2xl border border-indigo-400/40 bg-indigo-400/15 px-3 py-2 text-xs font-black text-indigo-100 transition hover:bg-indigo-400/25 sm:px-4 sm:py-3 sm:text-sm"
          >
            AI
          </button>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-black text-slate-900 transition hover:scale-[1.01] sm:px-4 sm:py-3 sm:text-sm"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsHeader;
