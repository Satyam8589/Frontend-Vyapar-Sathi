'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-blue-500/20 antialiased overflow-x-hidden">
      {/* Fixed Background Backdrop */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Static Radial Gradient Base */}
        <div className="absolute inset-0 bg-rad-yb"></div>
        
        {/* Scattered Small Dark Yellow Blurry Dots */}
        <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-amber-500/30 rounded-full blur-[60px] animate-blob"></div>
        <div className="absolute top-[60%] left-[80%] w-40 h-40 bg-yellow-600/20 rounded-full blur-[80px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[10%] right-[15%] w-24 h-24 bg-amber-400/30 rounded-full blur-[50px] animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-[20%] left-[30%] w-36 h-36 bg-yellow-700/20 rounded-full blur-[70px] animate-blob"></div>
        <div className="absolute top-[40%] left-[50%] w-28 h-28 bg-amber-600/20 rounded-full blur-[60px] animate-blob animation-delay-2000"></div>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] contrast-150 brightness-100"></div>

        {/* Static Mesh Overlay */}
        <div className="absolute inset-0 bg-mesh-light opacity-60"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-light rounded-full px-5 md:px-8 py-3 translate-y-2">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:rotate-12">
              V
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-800 leading-none group-hover:text-blue-600 transition-colors">Vyapar<span className="text-amber-500">Sathi</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Platforms', 'Pricing', 'Company', 'Features'].map((item) => (
              <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">{item}</a>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <button className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Log In</button>
            <button className="btn-primary-yb py-2 px-5 md:px-6 text-sm shadow-sm">Get Started</button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-slate-600 hover:text-blue-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`lg:hidden fixed inset-0 z-[60] bg-white/90 backdrop-blur-2xl transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">V</div>
                <span className="text-2xl font-black text-slate-900 uppercase">VyaparSathi</span>
              </div>
              <button 
                className="p-3 text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col gap-8 flex-1 overflow-y-auto">
              {['Platforms', 'Pricing', 'Company', 'Features'].map((item) => (
                <a key={item} href="#" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-slate-900 uppercase tracking-tighter hover:text-blue-600 transition-colors">{item}</a>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-200 space-y-4">
              <button className="w-full py-5 text-xl font-bold text-slate-600">Log In</button>
              <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-blue-600 text-white font-black text-xl shadow-xl shadow-blue-500/20">GET STARTED</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="pt-32 md:pt-48 pb-16 md:pb-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/60 border border-white/80 mb-6 md:mb-8 shadow-sm backdrop-blur-sm animate-fade-in-up [animation-delay:200ms] opacity-0">
              <span className="flex h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
              <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.3em]">Next Gen Inventory System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[1] md:leading-[0.95] mb-8 md:mb-10 text-slate-900 drop-shadow-sm animate-fade-in-up [animation-delay:400ms] opacity-0">
              ELEVATE YOUR<br />
              <span className="text-gradient-yb italic">COMMERCE.</span>
            </h1>

            <p className="max-w-2xl lg:max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 font-bold leading-relaxed mb-12 md:mb-16 italic opacity-0 px-4 animate-fade-in-up [animation-delay:600ms]">
              The professional multisite management framework that bridges the gap between 
              traditional retail and digital excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center px-4 animate-fade-in-up [animation-delay:800ms] opacity-0">
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
      <footer className="relative z-10 py-16 md:py-24 px-6 md:px-12 bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">V</div>
              <span className="text-xl font-black tracking-tight text-white uppercase italic">VyaparSathi</span>
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] leading-relaxed max-w-xs">
              Leading the retail revolution with high-precision multisite management.
            </p>
          </div>

          {[
            { title: 'The Suite', links: ['Dashboard', 'Intelligence', 'Security', 'Compliance'] },
            { title: 'Merchant House', links: ['Support', 'Liaison', 'Merchant Network', 'Contact'] },
            { title: 'Protocols', links: ['Privacy', 'Sovereignty', 'Terms', 'Data Ethics'] },
          ].map((col, i) => (
            <div key={i} className="space-y-6 md:space-y-8">
              <h4 className="text-amber-400 font-black uppercase text-[10px] tracking-[0.4em] leading-none">{col.title}</h4>
              <ul className="space-y-3 md:space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto pt-16 md:pt-20 mt-16 md:mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 text-slate-500 text-[10px] font-black tracking-[0.5em] text-center md:text-left">
          <p>© MMXXVI VYAPAR SATHI GLOBAL &bull; ALL RIGHTS RESERVED</p>
          <div className="flex gap-8 md:gap-10">
            {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
              <a key={s} href="#" className="hover:text-blue-400 transition-colors uppercase">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

