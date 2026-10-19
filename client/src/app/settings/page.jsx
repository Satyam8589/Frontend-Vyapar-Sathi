'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import PageLoader from '@/components/PageLoader';
import { useLanguage, useTranslation } from '@/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const DEFAULT_PREFERENCES = {
  language: 'en',
  currencyFormat: 'inr_lakh',
  dateFormat: 'DD/MM/YYYY',
  defaultLanding: '/storeDashboard',
  dailyDigest: true,
  lowStockAlerts: true,
  staffInviteAlerts: true,
};

export default function PlatformSettingsPage() {
  const { user, isLoading: authLoading } = useAuthContext();
  const { locale, setLocale } = useLanguage();
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('vyapar_platform_preferences');
        if (stored) {
          setPreferences((prev) => ({ ...prev, ...JSON.parse(stored) }));
        }
      } catch (err) {
        console.warn('Failed to load saved platform settings from localStorage', err);
      }
    }
  }, []);

  const handleChange = (key, value) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof window !== 'undefined') {
        localStorage.setItem('vyapar_platform_preferences', JSON.stringify(next));
      }
      return next;
    });
    setIsSaved(true);
    toast.success('Preference updated');
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (authLoading) {
    return <PageLoader message="Loading settings..." />;
  }

  return (
    <div className="min-h-screen pb-16 pt-2 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto selection:bg-blue-500/20 antialiased">
      {/* ── Top Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 shadow-xs mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                Account &amp; Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Configure system-wide preferences, localization, and notifications for all your stores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Profile</span>
            </Link>
            <Link
              href="/storeDashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Stores</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Localization & Display */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Localization &amp; Regional Formatting</h2>
              <p className="text-xs text-slate-500">Language, currency representation, and numbering format</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Language */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                  {t('settings.selectLanguage')}
                </label>
                <select
                  value={locale}
                  onChange={(e) => {
                    const nextLang = e.target.value;
                    handleChange('language', nextLang);
                    setLocale(nextLang);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                </select>
              </div>

              {/* Currency Numbering Format */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                  Currency Numbering
                </label>
                <select
                  value={preferences.currencyFormat}
                  onChange={(e) => handleChange('currencyFormat', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="inr_lakh">₹ Lakhs &amp; Crores (e.g. ₹3.50 Lakh)</option>
                  <option value="inr_standard">₹ Standard Indian (e.g. ₹3,50,000)</option>
                  <option value="inr_k">₹ Thousands / k format (e.g. ₹350k)</option>
                </select>
              </div>

              {/* Date Format */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                  Date Format
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                  <option value="DD MMM YYYY">19 Oct 2026 (Readable)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Global Notification Preferences */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">System Notification Alerts</h2>
              <p className="text-xs text-slate-500">Automated business updates across all your retail counters</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 divide-y divide-slate-100">
            {/* Daily Digest */}
            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Daily Sales Summary Digest</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receive an automated recap every evening with total sales, cash in counter, and bills made.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={preferences.dailyDigest}
                  onChange={(e) => handleChange('dailyDigest', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            {/* Low Stock Alerts */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Critical Low Stock Alerts</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get notified whenever an item drops below safety reorder threshold in any active store.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={preferences.lowStockAlerts}
                  onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>

            {/* Staff Invite Alerts */}
            <div className="py-4 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Staff &amp; Role Invitations</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Alert when an employee accepts or declines an invitation to manage a store counter.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={preferences.staffInviteAlerts}
                  onChange={(e) => handleChange('staffInviteAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
          </div>
        </div>

        {/* 3. Platform & Cloud System Info */}
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Vyapar Sakha Platform Status</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Version 2.4.0 (Bharat Cloud) • AI Microservice Gateway: <span className="font-mono text-blue-600 font-bold">ai.vyaparsakha.store</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700">All Cloud Services Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
