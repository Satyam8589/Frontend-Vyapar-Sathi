import { ArrowLeft, RefreshCw } from 'lucide-react';

const AnalyticsHeader = ({ store, onBack, onAiDashboard, onRefresh, refreshing = false }) => {
  return (
    <section className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-6 text-white shadow-[0_25px_90px_rgba(15,23,42,0.35)] md:px-8 md:py-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.45em] text-indigo-300">
            Analytics Command Center
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
            {store?.name || 'Store'} Performance Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-slate-300 md:text-base">
            Track sales movement, category contribution, product velocity, and slow-moving stock from a single store-scoped view.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </button>
          <button
            onClick={onAiDashboard}
            className="rounded-2xl border border-indigo-400/40 bg-indigo-400/15 px-4 py-3 text-sm font-black text-indigo-100 transition hover:bg-indigo-400/25"
          >
            AI Dashboard
          </button>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900 transition hover:scale-[1.01]"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsHeader;
