"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import SwipeToCloseToast from "@/components/SwipeToCloseToast";

export default function Providers({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signUp";
  const isBillingPage = pathname?.includes("/billing");

  return (
    <AuthProvider>
      <Background />
      {!isAuthPage && !isBillingPage && <Navbar />}
      <div
        className={`relative min-h-screen ${!isAuthPage && !isBillingPage ? "pt-20" : ""}`}
        style={
          !isAuthPage && !isBillingPage
            ? {
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0px, transparent 50px, black 80px)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0px, transparent 50px, black 80px)",
              }
            : {}
        }
      >
        {children}
      </div>
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName="z-50"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#0f172a",
            fontWeight: "600",
            fontSize: "14px",
            border: "1px border-slate-200",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            borderRadius: "12px",
            zIndex: 9999,
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
