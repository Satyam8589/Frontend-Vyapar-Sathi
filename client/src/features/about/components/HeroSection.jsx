import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative pt-16 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6 animate-fade-in-up">
          <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Corporate Overview
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 sm:mb-8 animate-fade-in-up">
          Architecting the Future of{' '}
          <br className="hidden sm:block" />
          <span className="text-gradient-yb">Modern Retail Commerce.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-8 sm:mb-12 animate-fade-in-up [animation-delay:200ms]">
          Vyapar Sathi is a comprehensive ERP ecosystem engineered to streamline inventory management
          and point-of-sale operations for the next generation of retail enterprises.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up [animation-delay:400ms]">
          <Link
            href="/storeDashboard"
            className="btn-primary-yb w-full sm:w-auto py-4 px-8 sm:px-12 text-xs font-bold uppercase tracking-widest shadow-xl shadow-blue-500/10 text-center"
          >
            Explore Our Solutions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
