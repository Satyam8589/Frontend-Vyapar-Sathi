"use client";

import React from "react";
import { formatCurrency } from "../services/overviewService";
import { CalendarRange, BarChart3 } from "lucide-react";

/**
 * SalesTrendsSection - Displays monthly progress bars and quarterly distribution
 */
export const SalesTrendsSection = ({ salesData, chartData }) => {
  const monthlySales = salesData?.monthlySales ?? 0;
  const yearlySales = salesData?.yearlySales ?? 0;

  const weeklyBreakdown = chartData?.weeklyBreakdown || [0, 0, 0, 0];
  const quarterlyBreakdown = chartData?.quarterlyBreakdown || [0, 0, 0, 0];

  const maxWeeklyValue = Math.max(...weeklyBreakdown, 1);
  const maxQuarterlyValue = Math.max(...quarterlyBreakdown, 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* 1. Monthly Breakdown Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                This Month Revenue
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {formatCurrency(monthlySales)}
              </h2>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 text-indigo-600 rounded-xl border border-indigo-100 shadow-xs">
              <CalendarRange className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Weekly revenue breakdown for the active month.
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 space-y-2">
          {[
            { label: "Week 1 (1st - 7th)", idx: 0 },
            { label: "Week 2 (8th - 14th)", idx: 1 },
            { label: "Week 3 (15th - 21st)", idx: 2 },
            { label: "Week 4 (22nd - End)", idx: 3 },
          ].map((week) => {
            const value = weeklyBreakdown[week.idx] || 0;
            const percentage = maxWeeklyValue > 0 ? (value / maxWeeklyValue) * 100 : 0;
            return (
              <div key={week.idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-600">{week.label}</span>
                  <span className="font-bold text-gray-900">{formatCurrency(value)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, value > 0 ? 6 : 0)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Yearly & Quarterly Breakdown Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                Annual Revenue
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {formatCurrency(yearlySales)}
              </h2>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-rose-500/10 to-rose-600/20 text-rose-600 rounded-xl border border-rose-100 shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Quarterly fiscal performance for {new Date().getFullYear()}.
          </p>
        </div>

        <div className="pt-2.5 border-t border-gray-100">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { quarter: "Q1", range: "Jan-Mar", idx: 0 },
              { quarter: "Q2", range: "Apr-Jun", idx: 1 },
              { quarter: "Q3", range: "Jul-Sep", idx: 2 },
              { quarter: "Q4", range: "Oct-Dec", idx: 3 },
            ].map((q) => {
              const value = quarterlyBreakdown[q.idx] || 0;
              const percentage = maxQuarterlyValue > 0 ? (value / maxQuarterlyValue) * 100 : 0;
              return (
                <div key={q.idx} className="flex flex-col items-center group/quarter">
                  <span className="text-xs font-black text-gray-800 mb-0.5">{q.quarter}</span>
                  <span className="text-[10px] text-gray-400 mb-1.5">{q.range}</span>

                  <div className="h-20 w-full flex items-end mb-1.5 relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/quarter:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-semibold py-0.5 px-1 rounded pointer-events-none whitespace-nowrap z-20">
                      {formatCurrency(value)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-md mx-auto transition-all duration-300"
                      style={{
                        height: `${Math.max(percentage, value > 0 ? 8 : 4)}%`,
                        opacity: value > 0 ? 1 : 0.25,
                      }}
                    ></div>
                  </div>

                  <p className="text-[10px] font-bold text-gray-700 truncate w-full text-center">
                    {formatCurrency(value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendsSection;
