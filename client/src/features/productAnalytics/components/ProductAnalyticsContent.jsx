import { BarChart3, CircleAlert, ExternalLink, ShoppingCart, Tag, TrendingUp } from "lucide-react";
import MetricCard from "./MetricCard";
import ProductHeader from "./ProductHeader";
import SalesTrendPanel from "./SalesTrendPanel";
import { PerformancePanel, PeriodSummaryPanel, StockPanel } from "./ProductDetailPanels";
import TransactionsPanel from "./TransactionsPanel";
import { formatCurrency, formatDate, formatNumber } from "../utils";

const ProductAnalyticsContent = ({ analytics, onBack }) => {
  const { overview, store, loading, error, refresh, rangeDays, rangeOptions, setRangeDays, page, setPage } = analytics;
  const currency = store?.settings?.currency || "INR";
  const product = overview?.product;
  const summary = overview?.summary;

  if (loading && !overview) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-slate-500">Loading product analytics...</div>;
  }

  if (error && !overview) {
    return <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4"><div className="w-full rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"><CircleAlert className="mx-auto h-8 w-8 text-rose-500" /><h1 className="mt-3 text-lg font-black text-slate-900">Product analytics unavailable</h1><p className="mt-2 text-sm font-semibold text-slate-600">{error}</p><button onClick={refresh} className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Try again</button></div></main>;
  }

  const subtitle = overview?.range ? `${formatDate(overview.range.startDate)} - ${formatDate(overview.range.endDate)} performance` : "Complete sales and inventory insights for this product";

  return <main className="min-h-screen bg-slate-50/70 px-3 py-4 sm:px-5 lg:px-8"><div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
    <ProductHeader product={product} currency={currency} subtitle={subtitle} rangeDays={rangeDays} rangeOptions={rangeOptions} onRangeChange={setRangeDays} onBack={onBack} onRefresh={refresh} loading={loading} />

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard icon={Tag} label="Total Revenue" value={formatCurrency(summary?.totalRevenue, currency)} comparison={overview?.comparison?.revenue} tone="blue" />
      <MetricCard icon={ShoppingCart} label="Units Sold" value={formatNumber(summary?.totalUnits)} comparison={overview?.comparison?.units} tone="emerald" />
      <MetricCard icon={BarChart3} label="Total Orders" value={formatNumber(summary?.totalOrders)} comparison={overview?.comparison?.orders} tone="amber" />
      <MetricCard icon={TrendingUp} label="Average Selling Price" value={formatCurrency(summary?.averageSellingPrice, currency)} comparison={overview?.comparison?.averageSellingPrice} tone="violet" />
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]"><SalesTrendPanel chart={overview?.chart} /><PerformancePanel summary={summary} performance={overview?.performance} expiry={overview?.expiry} /></div>
    <div className="grid gap-4 lg:grid-cols-2"><StockPanel stock={overview?.stock} /><PeriodSummaryPanel summary={summary} profit={overview?.profit} product={product} currency={currency} /></div>
    <TransactionsPanel transactions={overview?.transactions} currency={currency} page={page} onPageChange={setPage} />

    {overview?.insights?.length > 0 && <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><div className="flex items-center gap-2 text-sm font-black text-blue-900"><ExternalLink className="h-4 w-4" />Product insights</div><div className="mt-3 grid gap-2 sm:grid-cols-2">{overview.insights.map((insight) => <p key={insight} className="rounded-xl bg-white/70 p-3 text-xs font-semibold text-blue-900">{insight}</p>)}</div></section>}
  </div></main>;
};

export default ProductAnalyticsContent;
