import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-16 sm:py-32 px-4 sm:px-6 text-center">
      <div className="max-w-4xl mx-auto p-8 sm:p-16 rounded-3xl sm:rounded-[4rem] bg-slate-50 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full bg-blue-600" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-5 sm:mb-8">
          Empower Your Retail Network Today.
        </h2>
        <p className="text-slate-500 font-medium italic mb-8 sm:mb-12 text-base sm:text-lg max-w-2xl mx-auto">
          Contact our systems integration team or initialize your account to experience the next
          level of commercial efficiency.
        </p>
        <Link
          href="/signUp"
          className="btn-primary-yb inline-block w-full sm:w-auto py-4 sm:py-6 px-8 sm:px-16 text-xs font-bold uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/20 text-center"
        >
          Initialize Account
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
