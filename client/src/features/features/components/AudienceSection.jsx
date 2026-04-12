const AudienceSection = () => {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <article className="relative overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm sm:p-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/features/ownerbgImage.png')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/84 to-slate-100/88"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_42%)]"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
              Owner Focus
            </p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Strategic Control Across Stores And Teams.
            </h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold leading-relaxed text-slate-700">
              <li>Unified visibility into sales trends and inventory movement.</li>
              <li>Role and permission governance for controlled operations.</li>
              <li>AI-assisted planning for forecast-driven restock decisions.</li>
            </ul>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm sm:p-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/features/casherImage.png')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/84 to-slate-100/88"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_42%)]"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
              Team Focus
            </p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Fast Daily Execution For Cashiers And Staff.
            </h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold leading-relaxed text-slate-700">
              <li>Barcode-first billing and smoother checkout experiences.</li>
              <li>Product and stock updates aligned with granted permissions.</li>
              <li>Clear workflows for invitations, access, and task ownership.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AudienceSection;
