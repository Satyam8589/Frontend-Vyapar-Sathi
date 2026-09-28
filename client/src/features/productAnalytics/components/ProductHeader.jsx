import { ArrowLeft, Package, RefreshCw } from "lucide-react";
import { formatCurrency, formatNumber } from "../utils";

const ProductHeader = ({ product, currency, subtitle, rangeDays, rangeOptions, onRangeChange, onBack, onRefresh, loading }) => (
  <>
    <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        <button onClick={onBack} aria-label="Back" className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><ArrowLeft className="h-4 w-4" /></button>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-600">Analytics / Single Product</p>
          <h1 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{product?.name || "Product analytics"}</h1>
          <p className="mt-1 text-xs font-semibold text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {rangeOptions.map((option) => (
            <button key={option.value} onClick={() => onRangeChange(option.value)} className={`rounded-lg px-3 py-2 text-xs font-black transition ${rangeDays === option.value ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`}>{option.label}</button>
          ))}
        </div>
        <button onClick={onRefresh} aria-label="Refresh analytics" className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button>
      </div>
    </header>

    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-slate-100">{product?.image ? <img src={product.image} alt={product.name} className="h-full w-full object-contain" /> : <Package className="h-9 w-9 text-slate-400" />}</div>
      <div>
        <div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-black text-slate-950">{product?.name || "Selected product"}</h2><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">{product?.status || "Active"}</span></div>
        <p className="mt-1 text-xs font-semibold text-slate-500">{product?.category || "General"} {product?.unit ? `• ${product.unit}` : ""}</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-slate-500"><span>SKU: <strong className="text-slate-900">{product?.sku || "N/A"}</strong></span><span>Barcode: <strong className="text-slate-900">{product?.barcode || "N/A"}</strong></span></div>
      </div>
      <div className="border-t border-slate-100 pt-3 text-left sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right"><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Current selling price</p><p className="mt-1 text-2xl font-black text-slate-950">{formatCurrency(product?.currentPrice, currency)}</p><p className="mt-1 text-xs font-semibold text-slate-500">Stock: <strong className="text-slate-900">{formatNumber(product?.currentStock)} {product?.unit || "units"}</strong></p></div>
    </section>
  </>
);

export default ProductHeader;
