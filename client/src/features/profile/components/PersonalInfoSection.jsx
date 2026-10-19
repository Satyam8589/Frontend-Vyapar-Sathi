'use client';

import React, { useState, useEffect } from 'react';

export default function PersonalInfoSection({ user, profileData, onUpdate, saving }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const currentName = profileData?.name || user?.displayName || '';
    const currentPhone = profileData?.phone || '';
    setName(currentName);
    setPhone(currentPhone);
  }, [user, profileData]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setHasChanges(true);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onUpdate({ name: name.trim(), phone: phone.trim() });
    if (success) {
      setHasChanges(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500">Update your primary identity and communication contact</p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Ramesh Kumar"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email Address (Read-only from Firebase) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
              Email Address <span className="text-xs text-slate-400 font-normal">(Primary Auth)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100/70 text-slate-500 font-medium text-sm cursor-not-allowed select-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Locked
              </span>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
              Phone Number <span className="text-xs text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="98765 43210"
                maxLength={10}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Used for SMS/WhatsApp business notifications</p>
          </div>

          {/* Account Role / Identity */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
              Platform Role
            </label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm" />
              <span>Store Owner / Business Admin</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {hasChanges && (
            <button
              type="button"
              onClick={() => {
                setName(profileData?.name || user?.displayName || '');
                setPhone(profileData?.phone || '');
                setHasChanges(false);
              }}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="btn-primary-yb py-2.5 px-6 text-xs sm:text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
