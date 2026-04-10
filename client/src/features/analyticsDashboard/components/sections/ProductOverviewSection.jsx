import { useMemo, useState } from 'react';
import EmptyState from '../EmptyState';
import SvgLineChart from '../charts/SvgLineChart';

const ProductOverviewSection = ({ productOverview, loading, error, selectedProduct, store }) => {
  const [activeMetric, setActiveMetric] = useState('revenue');
  const currency = store?.settings?.currency || 'INR';

  const chart = productOverview?.chart || {};
  const datasets = chart.datasets || [];
  const activeDataset = useMemo(() => {
    return datasets.find((dataset) => dataset.key === activeMetric) || datasets[0];
  }, [activeMetric, datasets]);

  if (loading) {
    return <EmptyState title="Loading product overview" description="Drill-down analytics are being prepared for the selected product." />;
  }

  if (error) {
    return <EmptyState title="Product overview unavailable" description={error} />;
  }

  if (!productOverview || !selectedProduct) {
    return <EmptyState title="Select a product" description="Click any top product to open its drill-down analytics." />;
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-violet-600">Product drill-down</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{productOverview?.product?.name || selectedProduct.productName}</h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {productOverview?.product?.category || selectedProduct.category || 'General'} • Current stock {Number(productOverview?.product?.currentStock || 0).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {datasets.map((dataset) => (
            <button
              key={dataset.key}
              onClick={() => setActiveMetric(dataset.key)}
              className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                activeMetric === dataset.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dataset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Revenue</p>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(Number(productOverview?.summary?.totalRevenue || 0))}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Units Sold</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{Number(productOverview?.summary?.totalUnits || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Orders</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{Number(productOverview?.summary?.totalOrders || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Stock Cover</p>
          <p className="mt-2 text-2xl font-black text-slate-900">
            {productOverview?.summary?.stockCoverDays ? `${Number(productOverview.summary.stockCoverDays).toFixed(1)} days` : 'N/A'}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-4">
        <SvgLineChart
          labels={chart.labels || []}
          values={activeDataset?.data || []}
          color="#7c3aed"
        />
      </div>
    </section>
  );
};

export default ProductOverviewSection;
