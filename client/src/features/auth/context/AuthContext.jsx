'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
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

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (typeof window !== 'undefined') {
        if (nextUser) {
          const token = await nextUser.getIdToken();
          localStorage.setItem('authToken', token);
          
          // Sync user with backend (try login, if fails try register)
          try {
            await apiPost('/auth/login');
          } catch (error) {
            // If user doesn't exist in DB, register them
            if (error.message?.includes('not found') || error.success === false) {
              try {
                await apiPost('/auth/register');
              } catch (registerError) {
                console.error('Failed to sync user with backend:', registerError);
              }
            }
          }
        } else {
          localStorage.removeItem('authToken');
        }
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    });

    return () => unsubscribe();
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
