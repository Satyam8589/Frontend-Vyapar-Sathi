import PriorityPill from "../PriorityPill";
import EmptyState from "./EmptyState";

const InsightCard = ({ insight }) => (
  <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          {insight.type.replaceAll("_", " ")}
        </p>
        <h3 className="mt-2 text-xl font-black text-slate-900">
          {insight.title}
        </h3>
      </div>
      <PriorityPill value={insight.severity} />
    </div>

    <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-600">
      {insight.summary}
    </p>

    <div className="mt-4 flex flex-wrap gap-2">
      <PriorityPill value={insight.basis} />
      <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
        {insight.metrics?.length || 0} supporting items
      </span>
    </div>
  </article>
);

const InsightsSection = ({ insights = [], loading, error }) => {
  return (
    <section>
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
          Intelligent Insights
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          AI Analytics Summary
        </h2>
      </div>

      {loading ? (
        <EmptyState
          title="Loading insight cards"
          description="Analyzing trends, dead stock, and restock urgency."
        />
      ) : error ? (
        <EmptyState title="Insights unavailable" description={error} />
      ) : insights.length ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {insights.map((insight, index) => (
            <InsightCard key={`${insight.type}-${index}`} insight={insight} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No insight cards yet"
          description="Insights will appear here once the system has enough inventory and sales data to analyze."
        />
      )}
    </section>
  );
};

export default InsightsSection;
