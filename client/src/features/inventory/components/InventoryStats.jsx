"use client";

import React, { useState } from "react";

const InventoryStats = ({ stats }) => {
  const [isStatsVisible, setIsStatsVisible] = useState(false);

  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    red: "bg-red-50 border-red-100 text-red-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
  };

  return (
    <section className="mb-4">
      {/* Toggle Button - Visible on Mobile Only */}
      <div className="flex items-center justify-between md:hidden mb-3">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
          Inventory Overview
        </span>
        <button
          onClick={() => setIsStatsVisible(!isStatsVisible)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
          aria-label="Toggle stats visibility"
        >
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${
              isStatsVisible ? "rotate-0" : "rotate-180"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      {/* Stats Grid - Hidden on Mobile by Default, Always Visible on Desktop */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up [animation-delay:100ms] ${
          isStatsVisible ? '' : 'hidden md:grid'
        }`}
      >
        {stats.map((stat, i) => {
          const colorClass =
            colorClasses[stat.color] ||
            "bg-gray-50 border-gray-100 text-gray-600";
          return (
            <div
              key={i}
              className={`${colorClass} rounded-lg p-4 border shadow-sm hover:shadow-md transition-all`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold truncate">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InventoryStats;
