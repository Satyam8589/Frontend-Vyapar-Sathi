import { CalendarDays, CircleAlert, TrendingUp, Warehouse } from "lucide-react";
import AnalyticsPanel, { DetailRow } from "./AnalyticsPanel";
import { STOCK_STATUS_STYLES } from "../constants";
import { formatCurrency, formatDate, formatNumber } from "../utils";

export const PerformancePanel = ({ summary, performance, expiry }) => (
  <AnalyticsPanel title="Product performance" icon={TrendingUp}><div className="pt-2"><DetailRow label="Status" value={performance?.status || "N/A"} /><DetailRow label="Sales velocity" value={`${formatNumber(performance?.salesVelocity)} units/day`} /><DetailRow label="Last sold" value={formatDate(performance?.lastSoldAt)} /><DetailRow label="Average units / order" value={formatNumber(summary?.averageUnitsPerOrder)} /><DetailRow label="Expiry" value={expiry?.expiryDate ? `${formatDate(expiry.expiryDate)} (${expiry.status})` : "Not available"} valueClass={expiry?.status === "Expired" ? "text-rose-600" : "text-slate-900"} /></div></AnalyticsPanel>
);

export const StockPanel = ({ stock }) => {
  const status = stock?.status || "Unknown";
  return <AnalyticsPanel title="Stock analysis" icon={Warehouse}><div className="pt-2"><div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-3"><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Stock status</p><p className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-black ring-1 ${STOCK_STATUS_STYLES[status] || "bg-slate-100 text-slate-600 ring-slate-200"}`}>{status}</p></div><p className="text-2xl font-black text-slate-900">{formatNumber(stock?.currentStock)}</p></div><DetailRow label="Average daily sales" value={`${formatNumber(stock?.averageDailySales)} units`} /><DetailRow label="Stock cover" value={stock?.stockCoverDays == null ? "N/A" : `${stock.stockCoverDays} days`} /><DetailRow label="Minimum stock level" value={stock?.minStockLevel ?? "Not configured"} /><p className="mt-3 text-[11px] font-semibold text-slate-400">{stock?.movementMessage || "Inventory movement history is available for this product."}</p></div></AnalyticsPanel>;
};

export const PeriodSummaryPanel = ({ summary, product, currency }) => <AnalyticsPanel title="Period summary" icon={CalendarDays}><div className="pt-2"><DetailRow label="Period revenue" value={formatCurrency(summary?.totalRevenue, currency)} /><DetailRow label="Average selling price" value={formatCurrency(summary?.averageSellingPrice, currency)} /><DetailRow label="Sales velocity" value={`${formatNumber(summary?.salesVelocity)} units/day`} /><DetailRow label="Current stock" value={`${formatNumber(product?.currentStock)} ${product?.unit || "units"}`} /><div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[11px] font-semibold text-amber-800"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />Profit analytics will appear once cost snapshots are stored with sales.</div></div></AnalyticsPanel>;
