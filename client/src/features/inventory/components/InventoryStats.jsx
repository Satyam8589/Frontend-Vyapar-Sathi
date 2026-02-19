"use client";

import React from "react";

const InventoryStats = ({ stats }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    red: "bg-red-50 border-red-100 text-red-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
  };

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 animate-fade-in-up [animation-delay:100ms]">
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
    </section>
  );
};

export default InventoryStats;
