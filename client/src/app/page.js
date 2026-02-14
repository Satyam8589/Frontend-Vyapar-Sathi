'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/features/auth/hooks/useAuth';

const quickStats = [
  { label: 'Active Outlets', value: '1,200+' },
  { label: 'Avg Sync Latency', value: '< 180ms' },
  { label: 'Monthly Transactions', value: '14M+' },
  { label: 'Uptime', value: '99.98%' },
];

const capabilities = [
  {
    title: 'Store Isolation',
    desc: 'Each branch runs in its own secured data boundary so teams can scale without cross-store risk.',
    tag: 'Security Core',
    border: 'border-blue-100',
  },
  {
    title: 'Scanner Hub',
    desc: 'Barcode and SKU processing pipelines keep inventory accurate across warehouse and counter in real time.',
    tag: 'Ops Engine',
    border: 'border-amber-100',
  },
  {
    title: 'Dynamic Assets',
    desc: 'Live revenue, stock movement, and working capital visibility help operators make fast, precise decisions.',
    tag: 'Finance View',
    border: 'border-slate-200',
  },
];

const workflow = [
  {
    step: '01',
    title: 'Launch Outlet',
    text: 'Provision a new store with role-aware access and location-specific inventory rules in minutes.',
  },
  {
    step: '02',
    title: 'Unify Operations',
    text: 'Connect billing, purchasing, returns, and scanner events into one consistent event stream.',
  },
  {
    step: '03',
    title: 'Scale With Insight',
    text: 'Use centralized analytics to optimize margins, replenishment cycles, and team performance.',
  },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/storeDashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-blue-500/20 antialiased overflow-x-hidden">
      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <section className="pt-12 pb-16 md:pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/90 shadow-sm backdrop-blur-sm animate-fade-in-up [animation-delay:200ms]">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-[0.24em]">
                  Multi-Store Retail Platform
                </span>
              </div>

              <h1 className="mt-6 md:mt-8 text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[1] md:leading-[0.95] text-slate-900 drop-shadow-sm animate-fade-in-up [animation-delay:400ms]">
                OPERATE FAST.
                <br />
                <span className="text-gradient-yb italic">SCALE SAFELY.</span>
              </h1>

              <p className="max-w-3xl mx-auto mt-7 md:mt-9 text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 font-bold leading-relaxed italic px-4 animate-fade-in-up [animation-delay:600ms]">
                VyaparSathi brings inventory, billing, and branch intelligence into one reliable command layer for modern retail teams.
              </p>

              <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4 animate-fade-in-up [animation-delay:800ms]">
                <button
                  onClick={() => router.push('/createStore')}
                 className="w-full sm:w-auto btn-primary-yb text-lg md:text-xl px-10 md:px-12 py-4 md:py-5 shadow-lg shadow-blue-500/10">
                  Launch Your Store
                </button>
                <button 
                  onClick={() => router.push('/storeDashboard')}
                  className="w-full sm:w-auto btn-secondary-light text-lg md:text-xl px-10 md:px-12 py-4 md:py-5 shadow-sm">
                  Visit Stores Dashboard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 animate-fade-in-up [animation-delay:950ms]">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-sm px-4 md:px-6 py-4 md:py-5 text-center"
                >
                  <p className="text-xl md:text-3xl font-black tracking-tight text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-[10px] md:text-xs font-black uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {capabilities.map((val, i) => (
                <article
                  key={val.title}
                  className={`p-8 md:p-10 rounded-[2.2rem] border-2 ${val.border} bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col gap-5 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-black text-slate-500">{val.tag}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-amber-400 to-blue-500"></span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">{val.title}</h3>
                  <p className="text-slate-600 font-bold italic text-sm md:text-base leading-relaxed">{val.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto rounded-[2.5rem] border border-slate-200 bg-white shadow-sm p-7 md:p-12">
            <div className="flex items-center justify-between gap-6 flex-wrap mb-8 md:mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                BUILT FOR
                <br />
                DAILY RETAIL FLOW
              </h2>
              <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-slate-500">From Setup To Scale</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {workflow.map((item) => (
                <div key={item.step} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 md:px-6 py-6 md:py-7">
                  <p className="text-xs font-black tracking-[0.2em] text-amber-600">STEP {item.step}</p>
                  <h3 className="mt-3 text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">{item.title}</h3>
                  <p className="mt-3 text-sm md:text-base text-slate-600 font-bold leading-relaxed italic">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-36 px-4 md:px-6">
          <div className="max-w-6xl mx-auto relative group">
            <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-blue-400 to-amber-400 rounded-[3rem] md:rounded-[4rem] blur-xl md:blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] p-8 sm:p-14 md:p-24 text-center overflow-hidden bg-white border border-slate-200 shadow-sm">
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-6 md:mb-8 leading-none">
                READY TO RUN
                <br />
                <span className="text-gradient-yb italic">AT SCALE?</span>
              </h2>
              <p className="max-w-2xl mx-auto text-slate-600 font-bold italic text-base md:text-lg leading-relaxed">
                Bring every store, catalog, and billing counter onto one modern control surface.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-8 md:mt-10">
                <button className="w-full sm:w-auto btn-primary-yb text-lg md:text-xl px-12 md:px-16 py-4 md:py-6 font-black uppercase tracking-widest">
                  Connect Now
                </button>
                <button className="w-full sm:w-auto btn-secondary-light text-lg md:text-xl px-12 md:px-16 py-4 md:py-6 font-black uppercase tracking-widest border-slate-200">
                  Talk To Support
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
