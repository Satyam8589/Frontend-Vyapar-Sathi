const formatMoney = (value, currency) => {
  const amount = Number(value || 0);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency || "₹"}${amount.toLocaleString("en-IN")}`;
  }
};

const SummaryCard = ({ label, value, hint, tone = "slate" }) => {
  const tones = {
    slate: "from-slate-900 to-slate-700",
    indigo: "from-indigo-600 to-indigo-500",
    emerald: "from-emerald-600 to-emerald-500",
    amber: "from-amber-600 to-amber-500",
    cyan: "from-cyan-600 to-cyan-500",
  };

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
      <div
        className={`inline-flex rounded-2xl bg-gradient-to-r ${tones[tone] || tones.slate} px-3 py-1 text-[8px] font-black uppercase tracking-[0.35em] text-white sm:text-[10px]`}
      >
        {label}
      </div>
      <p className="mt-3 text-lg font-black tracking-tight text-slate-900 sm:mt-4 sm:text-2xl md:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500 sm:mt-2 sm:text-sm">
        {hint}
      </p>
    </article>
  );
};

const AnalyticsSummaryGrid = ({ summary, store }) => {
  const cards = summary?.cards || {};
  const currency = store?.settings?.currency || "INR";

  const items = [
    {
      label: "Revenue",
      value: formatMoney(cards.revenue, currency),
      hint: "Total sales value for the selected period.",
      tone: "indigo",
    },
    {
      label: "Units Sold",
      value: Number(cards.unitsSold || 0).toLocaleString("en-IN"),
      hint: "Number of individual product units sold.",
      tone: "emerald",
    },
    {
      label: "Orders",
      value: Number(cards.orderCount || 0).toLocaleString("en-IN"),
      hint: "Completed sale transactions.",
      tone: "amber",
    },
    {
      label: "Avg. Order Value",
      value: formatMoney(cards.averageOrderValue, currency),
      hint: "Average value per completed order.",
      tone: "cyan",
    },
    {
      label: "Active Products",
      value: Number(cards.activeProducts || 0).toLocaleString("en-IN"),
      hint: "Products currently active in this store.",
      tone: "slate",
    },
    {
      label: "Products Sold",
      value: Number(cards.productsSold || 0).toLocaleString("en-IN"),
      hint: "Unique products that moved in this range.",
      tone: "indigo",
    },
    {
      label: "Low Stock",
      value: Number(cards.lowStockCount || 0).toLocaleString("en-IN"),
      hint: "Items close to threshold.",
      tone: "amber",
    },
    {
      label: "Out of Stock",
      value: Number(cards.outOfStockCount || 0).toLocaleString("en-IN"),
      hint: "Items needing immediate attention.",
      tone: "emerald",
    },
  ];

  return (
    <section>
      <div className="mb-2.5 flex items-end justify-between gap-2.5 sm:gap-4">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.35em] text-indigo-600 sm:text-[9px] md:text-[10px]">
            Snapshot
          </p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:mt-2 sm:text-xl md:text-3xl">
            Store performance
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
};

export default AnalyticsSummaryGrid;
