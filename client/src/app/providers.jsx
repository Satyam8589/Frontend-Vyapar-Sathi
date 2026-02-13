'use client';

import { AuthProvider } from '@/features/auth/context/AuthContext';

export default function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
