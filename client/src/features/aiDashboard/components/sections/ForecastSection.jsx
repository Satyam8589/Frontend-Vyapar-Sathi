import PriorityPill from "../PriorityPill";
import EmptyState from "./EmptyState";

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

const ForecastSection = ({ forecast = [], loading, error }) => {
  return (
    <section>
      <div className="mb-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
          Demand Forecast
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Product Demand Outlook
        </h2>
      </div>

      {loading ? (
        <EmptyState
          title="Loading forecast"
          description="Preparing product-wise demand prediction."
        />
      ) : error ? (
        <EmptyState title="Forecast unavailable" description={error} />
      ) : forecast.length ? (
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
  );
};

export default ForecastSection;
