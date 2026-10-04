"use client";

import React from "react";
import { Plus, MessageSquare, X } from "lucide-react";

export default function CopilotHeader({ onNewChat, onToggleSidebar, onClose }) {
  return (
    <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-0.5 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/10">
            <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center p-1">
              <img
                src="/images/logo/vs_logo_updated.svg"
                alt="Vyapar Sakha Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base tracking-tight">
              Vyapar Sakha
            </h3>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 border border-indigo-100">
              AI Copilot
            </span>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online & Ready
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onNewChat}
          className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-slate-700 hover:to-slate-800 hover:shadow transition"
          title="Start New Conversation"
        >
          <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
          <span className="hidden sm:inline">New</span>
        </button>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-indigo-400 hover:to-purple-500 hover:shadow transition"
          title="Chat History"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">History</span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition ml-1"
            title="Close Assistant"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
