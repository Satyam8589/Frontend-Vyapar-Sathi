import EmptyState from "../EmptyState";
import SvgBarChart from "../charts/SvgBarChart";

const CategorySection = ({ categories, loading, error, store }) => {
  const rows = categories?.rows || [];
  const chart = categories?.chart || {};
  const currency = store?.settings?.currency || "INR";

  if (loading) {
    return (
      <EmptyState
        title="Loading category performance"
        description="Category contribution is being calculated from sales snapshots."
      />
    );
  }

  if (error) {
    return (
      <EmptyState title="Category analytics unavailable" description={error} />
    );
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No category data"
        description="Category charts will appear once sales are available."
      />
    );
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-emerald-600 sm:text-[10px]">
            Categories
          </p>
          <h3 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:mt-2 sm:text-2xl">
            Sales by category
          </h3>
        </div>
      </div>

      <div className="mt-3 rounded-[1.75rem] bg-slate-50 p-2 sm:mt-5 sm:p-4">
        <SvgBarChart
          labels={chart.labels || []}
          values={chart.datasets?.[0]?.data || []}
          color="#0f172a"
          accent="#10b981"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-[1.75rem] border border-slate-200">
        <table className="w-full border-collapse text-left min-w-max">
          <thead className="bg-slate-50">
            <tr>
              {["Category", "Revenue", "Units"].map((label) => (
                <th
                  key={label}
                  className="px-3 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 sm:px-4 sm:text-[10px]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.category}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-3 py-3 text-xs font-black text-slate-900 sm:px-4 sm:py-4 sm:text-sm">
                  {row.category}
                </td>
                <td className="px-3 py-3 text-xs font-semibold text-slate-600 sm:px-4 sm:py-4 sm:text-sm">
                  ₹{Number(row.revenue || 0).toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-3 text-xs font-semibold text-slate-600 sm:px-4 sm:py-4 sm:text-sm">
                  {Number(row.unitsSold || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CategorySection;
