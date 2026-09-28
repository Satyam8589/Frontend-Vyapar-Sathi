import { TrendingDown, TrendingUp } from "lucide-react";
import { getComparisonLabel } from "../utils";

const TONE_STYLES = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

const MetricCard = ({ icon: Icon, label, value, comparison, tone = "blue" }) => {
  const positive = Number(comparison?.percentageChange || 0) >= 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className={`rounded-xl p-2 ${TONE_STYLES[tone] || TONE_STYLES.blue}`}>
          <Icon className="h-4 w-4" />
        </div>
        {comparison && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {comparison.percentageChange === null ? "N/A" : `${Math.abs(comparison.percentageChange)}%`}
          </span>
        )}
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-[10px] font-semibold text-slate-400">{getComparisonLabel(comparison)}</p>
    </article>
  );
};

export default MetricCard;
