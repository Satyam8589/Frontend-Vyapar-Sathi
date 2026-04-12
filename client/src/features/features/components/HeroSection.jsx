"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";

const HeroSection = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-600">
              Features Overview
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Everything Your Retail Business Needs In One Platform.
          </h1>

          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            Vyapar Sathi combines inventory control, POS billing, analytics,
            AI-powered planning, and role-based team operations so owners can
            make faster and more confident decisions every day.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/storeDashboard"
              className="btn-primary-yb px-10 py-4 text-center text-xs font-black uppercase tracking-[0.24em]"
            >
              {isAuthenticated ? "Go To Dashboard" : "Explore Dashboard"}
            </Link>
            {!isLoading && !isAuthenticated && (
              <Link
                href="/signUp"
                className="btn-secondary-light px-10 py-4 text-center text-xs font-black uppercase tracking-[0.24em]"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

          <Image
            src="/images/features/heroImage.png"
            alt="Hero Image"
            width={600}
            height={600}
            className="cover rounded-lg shadow-sm shadow-black hover:transition-shadow duration-300"
          />
        </div>
    </section>
  );
};

export default HeroSection;
