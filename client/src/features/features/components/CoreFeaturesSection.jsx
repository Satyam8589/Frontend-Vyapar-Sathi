const CoreFeaturesSection = ({ items }) => {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700">
            Platform Capabilities
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Built For Owners, Teams, And Daily Retail Execution.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((feature, index) => (
            <article
              key={feature.title}
              className="group rounded-3xl border border-transparent bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                    Module {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    {feature.title}
                  </h3>
                </div>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {feature.audience}
                </span>
              </div>

              <ul className="mt-5 space-y-3">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                    <span className="font-semibold leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;
