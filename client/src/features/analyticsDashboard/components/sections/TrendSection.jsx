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
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-600">Sales trend</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Daily movement over time</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {datasets.map((dataset) => (
            <button
              key={dataset.key}
              onClick={() => setSelectedMetric(dataset.key)}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
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

      <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-4">
        <SvgLineChart labels={labels} values={activeDataset.data} color="#4f46e5" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {datasets.map((dataset) => (
          <div key={dataset.key} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{dataset.label}</p>
            <p className="mt-2 text-lg font-black text-slate-900">
              {formatMetricValue(dataset.key, dataset.data.reduce((sum, value) => sum + Number(value || 0), 0))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendSection;
