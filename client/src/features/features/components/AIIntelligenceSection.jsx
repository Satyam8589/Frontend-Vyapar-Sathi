import Image from "next/image";

const AIIntelligenceSection = ({ items }) => {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700">
            AI Intelligence Layer
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Practical AI That Supports Real Business Decisions.
          </h2>
          <p className="mt-4 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">
            AI modules are designed for operational clarity, not hype.
            Forecasting and recommendations are surfaced with confidence and
            context so teams can act faster with better visibility.
          </p>

          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">
                  ✓
                </span>
                <span className="font-semibold leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
              Trust Note
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-amber-900">
              Forecast quality improves with stronger transaction history. New
              or low-volume products may use assisted baselines until enough
              live sales data is available.
            </p>
          </div>
        </article>

          <Image
            src="/images/features/AIImage.png"
            alt="AI Intelligence Visual"
            width={600}
            height={450}
            className="cover rounded-md shadow-lg shadow-black/20"
          />
      </div>
    </section>
  );
};

export default AIIntelligenceSection;
