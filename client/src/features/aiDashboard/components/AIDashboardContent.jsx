"use client";

import PriorityPill from "./PriorityPill";

const formatNumber = (value) => Number(value || 0).toFixed(1);

const Metric = ({ label, value }) => (
  <div className="rounded-2xl bg-slate-50 p-3">
    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
      {label}
    </p>
    <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
  </div>
);

const ForecastCard = ({ item }) => (
  <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          {item.category}
        </p>
        <h3 className="mt-2 text-xl font-black text-slate-900">
          {item.productName}
        </h3>
      </div>
      <PriorityPill value={item.basis} />
    </div>

    <div className="mt-5 grid grid-cols-2 gap-3">
      <Metric label="Current Stock" value={item.currentStock} />
      <Metric label="Demand 7d" value={formatNumber(item.predictedDemand7d)} />
      <Metric label="Daily Demand" value={formatNumber(item.predictedDailyDemand)} />
      <Metric
        label="Trend"
        value={`${item.trendPercent >= 0 ? "+" : ""}${formatNumber(item.trendPercent)}%`}
      />
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <PriorityPill value={item.confidence} />
      <span className="text-xs font-bold text-slate-500">
        {item.daysToStockout ? `${item.daysToStockout} days to stockout` : "No stockout risk"}
      </span>
    </div>
  </article>
);

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

const RestockRow = ({ item }) => (
  <tr className="border-b border-slate-100 last:border-b-0">
    <td className="px-4 py-4">
      <div>
        <p className="font-black text-slate-900">{item.productName}</p>
        <p className="text-xs font-bold text-slate-500">
          {formatNumber(item.predictedDemand7d)} units forecasted in 7d
        </p>
      </div>
    </td>
    <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.currentStock}</td>
    <td className="px-4 py-4 text-sm font-bold text-slate-700">{item.recommendedQty}</td>
    <td className="px-4 py-4 text-sm font-bold text-slate-700">
      {item.reorderDate ? new Date(item.reorderDate).toLocaleDateString() : "Monitor"}
    </td>
    <td className="px-4 py-4">
      <PriorityPill value={item.priority} />
    </td>
    <td className="px-4 py-4">
      <PriorityPill value={item.basis} />
    </td>
  </tr>
);

const EmptyState = ({ title, description }) => (
  <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
    <h3 className="text-xl font-black text-slate-900">{title}</h3>
    <p className="mt-3 text-sm font-semibold">{description}</p>
  </div>
);

const AIDashboardContent = ({
  forecast = [],
  restock = [],
  insights = [],
  loading = false,
  error = "",
}) => {
  if (loading) {
    return (
      <EmptyState
        title="Loading AI dashboard"
        description="Generating forecasts, restock guidance, and inventory insights."
      />
    );
  }

  if (error) {
    return <EmptyState title="AI dashboard unavailable" description={error} />;
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
            Demand Forecast
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Product Demand Outlook
          </h2>
        </div>
        {forecast.length ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {forecast.slice(0, 6).map((item) => (
              <ForecastCard key={item.productId} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No forecast data yet"
            description="Complete a few sales or rely on demo-assisted history to generate product forecasts."
          />
        )}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">
            Restock Engine
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Smart Restock Plan
          </h2>
        </div>
        {restock.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Product</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Stock</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Recommended Qty</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Reorder Date</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Priority</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Basis</th>
                </tr>
              </thead>
              <tbody>
                {restock.map((item) => (
                  <RestockRow key={item.productId} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="No restock actions needed"
              description="Tracked products currently have enough inventory for the forecast horizon."
            />
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
            Intelligent Insights
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            AI Analytics Summary
          </h2>
        </div>
        {insights.length ? (
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
    </div>
  );
};

export default AIDashboardContent;
