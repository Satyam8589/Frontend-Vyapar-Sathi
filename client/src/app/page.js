'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-blue-500/20 antialiased overflow-x-hidden">
      {/* Fixed Background Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Static Radial Gradient */}
        <div className="absolute inset-0 bg-rad-yb"></div>
        
        {/* Ambiant Blurry Yellow Glows */}
        <div className="absolute -top-24 -right-24 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-yellow-400/40 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute top-1/2 -left-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-300/30 rounded-full blur-[80px] md:blur-[120px]"></div>

        {/* Static Mesh Overlay */}
        <div className="absolute inset-0 bg-mesh-light opacity-80"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="pt-32 md:pt-48 pb-16 md:pb-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/60 border border-white/80 mb-6 md:mb-8 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Next Gen Inventory System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[1] md:leading-[0.95] mb-8 md:mb-10 text-slate-900 drop-shadow-sm">
              ELEVATE YOUR<br />
              <span className="text-gradient-yb italic">COMMERCE.</span>
            </h1>

            <p className="max-w-2xl lg:max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 font-bold leading-relaxed mb-12 md:mb-16 italic opacity-80 px-4">
              The professional multisite management framework that bridges the gap between 
              traditional retail and digital excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4">
              <button className="w-full sm:w-auto btn-primary-yb text-lg md:text-xl px-10 md:px-12 py-4 md:py-5 shadow-lg shadow-blue-500/10">Launch Your Store</button>
              <button className="w-full sm:w-auto btn-secondary-light text-lg md:text-xl px-10 md:px-12 py-4 md:py-5 shadow-sm">Explore Features</button>
            </div>
          </div>
        </section>

        {/* Core Value Showcase */}
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { 
                  title: 'Store Isolation', 
                  desc: 'Scale without shared risks. Every outlet operates on its own secure data domain.', 
                  icon: '🏗️', 
                  color: 'border-blue-100' 
                },
                { 
                  title: 'Scanner Hub', 
                  desc: 'High-precision barcode engine for instant stock level synchronization.', 
                  icon: '⚡', 
                  color: 'border-amber-100' 
                },
                { 
                  title: 'Dynamic Assets', 
                  desc: 'Real-time sales tracking and capital health monitoring across your empire.', 
                  icon: '💎', 
                  color: 'border-purple-100',
                  extra: 'hidden lg:flex'
                }
              ].map((val, i) => (
                <div key={i} className={`glass-light glass-hover-light p-8 md:p-10 rounded-[2.5rem] border-2 ${val.color} flex flex-col items-center text-center gap-4 md:gap-6 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                  <div className="text-4xl md:text-5xl mb-2">{val.icon}</div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">{val.title}</h3>
                  <p className="text-slate-500 font-bold italic text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global CTA */}
        <section className="py-24 md:py-40 px-4 md:px-6">
          <div className="max-w-6xl mx-auto relative group">
             <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-blue-400 to-amber-400 rounded-[3rem] md:rounded-[4rem] blur-xl md:blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
             <div className="relative glass-light rounded-[2.5rem] md:rounded-[3.5rem] p-8 sm:p-16 md:p-32 text-center overflow-hidden border-white/60">
                <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-8 md:mb-10 leading-none">
                  THE FUTURE IS<br />
                  <span className="text-gradient-yb italic">SCALABLE.</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-8 md:mt-12">
                   <button className="w-full sm:w-auto btn-primary-yb text-lg md:text-xl px-12 md:px-16 py-4 md:py-6 font-black uppercase tracking-widest">Connect Now</button>
                   <button className="w-full sm:w-auto btn-secondary-light text-lg md:text-xl px-12 md:px-16 py-4 md:py-6 font-black uppercase tracking-widest border-slate-200">Talk to Support</button>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Dark Modern Footer */}
      <Footer />
    </div>
  );
}

