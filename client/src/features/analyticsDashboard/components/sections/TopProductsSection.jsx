import EmptyState from "../EmptyState";
import SvgBarChart from "../charts/SvgBarChart";

const TopProductsSection = ({
  topProducts,
  loading,
  error,
  onSelectProduct,
  selectedProductId,
  store,
}) => {
  const rows = topProducts || [];

  if (loading) {
    return (
      <EmptyState
        title="Loading top products"
        description="Product ranking is being assembled from sales data."
      />
    );
  }

  if (error) {
    return <EmptyState title="Top products unavailable" description={error} />;
  }

  if (!rows.length) {
    return (
      <EmptyState
        title="No top products yet"
        description="Product rankings will appear once products start selling."
      />
    );
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.35em] text-indigo-600 sm:text-[10px]">
            Products
          </p>
          <h3 className="mt-1 text-lg font-black tracking-tight text-slate-900 sm:mt-2 sm:text-2xl\">
            Top products
          </h3>
        </div>
      </div>

      <div className="mt-3 rounded-[1.75rem] bg-slate-50 p-2 sm:mt-5 sm:p-4">
        <SvgBarChart
          labels={rows.slice(0, 6).map((row) => row.productName)}
          values={rows.slice(0, 6).map((row) => row.revenue)}
          color="#111827"
          accent="#4f46e5"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-[1.75rem] border border-slate-200">
        <table className="w-full border-collapse text-left min-w-max">
          <thead className="bg-slate-50">
            <tr>
              {["Product", "Revenue", "Units"].map((label) => (
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
            {rows.map((row) => {
              const active =
                String(selectedProductId) === String(row._id || row.productId);
              return (
                <tr
                  key={row._id || row.productId}
                  onClick={() => onSelectProduct(row._id || row.productId)}
                  className={`cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 ${active ? "bg-indigo-50/60" : ""}`}
                >
                  <td className="px-3 py-3 text-xs font-black text-slate-900 sm:px-4 sm:py-4 sm:text-sm">
                    {row.productName}
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-slate-600 sm:px-4 sm:py-4 sm:text-sm">
                    ₹{Number(row.revenue || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-slate-600 sm:px-4 sm:py-4 sm:text-sm">
                    {Number(row.unitsSold || 0).toLocaleString("en-IN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TopProductsSection;
