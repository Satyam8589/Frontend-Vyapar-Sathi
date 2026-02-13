'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isSubmitting, error, clearError, login, signup, loginWithGoogle } = useAuth();
  const isSignup = mode === 'signup';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const onChange = (event) => {
    if (error) {
      clearError();
    }

    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isSignup) {
        await signup(formData);
        return;
      }

      await login(formData);
    } catch {
      // Error state is already handled in the hook.
    }
  };

  return (
    <div className="w-full">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/60 sm:p-7 lg:p-8">
        <div className="mb-6 space-y-1.5 sm:mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem] sm:leading-9">
            {isSignup ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            {isSignup ? 'Start using VyaparSathi with Firebase auth.' : 'Sign in to continue to your dashboard.'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {isSignup && (
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={onChange}
                className="block h-11 w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={onChange}
              className="block h-11 w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={onChange}
              className="block h-11 w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-11 w-full rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            try {
              await loginWithGoogle();
            } catch {
              // Error state is already handled in the hook.
            }
          }}
          disabled={isSubmitting}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="inline-flex h-5 w-5 flex-none items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              aria-hidden="true"
              focusable="false"
            >
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
          </span>
          <span className="leading-none">Continue with Google</span>
        </button>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="text-center text-sm text-slate-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              href={isSignup ? '/login' : '/signUp'}
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              {isSignup ? 'Sign in' : 'Create account'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
