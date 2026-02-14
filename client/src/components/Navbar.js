'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuth';

// Navigation items with paths
const NAV_ITEMS = [
  { label: 'StoreDashboard', href: '/storeDashboard' },
  { label: 'About', href: '/About' },
  { label: 'Docs', href: '/Docs' },
  { label: 'Features', href: '/#features' },
];

// Helper function to get user initials
const getUserInitials = (displayName) => {
  if (!displayName) return 'U';
  return displayName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, isSubmitting, logout, user } = useAuth();

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
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">
              {item.label}
            </Link>
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
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {getUserInitials(user?.displayName)}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-900">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-slate-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                    }}
                    disabled={isSubmitting}
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-70"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black text-slate-900 uppercase tracking-tighter hover:text-blue-600 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 space-y-4">
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-5 text-xl font-bold text-slate-600 text-center">
                  Log In
                </Link>
                <Link
                  href="/signUp"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-blue-600 text-white font-black text-xl shadow-xl shadow-blue-500/20 text-center"
                >
                  GET STARTED
                </Link>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <div className="space-y-4">
                {/* User Profile Section */}
                <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-lg">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                      {getUserInitials(user?.displayName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-slate-600 truncate">{user?.email}</p>
                  </div>
                </div>

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
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
