"use client";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/features/auth/context/AuthContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      <div className="min-h-screen pt-24">
        {children}
      </div>
    </AuthProvider>
  );
}
