'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, isSubmitting, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center glass-light rounded-full px-5 md:px-8 py-3 translate-y-2">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:rotate-12">
            V
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight text-slate-800 leading-none group-hover:text-blue-600 transition-colors">Vyapar<span className="text-amber-500">Sathi</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {['Platforms', 'Pricing', 'Company', 'Features'].map((item) => (
            <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">{item}</a>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {!isLoading && !isAuthenticated && (
            <>
              <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                Log In
              </Link>
              <Link href="/signUp" className="btn-primary-yb py-2 px-5 md:px-6 text-sm shadow-sm">
                Get Started
              </Link>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <button
              onClick={logout}
              disabled={isSubmitting}
              className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-70"
            >
              Logout
            </button>
          )}
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
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-5 text-xl font-bold text-slate-600 text-center">
                  Log In
                </Link>
                <Link
                  href="/auth/signUp"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-blue-600 text-white font-black text-xl shadow-xl shadow-blue-500/20 text-center"
                >
                  GET STARTED
                </Link>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <button
                onClick={async () => {
                  await logout();
                  setMobileMenuOpen(false);
                }}
                disabled={isSubmitting}
                className="w-full py-5 text-xl font-bold text-slate-600 disabled:opacity-70"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
