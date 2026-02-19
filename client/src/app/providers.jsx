"use client";

import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import SwipeToCloseToast from '@/components/SwipeToCloseToast';

export default function Providers({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signUp';

  return (
    <AuthProvider>
      <Background />
      {!isAuthPage && <Navbar />}
      <div
        className={`relative z-10 min-h-screen ${!isAuthPage ? 'pt-24' : ''}`}
        style={!isAuthPage ? {
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 96px)',
          maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 96px)',
        } : {}}
      >
        {children}
      </div>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#0f172a',
            fontWeight: '600',
            fontSize: '14px',
            border: '1px border-slate-200',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
          },
        }}
      >
        {(t) => (
          <SwipeToCloseToast t={t}>
            {({ icon, message }) => (
              <>
                {icon}
                <div className="flex-1 px-1">{message}</div>
              </>
            )}
          </SwipeToCloseToast>
        )}
      </Toaster>
    </AuthProvider>
  );
}
