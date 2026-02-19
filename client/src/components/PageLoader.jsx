'use client';

/**
 * PageLoader
 * Full-screen overlay with blurred background and animated spinner.
 * Shown while navigating to a new page (e.g. "Create New Store").
 */
const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.55)' }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse [animation-delay:600ms]" />

      {/* Spinner card */}
      <div className="relative flex flex-col items-center gap-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/80 rounded-3xl px-12 py-10">

        {/* Rotating ring spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          {/* Spinning arc */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin" />
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-blue-600 animate-pulse shadow-lg shadow-blue-500/40" />
          </div>
        </div>

        {/* Brand logo mark */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-black tracking-tight text-slate-900">
            Vyapar<span className="text-amber-500">Sathi</span>
          </span>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{message}</p>
        </div>

        {/* Animated progress dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
