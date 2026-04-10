import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../EmptyState';
import SvgLineChart from '../charts/SvgLineChart';

const formatMetricValue = (metric, value) => {
  if (metric === 'revenue') {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
  }

  return Number(value || 0).toLocaleString('en-IN');
};

const TrendSection = ({ trend, loading, error }) => {
  const datasets = trend?.chart?.datasets || [];
  const labels = trend?.chart?.labels || [];
  const [selectedMetric, setSelectedMetric] = useState(datasets[0]?.key || 'revenue');

  const defaultMetric = datasets[0]?.key || 'revenue';

  useEffect(() => {
    if (!datasets.some((dataset) => dataset.key === selectedMetric)) {
      setSelectedMetric(defaultMetric);
    }
  }, [datasets, defaultMetric, selectedMetric]);

  const activeDataset = useMemo(
    () => datasets.find((dataset) => dataset.key === selectedMetric) || datasets[0],
    [datasets, selectedMetric]
  );

  if (loading) {
    return <EmptyState title="Loading trend chart" description="Daily sales, revenue, and order trend is being prepared." />;
  }

  if (error) {
    return <EmptyState title="Trend unavailable" description={error} />;
  }

  if (!activeDataset) {
    return <EmptyState title="No trend data yet" description="Sales activity will appear here once orders start flowing." />;
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-blue-600 sm:text-[10px]">Sales trend</p>
          <h3 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:mt-2 sm:text-2xl">Daily movement</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {datasets.map((dataset) => (
            <button
              key={dataset.key}
              onClick={() => setSelectedMetric(dataset.key)}
              className={`rounded-2xl px-2.5 py-1 text-[11px] font-black transition sm:px-4 sm:py-2 sm:text-sm ${
                selectedMetric === dataset.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dataset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-[1.75rem] bg-slate-50 p-2 sm:mt-5 sm:p-4">
        <SvgLineChart labels={labels} values={activeDataset.data} color="#4f46e5" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-4 sm:gap-3">
        {datasets.map((dataset) => (
          <div key={dataset.key} className="rounded-2xl bg-slate-50 p-2 sm:p-4">
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">{dataset.label}</p>
            <p className="mt-1 text-sm font-black text-slate-900 sm:mt-2 sm:text-lg">
              {formatMetricValue(dataset.key, dataset.data.reduce((sum, value) => sum + Number(value || 0), 0))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendSection;
