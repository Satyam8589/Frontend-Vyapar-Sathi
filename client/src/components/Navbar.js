'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/storeDashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'About',     href: '/about',          icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Docs',      href: '/documents',           icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Features',  href: '/#features',      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
];

const getUserInitials = (displayName) => {
  if (!displayName) return 'U';
  return displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, isSubmitting, logout, user } = useAuth();

  const close = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-light rounded-full px-5 md:px-8 py-3 translate-y-2 border-emerald-400/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.07),0_0_15px_rgba(52,211,153,0.25)]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg transition-transform group-hover:rotate-12">
              V
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-800 leading-none group-hover:text-blue-600 transition-colors">
              Vyapar<span className="text-amber-500">Sathi</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm uppercase tracking-widest transition-all duration-300 relative py-1
                    ${isActive
                      ? 'text-blue-600 font-extrabold after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                      : 'text-slate-600 font-bold hover:text-blue-600'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Log In</Link>
                <Link href="/signUp" className="btn-primary-yb py-2 px-5 md:px-6 text-sm shadow-sm">Get Started</Link>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || 'User'} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {getUserInitials(user?.displayName)}
                    </div>
                  )}
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setProfileMenuOpen(false); }}
                      disabled={isSubmitting}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-70"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Hamburger button (mobile) ── */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-200 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {/* Three animated bars → X */}
            <span className="flex flex-col gap-[5px] w-5">
              <span className={`block h-[2px] rounded-full bg-slate-700 transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-[2px] rounded-full bg-slate-700 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-[2px] rounded-full bg-slate-700 transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </span>
          </button>

        </div>
      </nav>

      {/* ── Mobile Sidebar Drawer ── */}
      {/* Backdrop */}
      <div
        onClick={close}
        className={`md:hidden fixed inset-0 z-[55] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Slide-in panel from right */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-[80vw] max-w-xs z-[60]
          bg-white
          shadow-2xl shadow-slate-900/20
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Decorative glow blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-32 h-32 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col h-full px-6 py-8 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-amber-400 to-blue-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg">
                V
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Vyapar<span className="text-amber-500">Sathi</span>
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={close}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all duration-200"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 mb-8" />

          {/* Nav links */}
          <nav className="flex flex-col gap-1 flex-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={close}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200
                    ${isActive ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </span>
                  <span className="tracking-wide uppercase text-xs font-black">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom auth section */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
            {!isLoading && !isAuthenticated && (
              <>
                <Link
                  href="/login"
                  onClick={close}
                  className="flex items-center justify-center w-full py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signUp"
                  onClick={close}
                  className="flex items-center justify-center w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-blue-600 text-white font-black text-sm shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
                >
                  GET STARTED →
                </Link>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <div className="space-y-3">
                {/* User card */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || 'User'} width={40} height={40} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-blue-600 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                      {getUserInitials(user?.displayName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={async () => { await logout(); close(); }}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isSubmitting ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
