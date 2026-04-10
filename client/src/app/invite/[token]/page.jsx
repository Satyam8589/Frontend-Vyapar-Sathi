'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiGet, apiPost } from '@/servies/api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Store, User, Mail, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

export default function InvitePage() {
  const params = useParams();
  const token = params.token;
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const response = await apiGet(`/invite/${token}`);
        if (response.success) {
          setInviteData(response.data);
        } else {
          setError(response.message || 'Invalid or expired invite link.');
        }
      } catch (err) {
        setError(err.message || 'Failed to verify invite link.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInvite();
    }
  }, [token]);

  const handleAccept = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to accept the invitation');
      router.push(`/login?redirect=/invite/${token}`);
      return;
    }

    setActionLoading(true);
    try {
      const response = await apiPost(`/invite/${token}/accept`);
      if (response.success) {
        toast.success(response.message || 'Invitation accepted successfully!');
        router.push('/storeDashboard');
      } else {
        toast.error(response.message || 'Failed to accept invitation');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to decline the invitation');
      router.push(`/login?redirect=/invite/${token}`);
      return;
    }

    setActionLoading(true);
    try {
      const response = await apiPost(`/invite/${token}/decline`);
      if (response.success) {
        toast.success('Invitation declined');
        router.push('/');
      } else {
        toast.error(response.message || 'Failed to decline invitation');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-600 font-bold italic">Verifying your invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl border-2 border-slate-100 shadow-sm">
        <div className="mb-6 inline-flex p-4 rounded-full bg-red-50 text-red-500">
          <XCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Invalid Link</h2>
        <p className="text-slate-600 font-bold italic mb-8">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-slate-100 text-slate-900 font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-slate-200 transition-colors w-full"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 md:mt-20 px-4">
      <div className="relative group">
        {/* Decorative backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-blue-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        
        <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">Employee Invitation</span>
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="mb-6 inline-flex p-5 rounded-3xl bg-amber-50 text-amber-600 border border-amber-100">
                <Mail size={40} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                JOIN THE <span className="italic text-amber-600">{inviteData.storeName?.toUpperCase()}</span> TEAM
              </h1>
              <p className="text-slate-600 font-bold italic text-lg leading-relaxed">
                You've been invited by <span className="text-slate-900 not-italic">{inviteData.invitedBy}</span> to join as a <span className="text-blue-600 not-italic">{inviteData.roleName}</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors">
                <div className="p-3 rounded-xl bg-white text-slate-600 shadow-sm">
                  <Store size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Store</p>
                  <p className="font-bold text-slate-800">{inviteData.storeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="p-3 rounded-xl bg-white text-slate-600 shadow-sm">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Role</p>
                  <p className="font-bold text-slate-800">{inviteData.roleName}</p>
                </div>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-center">
                <p className="text-blue-700 font-bold italic mb-4">
                  Please sign in or create an account to accept this invitation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => router.push(`/login?redirect=/invite/${token}`)}
                    className="flex-1 bg-blue-600 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => router.push(`/signUp?redirect=/invite/${token}`)}
                    className="flex-1 bg-white text-blue-600 border-2 border-blue-100 font-black uppercase tracking-widest py-4 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    Join VyaparSathi
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="flex-[2] bg-slate-900 text-white font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      ACCEPT INVITATION
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <button
                  onClick={handleDecline}
                  disabled={actionLoading}
                  className="flex-1 bg-white text-slate-900 border border-slate-200 font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50"
                >
                  DECLINE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        Secured by VyaparSathi Identity Manager
      </p>
    </div>
  );
}
