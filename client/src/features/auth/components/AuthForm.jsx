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
      <div className="w-full rounded-3xl bg-white shadow-xl border border-slate-200 p-8 lg:p-10">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {isSignup ? 'Start using VyaparSathi with Firebase auth.' : 'Login to continue to your dashboard.'}
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          {isSignup && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
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
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 6 characters"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary-yb py-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
          </button>
        </form>

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
          className="mt-3 w-full rounded-full border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-slate-500 text-center">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link
            href={isSignup ? '/login' : '/signUp'}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            {isSignup ? 'Login' : 'Create account'}
          </Link>
        </p>
      </div>
    </div>
  );
}
