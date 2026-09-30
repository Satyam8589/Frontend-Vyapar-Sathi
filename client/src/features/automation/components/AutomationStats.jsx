import { Activity, CheckCircle2, Clock3 } from "lucide-react";

const STAT_STYLES = { blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", violet: "bg-violet-50 text-violet-600" };

export default function AutomationStats({ automations }) {
  const stats = [
    { label: "Active rules", value: automations.filter((item) => item.status === "ACTIVE").length, icon: Clock3, tone: "blue" },
    { label: "Total executions", value: automations.reduce((total, item) => total + (item.runCount || 0), 0), icon: CheckCircle2, tone: "emerald" },
    { label: "Automation engine", value: "Operational", icon: Activity, tone: "violet" },
  ];
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{stats.map(({ label, value, icon: Icon, tone }) => <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-900">{value}</p></div><div className={`rounded-xl p-3 ${STAT_STYLES[tone]}`}><Icon className="h-5 w-5" /></div></div>)}</div>;
}
