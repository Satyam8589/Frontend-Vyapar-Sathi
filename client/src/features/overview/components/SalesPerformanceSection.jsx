"use client";

import React from "react";
import { formatCurrency } from "../services/overviewService";
import { IndianRupee, TrendingUp, Calendar, Zap } from "lucide-react";

/**
 * SalesPerformanceSection - Displays Today's Realtime Revenue & Weekly Breakdown Chart
 */
export const SalesPerformanceSection = ({ salesData, chartData }) => {
  const dailySales = salesData?.dailySales ?? 0;
  const weeklySales = salesData?.weeklySales ?? 0;
  const aov = salesData?.averageOrderValue ?? 0;
  const dailyLabels = chartData?.dailyLabels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dailyBreakdown = chartData?.dailyBreakdown || [];

  const maxDailyValue = Math.max(...dailyBreakdown, 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* Left Column: Today's Revenue Showcase */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white relative overflow-hidden group flex flex-col justify-between transition-all">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/50 mb-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                Today's Revenue
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {formatCurrency(dailySales)}
              </h2>
            </div>
            <div className="bg-blue-600/10 p-3 rounded-xl border border-blue-100 shadow-xs transform transition-transform group-hover:scale-105 group-hover:rotate-3">
              <IndianRupee className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-2.5 px-3 bg-gray-50/80 rounded-xl border border-gray-100 mb-3">
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Avg Order Value</p>
              <p className="text-base font-bold text-gray-800">{formatCurrency(aov)}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Today's Orders</p>
              <p className="text-base font-bold text-gray-800">
                {salesData?.todayOrders ?? (dailySales > 0 ? "Active" : 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                dailySales > 0 ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-gray-600 text-xs font-semibold">
              {dailySales > 0 ? "Revenue momentum active" : "Waiting for today's first sale"}
            </span>
          </div>
          <p className="text-gray-400 text-xs font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right Column: Weekly Sales & 7-Day Interactive Bar Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md border border-white flex flex-col justify-between transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                Last 7 Days Revenue
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {formatCurrency(weeklySales)}
              </h2>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-600 rounded-xl border border-emerald-100 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Daily revenue distribution over current cycle.
          </p>
        </div>

        {/* 7-Day Bar Chart */}
        <div className="pt-2.5 border-t border-gray-100">
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {dailyLabels.map((day, idx) => {
              const value = dailyBreakdown[idx] || 0;
              const heightPercent = maxDailyValue > 0 ? (value / maxDailyValue) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col items-center group/bar">
                  <div className="h-20 w-full flex items-end mb-1.5 relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-semibold py-0.5 px-1 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                      {formatCurrency(value)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover/bar:from-emerald-700 group-hover/bar:to-emerald-500 rounded-md transition-all duration-300"
                      style={{
                        height: value > 0 ? `${Math.max(heightPercent, 10)}%` : "4%",
                        opacity: value > 0 ? 1 : 0.25,
                      }}
                    ></div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {day}
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

export default SalesPerformanceSection;
