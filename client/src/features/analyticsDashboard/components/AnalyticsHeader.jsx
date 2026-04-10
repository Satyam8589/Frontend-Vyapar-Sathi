import { ArrowLeft, RefreshCw } from 'lucide-react';

const AnalyticsHeader = ({ store, onBack, onAiDashboard, onRefresh, refreshing = false }) => {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-2.5 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 text-white shadow-[0_25px_90px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.45em] text-indigo-300">
            Analytics Command Center
          </p>
          <h1 className="mt-1 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tight sm:mt-2 md:mt-3">
            {store?.name || 'Store'} Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold leading-relaxed text-slate-300 sm:mt-2 md:mt-4">
            Track sales, categories, products, and slow-moving stock in one view.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] sm:text-xs md:text-sm font-black text-white backdrop-blur transition hover:bg-white/10 sm:px-3 sm:py-2.5 md:px-4 md:py-3"
          >
            <ArrowLeft className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
            Back
          </button>
          <button
            onClick={onAiDashboard}
            className="rounded-2xl border border-indigo-400/40 bg-indigo-400/15 px-2.5 py-1.5 text-[11px] sm:text-xs md:text-sm font-black text-indigo-100 transition hover:bg-indigo-400/25 sm:px-3 sm:py-2.5 md:px-4 md:py-3"
          >
            AI
          </button>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-2xl bg-white px-2.5 py-1.5 text-[11px] sm:text-xs md:text-sm font-black text-slate-900 transition hover:scale-[1.01] sm:px-3 sm:py-2.5 md:px-4 md:py-3"
          >
            <RefreshCw className={`h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsHeader;
