import Image from "next/image";

const WorkflowSection = ({ items }) => {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700">
          Workflow
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          A Clear System For Daily Retail Work.
        </h2>

        <div className="relative mt-7 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="absolute left-4 top-4 z-10 rounded-full border border-white/70 bg-white/80 px-4 py-1.5 backdrop-blur-sm sm:left-6 sm:top-6">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
              Team Workflow Visual
            </p>
          </div>

          <div className="relative aspect-[21/6] w-full">
            <Image
              src="/images/features/teamWorkflowImage.png"
              alt="Team workflow showing setup, daily operations, and AI-assisted retail decisions"
              fill
              className="object-cover"
              priority={false}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/20"
            aria-hidden="true"
          />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.step}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
                Step {item.step}
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
