"use client";

import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Background />
      <Navbar />
      <div className="relative z-10 min-h-screen pt-24">
        {children}
      </div>
    </AuthProvider>
  );
}
