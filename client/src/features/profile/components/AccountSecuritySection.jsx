'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AccountSecuritySection({
  user,
  onSendPasswordReset,
  onSendVerification,
  sendingReset,
  sendingVerification,
}) {
  const [copiedUid, setCopiedUid] = useState(false);

  const provider = user?.providerData?.[0]?.providerId || 'password';
  const isGoogle = provider.includes('google');
  const isEmailVerified = user?.emailVerified;

  const handleCopyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      toast.success('User ID copied to clipboard');
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/90 shadow-xl overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 to-orange-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Account &amp; Security</h2>
            <p className="text-xs text-slate-500">Security credentials, auth provider, and verification status</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Verification Status Alert if unverified */}
        {!isEmailVerified && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">Email Address Unverified</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Verify your email to receive invoice backups and system recovery alerts.
                </p>
              </div>
            </div>

            <button
              onClick={onSendVerification}
              disabled={sendingVerification}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 disabled:opacity-50"
            >
              {sendingVerification ? 'Sending Link...' : 'Resend Verification Email'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Auth Provider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Sign-in Method</span>
            <div className="flex items-center gap-3">
              {isGoogle ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-800">Google OAuth Single Sign-On</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-800">Email &amp; Password</span>
                </div>
              )}
            </div>
          </div>

          {/* User ID */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Vyapar Account ID</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-medium text-slate-600 truncate max-w-[200px]" title={user?.uid}>
                {user?.uid || 'N/A'}
              </span>
              <button
                type="button"
                onClick={handleCopyUid}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition-all shadow-2xs"
              >
                {copiedUid ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Password Reset Action */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Change or Reset Password</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              We will send a secure password reset link to <strong className="text-slate-700">{user?.email}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onSendPasswordReset}
            disabled={sendingReset || !user?.email}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {sendingReset ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending Link...</span>
              </>
            ) : (
              <span>Send Password Reset Link</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
