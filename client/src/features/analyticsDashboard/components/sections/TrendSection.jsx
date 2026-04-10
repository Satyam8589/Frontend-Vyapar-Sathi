import { useEffect, useMemo, useState } from "react";
import EmptyState from "../EmptyState";
import SvgLineChart from "../charts/SvgLineChart";

const formatMetricValue = (metric, value) => {
  if (metric === "revenue") {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  }

  return Number(value || 0).toLocaleString("en-IN");
};

const TrendSection = ({ trend, loading, error }) => {
  const datasets = trend?.chart?.datasets || [];
  const labels = trend?.chart?.labels || [];
  const [selectedMetric, setSelectedMetric] = useState(
    datasets[0]?.key || "revenue",
  );

  const defaultMetric = datasets[0]?.key || "revenue";

  useEffect(() => {
    if (!datasets.some((dataset) => dataset.key === selectedMetric)) {
      setSelectedMetric(defaultMetric);
    }
  }, [datasets, defaultMetric, selectedMetric]);

  const activeDataset = useMemo(
    () =>
      datasets.find((dataset) => dataset.key === selectedMetric) || datasets[0],
    [datasets, selectedMetric],
  );

  if (loading) {
    return (
      <EmptyState
        title="Loading trend chart"
        description="Daily sales, revenue, and order trend is being prepared."
      />
    );
  }

  if (error) {
    return <EmptyState title="Trend unavailable" description={error} />;
  }

  if (!activeDataset) {
    return (
      <EmptyState
        title="No trend data yet"
        description="Sales activity will appear here once orders start flowing."
      />
    );
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-3 sm:p-4 md:p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
        <div>
          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] text-blue-600">
            Sales trend
          </p>
          <h3 className="mt-0.5 text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight text-slate-900 sm:mt-1 md:mt-2">
            Daily movement
          </h3>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
          {datasets.map((dataset) => (
            <button
              key={dataset.key}
              onClick={() => setSelectedMetric(dataset.key)}
              className={`rounded-2xl px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 md:px-4 md:py-2 md:text-sm font-black transition ${
                selectedMetric === dataset.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {dataset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3.5 md:mt-5 rounded-[1.75rem] bg-slate-50 p-1.5 sm:p-2.5 md:p-4">
        <SvgLineChart
          labels={labels}
          values={activeDataset.data}
          color="#4f46e5"
        />
      </div>

      <div className="mt-2.5 sm:mt-3.5 md:mt-5 grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2 md:gap-3">
        {datasets.map((dataset) => (
          <div
            key={dataset.key}
            className="rounded-2xl bg-slate-50 p-1.5 sm:p-2.5 md:p-4"
          >
            <p className="text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-wider text-slate-500">
              {dataset.label}
            </p>
            <p className="mt-0.5 text-xs sm:text-sm md:text-lg font-black text-slate-900 sm:mt-1 md:mt-2">
              {formatMetricValue(
                dataset.key,
                dataset.data.reduce(
                  (sum, value) => sum + Number(value || 0),
                  0,
                ),
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendSection;
