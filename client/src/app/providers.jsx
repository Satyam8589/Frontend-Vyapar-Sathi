"use client";

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export default function Providers({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signUp';

  return (
    <AuthProvider>
      <Background />
      {!isAuthPage && <Navbar />}
      <div className={`relative z-10 min-h-screen ${!isAuthPage ? 'pt-24' : ''}`}>
        {children}
      </div>
    </AuthProvider>
  );
}
