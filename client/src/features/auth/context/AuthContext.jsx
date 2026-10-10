'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { apiPost } from '@/servies/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip if Firebase is not initialized (build time)
    if (!auth) {
      setIsLoading(false);
      return;
    }

    // onIdTokenChanged automatically fires on login, logout AND whenever Firebase refreshes the ID token
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (typeof window !== 'undefined') {
        if (nextUser) {
          try {
            const token = await nextUser.getIdToken();
            localStorage.setItem('authToken', token);

            // Sync user with backend
            try {
              await apiPost('/auth/login');
            } catch (error) {
              if (error.message?.includes('not found') || error.success === false) {
                try {
                  await apiPost('/auth/register');
                } catch (registerError) {
                  console.error('Failed to sync user with backend:', registerError);
                }
              }
            }
          } catch (tokenErr) {
            console.error('[AUTH_CONTEXT] Failed to retrieve fresh token:', tokenErr);
          }
        } else {
          localStorage.removeItem('authToken');
        }
      }

      setIsLoading(false);
    });

    // Background interval to keep token fresh every 15 minutes
    const keepAliveInterval = setInterval(async () => {
      if (auth && auth.currentUser) {
        try {
          const freshToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
          if (typeof window !== 'undefined' && freshToken) {
            localStorage.setItem('authToken', freshToken);
          }
        } catch (err) {
          console.warn('[AUTH_CONTEXT] Periodic token refresh failed:', err);
        }
      }
    }, 15 * 60 * 1000);

    return () => {
      unsubscribe();
      clearInterval(keepAliveInterval);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
