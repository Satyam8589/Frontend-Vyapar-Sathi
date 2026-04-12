"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";

const FinalCTASection = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <section className="px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-14">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-slate-200 p-8 text-center shadow-sm sm:p-14">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/features/CTAImage.png')" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/84 to-slate-100/88"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_42%)]" aria-hidden="true" />

        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700">
          Next Step
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Build A Smarter Retail Operation With Vyapar Sathi.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-relaxed text-slate-700">
            Start with your first store, onboard your team, and use AI-backed
            insights to improve decisions across inventory, billing, and growth
            planning.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {!isLoading && !isAuthenticated && (
              <Link
                href="/signUp"
                className="btn-primary-yb px-10 py-4 text-center text-xs font-black uppercase tracking-[0.24em]"
              >
                Get Started
              </Link>
            )}
            <Link
              href="/storeDashboard"
              className="btn-secondary-light border-slate-300 bg-white/70 px-10 py-4 text-center text-xs font-black uppercase tracking-[0.24em]"
            >
              {isAuthenticated ? "Continue Dashboard" : "See Dashboard"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
