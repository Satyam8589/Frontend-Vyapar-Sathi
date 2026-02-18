const PhilosophySection = () => {
  const features = [
    {
      title: 'Unified Command',
      desc: 'Manage multiple retail nodes from a single centralized interface with real-time data synchronization.',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    },
    {
      title: 'Scalable Infrastructure',
      desc: 'Cloud-native architecture designed to support your business as it scales from a single unit to a global network.',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    },
    {
      title: 'Security & Compliance',
      desc: 'Industry-standard encryption and data isolation protocols ensure your commercial records remain confidential.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 border-y border-slate-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* Mission card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg text-white flex-shrink-0">
            <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4 sm:mb-6">
            Our Strategic Mission
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            We empower retail franchises and independent vendors by delivering sophisticated,
            data-driven tools that were previously accessible only to large-scale corporations.
            Our goal is to digitize every transaction with precision and security.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-6 sm:space-y-10">
          {features.map((item, i) => (
            <div key={i} className="flex gap-5 sm:gap-8 group">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-sm">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-widest mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
