"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { Send, X, Loader2, HelpCircle, MessageSquare } from "lucide-react";

/**
 * ClarificationCard — a React Portal-rendered card that displays
 * the agent's clarification question and captures the user's answer.
 *
 * Rendered via `ReactDOM.createPortal` directly into `document.body`
 * so it is NOT affected by any parent component's CSS (overflow,
 * z-index, transform, etc.).
 *
 * Props:
 *   question     — the clarification question string from the backend
 *   chatId       — current chat ID
 *   isOpen       — whether the card is visible
 *   onClose      — called when the user dismisses the card
 *   onSubmit     — called with the user's answer when they submit
 *   isSubmitting — whether the submit request is in flight
 */
const ClarificationCard = ({ question, chatId, isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [answer, setAnswer] = useState("");
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setAnswer("");
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = answer.trim();
      if (!trimmed || isSubmitting) return;
      onSubmit?.(trimmed);
    },
    [answer, isSubmitting, onSubmit]
  );

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) {
        onClose?.();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  const card = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Clarification required"
    >
      <div
        ref={cardRef}
        className="w-full max-w-lg mx-4 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 pt-5 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-800">Clarification Required</h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.18em] font-black">
              Vyapar Sathi
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Dismiss"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Question */}
        <div className="px-6 pb-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
            <div className="flex items-start gap-2">
              <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
              <p className="text-sm font-semibold text-indigo-900 leading-relaxed">
                {question}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-5">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <textarea
              ref={inputRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              placeholder="Type your answer here..."
              className="w-full resize-none rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!answer.trim() || isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-400 hover:to-purple-500 hover:shadow-md transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Submit Answer
              {!isSubmitting && <Send className="h-3.5 w-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(card, document.body);
};

export default ClarificationCard;
