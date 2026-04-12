const ProofMetricsSection = ({ items }) => {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProofMetricsSection;
