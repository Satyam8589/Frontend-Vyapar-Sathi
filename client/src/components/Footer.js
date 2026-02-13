export default function Footer() {
  return (
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
  );
}
