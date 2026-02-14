'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import {
  getAuthErrorMessage,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  signUpWithEmail,
} from '../services/authService';

export function useAuth() {
  const router = useRouter();
  const authContext = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const withLoading = async (fn) => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(getAuthErrorMessage(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signup = async (payload) => {
    await withLoading(() => signUpWithEmail(payload));
    router.push('/storeDashboard');
  };

  const login = async (payload) => {
    await withLoading(() => loginWithEmail(payload));
    router.push('/storeDashboard');
  };

  const loginWithGoogleProvider = async () => {
    await withLoading(() => loginWithGoogle());
    router.push('/storeDashboard');
  };

  const logout = async () => {
    await withLoading(() => logoutUser());
    router.push('/auth/login');
  };

  return {
    ...authContext,
    error,
    isSubmitting,
    clearError: () => setError(''),
    signup,
    login,
    loginWithGoogle: loginWithGoogleProvider,
    logout,
  };
}
