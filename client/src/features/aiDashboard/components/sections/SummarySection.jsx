"use client";

import { useState } from "react";
import EmptyState from "./EmptyState";
import { fetchSummary } from "@/features/aiDashboard/services/aiDashboardService";

const SummaryCard = ({ summary }) => {
  if (!summary) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
            Store Overview
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            {summary.title || "Store sales overview"}
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm font-semibold leading-relaxed text-slate-700">
            {summary.summary}
          </p>
          {summary.recommendation && (
            <div className="mt-5 rounded-2xl border border-indigo-100 bg-white/80 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                Recommended next step
              </p>
              <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-relaxed text-slate-700">
                {summary.recommendation}
              </p>
            </div>
          )}
        </div>
        <div className="grid min-w-[220px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Summary Mode
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {summary.llmUsed ? "LLM" : "Fallback"}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Basis
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {summary.basis || "live"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const LoadingAnimation = () => (
  <div className="rounded-[2rem] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-sm">
    <style>{`
      @keyframes slideInUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
      }
      .animate-slide-1 {
        animation: slideInUp 0.6s ease-out 0s both;
      }
      .animate-slide-2 {
        animation: slideInUp 0.6s ease-out 0.15s both;
      }
      .animate-slide-3 {
        animation: slideInUp 0.6s ease-out 0.3s both;
      }
      .animate-slide-4 {
        animation: slideInUp 0.6s ease-out 0.45s both;
      }
      .animate-icon-1 {
        animation: fadeInScale 0.5s ease-out 0.2s both;
      }
      .animate-icon-2 {
        animation: fadeInScale 0.5s ease-out 0.35s both;
      }
      .animate-icon-3 {
        animation: fadeInScale 0.5s ease-out 0.5s both;
      }
      .animate-pulse-slow {
        animation: pulse 2s ease-in-out infinite;
      }
    `}</style>
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="animate-slide-1">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
          Store Overview
        </p>
      </div>

      {/* Title Skeleton */}
      <div className="animate-slide-2 space-y-3">
        <div className="h-8 w-2/3 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-50"></div>
      </div>

      {/* Icon Grid with Motion */}
      <div className="grid grid-cols-3 gap-3">
        <div className="animate-icon-1 flex flex-col items-center gap-2 rounded-xl bg-white/50 p-4">
          <div className="rounded-full bg-indigo-100 p-3">
            <svg
              className="h-5 w-5 text-indigo-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M12 2a1 1 0 011 1v1h4a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h4V3a1 1 0 011-1h2zm-2 4H5v10h10V6h-5z" />
            </svg>
          </div>
          <div className="h-3 w-8 rounded bg-slate-200"></div>
        </div>

        <div className="animate-icon-2 flex flex-col items-center gap-2 rounded-xl bg-white/50 p-4">
          <div className="rounded-full bg-emerald-100 p-3">
            <svg
              className="h-5 w-5 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="h-3 w-8 rounded bg-slate-200"></div>
        </div>

        <div className="animate-icon-3 flex flex-col items-center gap-2 rounded-xl bg-white/50 p-4">
          <div className="rounded-full bg-amber-100 p-3">
            <svg
              className="h-5 w-5 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="h-3 w-8 rounded bg-slate-200"></div>
        </div>
      </div>

      {/* Description Lines */}
      <div className="space-y-2 animate-slide-3">
        <div className="h-4 w-full rounded-lg bg-slate-100"></div>
        <div className="h-4 w-5/6 rounded-lg bg-slate-100"></div>
        <div className="h-4 w-4/5 rounded-lg bg-slate-100"></div>
      </div>

      {/* Bottom Box */}
      <div className="animate-slide-4 rounded-lg border border-indigo-100 bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-400 animate-pulse-slow"></div>
          <div className="h-3 w-24 rounded bg-slate-200"></div>
        </div>
      </div>
    </div>
  </div>
);

const SummarySection = ({ storeId, summary, loading, error }) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [localSummary, setLocalSummary] = useState(summary || null);
  const [localError, setLocalError] = useState(error || "");

  const handleGenerateSummary = async () => {
    setLocalLoading(true);
    setLocalError("");
    try {
      const result = await fetchSummary(storeId);
      setLocalSummary(result || null);
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || "Failed to generate summary";
      setLocalError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  // Use local state if summary hasn't been generated, otherwise use prop
  const displaySummary = localSummary || summary;
  const isLoading = localLoading || loading;
  const displayError = localError || error;

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (displaySummary) {
    return <SummaryCard summary={displaySummary} />;
  }

  if (displayError && !displaySummary) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Summary unavailable
            </h3>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              {displayError}
            </p>
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="mx-auto rounded-lg bg-indigo-600 px-6 py-2 text-sm font-black text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-xl font-black text-slate-900">
            Generate Store Summary
          </h3>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Click the button below to generate a detailed AI-powered summary of
            your store performance. This may take a few moments.
          </p>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="mx-auto flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Generate Summary
        </button>
      </div>
    </div>
  );
};

export default SummarySection;
