'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import { showSuccess, showError } from '@/utils/toast';
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
    try {
      await withLoading(() => signUpWithEmail(payload));
      showSuccess('Account created successfully! Welcome aboard!');
      router.push('/storeDashboard');
    } catch (err) {
      showError(getAuthErrorMessage(err));
      throw err;
    }
  };

  const login = async (payload) => {
    try {
      await withLoading(() => loginWithEmail(payload));
      showSuccess('Welcome back! Login successful.');
      router.push('/storeDashboard');
    } catch (err) {
      showError(getAuthErrorMessage(err));
      throw err;
    }
  };

  const loginWithGoogleProvider = async () => {
    try {
      await withLoading(() => loginWithGoogle());
      showSuccess('Welcome! Signed in with Google successfully.');
      router.push('/storeDashboard');
    } catch (err) {
      showError(getAuthErrorMessage(err));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await withLoading(() => logoutUser());
      showSuccess('Logged out successfully. See you soon!');
      router.push('/login');
    } catch (err) {
      showError('Failed to logout. Please try again.');
      throw err;
    }
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
