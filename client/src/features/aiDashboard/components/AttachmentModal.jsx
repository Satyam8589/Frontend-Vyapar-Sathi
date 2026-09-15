"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  File,
  Image,
  Camera,
  X as XIcon,
  Paperclip,
} from "lucide-react";

/**
 * AttachmentModal Component
 *
 * Renders a centered attachment picker overlay directly on document.body
 * via ReactDOM.createPortal so it is never clipped by overflow:hidden
 * ancestors (e.g. the chat section card).
 */
const AttachmentModal = ({ onClose, onSelect }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!mounted) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add attachment"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <Paperclip className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Add Attachment</h3>
              <p className="text-[10px] text-slate-400">Choose how to add files</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-2 space-y-1.5">
          <button
            type="button"
            onClick={() => onSelect("file")}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
          >
            <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm group-hover:shadow transition">
              <File className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Upload File</span>
              <p className="text-[10px] text-slate-400">PDF, DOC, XLS, CSV</p>
            </div>
            <svg className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onSelect("image")}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
          >
            <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-sm group-hover:shadow transition">
              <Image className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Upload Image</span>
              <p className="text-[10px] text-slate-400">PNG, JPG, WEBP</p>
            </div>
            <svg className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onSelect("camera")}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left border border-transparent hover:border-slate-200 hover:bg-slate-50 transition"
          >
            <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-sm group-hover:shadow transition">
              <Camera className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Take Photo</span>
              <p className="text-[10px] text-slate-400">Use your camera</p>
            </div>
            <svg className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AttachmentModal;