"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { HelpCircle, MessageSquare, Send, Loader2, X } from "lucide-react";

/**
 * ClarificationBanner — an inline card placed ABOVE the chat input
 * area in the AskCopilotSection. It shows the agent's clarification
 * question and provides an input field for the user's answer.
 *
 * This makes it immediately visible to the user that a clarification
 * is needed, without requiring a modal/portal overlay.
 *
 * Props:
 *   question       — the clarification question string
 *   isSubmitting   — whether the submit request is in flight
 *   onSubmit       — called with the user's answer string
 *   onDismiss      — called when the user dismisses the card
 */
const ClarificationBanner = ({ question, isSubmitting = false, onSubmit, onDismiss }) => {
  const [answer, setAnswer] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setAnswer("");
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [question]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = answer.trim();
      if (!trimmed || isSubmitting) return;
      onSubmit?.(trimmed);
    },
    [answer, isSubmitting, onSubmit]
  );

  return (
    <div className="my-3 mx-1">
      <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-sm overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50/80 border-b border-indigo-100">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <HelpCircle className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.15em] text-indigo-600">
            Clarification Needed
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto rounded p-1 text-slate-400 hover:bg-indigo-100 hover:text-slate-600 transition"
            aria-label="Dismiss"
            disabled={isSubmitting}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Question */}
        <div className="px-4 py-3">
          <div className="flex items-start gap-2">
            <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {question}
            </p>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-4 pb-4">
          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-1 min-w-0 rounded-xl border-0 bg-transparent px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!answer.trim() || isSubmitting}
              className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:from-indigo-400 hover:to-purple-500 hover:shadow-md transition disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
              aria-label="Submit answer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 text-center">
            Answer this question so the agent can continue helping you.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ClarificationBanner;
