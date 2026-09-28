import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import SvgLineChart from "@/features/analyticsDashboard/components/charts/SvgLineChart";
import AnalyticsPanel from "./AnalyticsPanel";
import { formatDate } from "../utils";

const SalesTrendPanel = ({ chart }) => {
  const datasets = chart?.datasets || [];
  const [metric, setMetric] = useState("revenue");
  const activeDataset = useMemo(() => datasets.find((item) => item.key === metric) || datasets[0], [datasets, metric]);

  useEffect(() => {
    if (!datasets.some((dataset) => dataset.key === metric)) setMetric(datasets[0]?.key || "revenue");
  }, [datasets, metric]);

  return (
    <AnalyticsPanel title="Sales trend" icon={BarChart3} action={<div className="flex rounded-lg bg-slate-100 p-1">{datasets.map((dataset) => <button key={dataset.key} onClick={() => setMetric(dataset.key)} className={`rounded-md px-2.5 py-1.5 text-[10px] font-black ${metric === dataset.key ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>{dataset.label}</button>)}</div>}>
      {activeDataset ? <div className="pt-4"><SvgLineChart labels={(chart.labels || []).map((label) => formatDate(label, { day: "numeric", month: "short" }))} values={activeDataset.data || []} color="#2563eb" /></div> : <p className="py-12 text-center text-sm font-semibold text-slate-500">No sales trend data for this period.</p>}
    </AnalyticsPanel>
  );
};

export default SalesTrendPanel;
