"use client";

const STYLES = {
  red: "bg-red-100 text-red-700 border-red-200",
  yellow: "bg-amber-100 text-amber-700 border-amber-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "demo-assisted": "bg-indigo-50 text-indigo-700 border-indigo-200",
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const PriorityPill = ({ value = "info", className = "" }) => {
  const normalized = String(value).toLowerCase();
  const style = STYLES[normalized] || STYLES.info;

  return (
    <span
      className={`${style} inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${className}`}
    >
      {normalized}
    </span>
  );
};

export default PriorityPill;
