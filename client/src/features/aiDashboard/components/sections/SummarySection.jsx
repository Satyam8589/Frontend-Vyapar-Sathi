import EmptyState from "./EmptyState";

const SummaryCard = ({ summary }) => {
  if (!summary) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
            Store Overview
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            {summary.title || "Store sales overview"}
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm font-semibold leading-relaxed text-slate-700">
            {summary.summary}
          </p>
          {summary.recommendation && (
            <div className="mt-5 rounded-2xl border border-indigo-100 bg-white/80 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                Recommended next step
              </p>
              <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-relaxed text-slate-700">
                {summary.recommendation}
              </p>
            </div>
          )}
        </div>
        <div className="grid min-w-[220px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Summary Mode
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {summary.llmUsed ? "LLM" : "Fallback"}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Basis
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {summary.basis || "live"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SummarySection = ({ summary, loading, error }) => {
  if (loading) {
    return (
      <EmptyState
        title="Generating store summary"
        description="The detailed store-level narrative is being prepared."
      />
    );
  }

  if (summary) {
    return <SummaryCard summary={summary} />;
  }

  return (
    <EmptyState
      title="Summary unavailable"
      description={error || "Store summary could not be generated right now."}
    />
  );
};

export default SummarySection;
