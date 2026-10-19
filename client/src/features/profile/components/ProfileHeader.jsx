'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfileHeader({ user, profileData }) {
  const displayName = profileData?.name || user?.displayName || 'Merchant';
  const email = profileData?.email || user?.email || '';
  const isVerified = user?.emailVerified || profileData?.emailVerified;
  const photoURL = user?.photoURL || profileData?.profilePicture;

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'VS';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl p-6 sm:p-8 mb-8">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            {photoURL ? (
              <Image
                src={photoURL}
                alt={displayName}
                width={84}
                height={84}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-amber-400 via-blue-500 to-indigo-600 flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-lg ring-4 ring-white">
                {initials}
              </div>
            )}
            <div
              className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${
                isVerified ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-900'
              }`}
              title={isVerified ? 'Email Verified' : 'Email Pending Verification'}
            >
              {isVerified ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>

          {/* User info */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                Vyapar Sakha Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 font-medium">
              <span>{email}</span>
              <span className="text-slate-300">•</span>
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  isVerified ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {isVerified ? 'Verified Account' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </div>

        {/* Back Link CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/storeDashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Stores</span>
          </Link>
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Platform Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
