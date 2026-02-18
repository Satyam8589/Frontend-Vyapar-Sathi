'use client';

import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen selection:bg-blue-100 selection:text-blue-600 font-sans">

      {/* ── Hero ── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
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

      {/* ── Metrics ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {[
            { label: 'Active Stores',       value: '500+' },
            { label: 'Daily Transactions',  value: '10k+' },
            { label: 'Uptime Guaranteed',   value: '99.9%' },
            { label: 'Data Security',       value: 'Enterprise' },
          ].map((metric, i) => (
            <div
              key={i}
              className="text-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm"
            >
              <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-1 sm:mb-2 leading-none">
                {metric.value}
              </p>
              <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest leading-tight">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Philosophy ── */}
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
            {[
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
            ].map((item, i) => (
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

      {/* ── Roadmap ── */}
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
            {[
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
            ].map((step, i) => (
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

      {/* ── CTA ── */}
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

    </div>
  );
};

export default AboutPage;