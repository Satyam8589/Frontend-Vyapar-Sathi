'use client';

import React from 'react';

const InventoryStats = ({ stats }) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up [animation-delay:200ms]">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{stat.label}</p>
          <p className="text-3xl font-black text-slate-900">{stat.value}</p>
        </div>
      ))}
    </section>
  );
};

export default InventoryStats;
