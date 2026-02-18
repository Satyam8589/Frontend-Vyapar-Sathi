const RoadmapSection = () => {
  const roadmapSteps = [
    {
      level: 'Phase 01',
      title: 'Operational Foundation',
      desc: 'Deployment of primary stock control units with high-speed barcode integration and localized POS terminal support.',
      color: 'border-blue-500/30',
    },
    {
      level: 'Phase 02',
      title: 'Enterprise Synergy',
      desc: 'Implementation of multi-tenant dashboards, advanced data isolation, and cross-store inventory balancing.',
      color: 'border-amber-500/30',
    },
    {
      level: 'Phase 03',
      title: 'Commercial Intelligence',
      desc: 'Integration of algorithmic sales forecasting, seamless digital payment gateways, and automated fiscal reporting.',
      color: 'border-emerald-500/30',
    },
  ];

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-24">
          <span className="text-blue-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-3 sm:mb-4 block">
            Future Proofing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 sm:mb-8">
            Strategic Product Roadmap
          </h2>
          <div className="w-16 sm:w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-10">
          {roadmapSteps.map((step, i) => (
            <div
              key={i}
              className={`relative p-7 sm:p-12 rounded-2xl sm:rounded-[2.5rem] border ${step.color} bg-white/5 hover:bg-white/10 transition-colors duration-300`}
            >
              <span className="text-[10px] sm:text-[11px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-4 sm:mb-6 block">
                {step.level}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-5 tracking-tight">
                {step.title}
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
