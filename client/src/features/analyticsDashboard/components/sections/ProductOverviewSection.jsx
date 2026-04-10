import { useMemo, useState } from "react";
import EmptyState from "../EmptyState";
import SvgLineChart from "../charts/SvgLineChart";

const ProductOverviewSection = ({
  productOverview,
  loading,
  error,
  selectedProduct,
  store,
}) => {
  const [activeMetric, setActiveMetric] = useState("revenue");
  const currency = store?.settings?.currency || "INR";

  const chart = productOverview?.chart || {};
  const datasets = chart.datasets || [];
  const activeDataset = useMemo(() => {
    return (
      datasets.find((dataset) => dataset.key === activeMetric) || datasets[0]
    );
  }, [activeMetric, datasets]);

  if (loading) {
    return (
      <EmptyState
        title="Loading product overview"
        description="Drill-down analytics are being prepared for the selected product."
      />
    );
  }

  if (error) {
    return (
      <EmptyState title="Product overview unavailable" description={error} />
    );
  }

  if (!productOverview || !selectedProduct) {
    return (
      <EmptyState
        title="Select a product"
        description="Click any top product to open its drill-down analytics."
      />
    );
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-violet-600 sm:text-[10px]">
            Product drill-down
          </p>
          <h3 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:mt-2 sm:text-2xl">
            {productOverview?.product?.name || selectedProduct.productName}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500 sm:mt-2 sm:text-sm">
            {productOverview?.product?.category ||
              selectedProduct.category ||
              "General"}{" "}
            • Stock{" "}
            {Number(productOverview?.product?.currentStock || 0).toLocaleString(
              "en-IN",
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {datasets.map((dataset) => (
            <button
              key={dataset.key}
              onClick={() => setActiveMetric(dataset.key)}
              className={`rounded-2xl px-2.5 py-1 text-[11px] font-black transition sm:px-4 sm:py-2 sm:text-sm ${
                activeMetric === dataset.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {dataset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">
            Revenue
          </p>
          <p className="mt-1 text-lg font-black text-slate-900 sm:mt-2 sm:text-2xl">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency,
            }).format(Number(productOverview?.summary?.totalRevenue || 0))}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">
            Units Sold
          </p>
          <p className="mt-1 text-lg font-black text-slate-900 sm:mt-2 sm:text-2xl">
            {Number(productOverview?.summary?.totalUnits || 0).toLocaleString(
              "en-IN",
            )}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">
            Orders
          </p>
          <p className="mt-1 text-lg font-black text-slate-900 sm:mt-2 sm:text-2xl">
            {Number(productOverview?.summary?.totalOrders || 0).toLocaleString(
              "en-IN",
            )}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 sm:text-[10px]">
            Stock Cover
          </p>
          <p className="mt-1 text-lg font-black text-slate-900 sm:mt-2 sm:text-2xl">
            {productOverview?.summary?.stockCoverDays
              ? `${Number(productOverview.summary.stockCoverDays).toFixed(1)} days`
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-[1.75rem] bg-slate-50 p-2 sm:mt-5 sm:p-4">
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
