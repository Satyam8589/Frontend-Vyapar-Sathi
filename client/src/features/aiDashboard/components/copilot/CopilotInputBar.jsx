"use client";

import React from "react";
import { Paperclip, Mic, MicOff, Send, Square, AlertTriangle, AudioLines, Radio } from "lucide-react";

export default function CopilotInputBar({
  message,
  setMessage,
  textareaRef,
  loading,
  isListening,
  speechSupported,
  toggleListening,
  autoGrowTextarea,
  handleKeyDown,
  handleCompositionStart,
  handleCompositionEnd,
  askCopilot,
  stopStreaming,
  setShowAttachmentModal,
  isLiveCallActive,
  isVoiceWsConnected,
  handleToggleLiveCall,
  error,
}) {
  const isVoiceActive = isLiveCallActive || isVoiceWsConnected;

  return (
    <div className="border-t border-slate-100 bg-white/95 p-3 sm:p-4 backdrop-blur-md">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm transition-all focus-within:border-indigo-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-100">
          <div className="flex items-end gap-2 p-1.5 mx-1">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setShowAttachmentModal(true)}
              className="group flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm hover:from-cyan-400 hover:to-blue-500 hover:shadow-md transition flex items-center justify-center"
              aria-label="Add attachment"
              title="Upload invoice bill or photo"
            >
              <Paperclip className="h-5 w-5 transition-transform group-hover:rotate-12" />
            </button>

            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                autoGrowTextarea();
              }}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              rows={1}
              placeholder={
                isListening
                  ? "Listening to your voice..."
                  : isVoiceActive
                  ? "Realtime Voice Mode Active — speak naturally..."
                  : "Ask Copilot anything or click mic to speak..."
              }
              className="min-h-[44px] max-h-[240px] flex-1 resize-none border-0 bg-transparent px-2 py-2.5 text-left text-base text-slate-800 outline-none placeholder:text-slate-400"
              disabled={loading}
            />

            {/* Right Action Cluster */}
            <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
              {/* 1. Speech-to-Text Dictation Mic (LEFT of Send) */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`group h-10 w-10 rounded-xl text-white shadow-sm hover:shadow-md transition flex items-center justify-center ${
                    isListening
                      ? "bg-gradient-to-br from-rose-500 to-red-600 animate-pulse ring-2 ring-red-400/50"
                      : "bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
                  }`}
                  aria-label={isListening ? "Stop dictation" : "Start speech dictation"}
                  title={isListening ? "Stop voice dictation" : "Dictate text input"}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5 animate-bounce" />
                  ) : (
                    <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
                  )}
                </button>
              )}

              {/* 2. Send / Stop Button */}
              {loading ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm hover:from-rose-400 hover:to-red-500 hover:shadow-md transition flex items-center justify-center"
                  aria-label="Stop generating"
                  title="Stop generating"
                >
                  <Square className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!String(message).trim()}
                  onClick={() => askCopilot()}
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-sm hover:from-slate-700 hover:to-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:from-slate-800 disabled:hover:to-slate-900 hover:shadow-md transition flex items-center justify-center"
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              )}

              {/* 3. Professional Realtime Socket Voice Assistant Mode (RIGHT of Send) */}
              <button
                type="button"
                onClick={handleToggleLiveCall}
                className={`group h-10 w-10 rounded-xl text-white shadow-sm hover:shadow-md transition flex items-center justify-center relative ${
                  isVoiceActive
                    ? "bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 ring-2 ring-indigo-400/50 shadow-indigo-500/30 animate-pulse"
                    : "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                }`}
                aria-label={isVoiceActive ? "Disconnect Realtime Voice Mode" : "Connect Realtime Voice Assistant"}
                title={isVoiceActive ? "Disconnect Voice Assistant" : "Live Socket Voice Assistant Mode"}
              >
                {isVoiceActive ? (
                  <div className="flex items-center justify-center">
                    <AudioLines className="h-5 w-5 text-white animate-bounce" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-ping" />
                  </div>
                ) : (
                  <AudioLines className="h-5 w-5 transition-transform group-hover:scale-110" />
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm font-medium text-rose-600 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-400 text-center">
          AI responses may contain errors. Verify critical decisions independently.
        </p>
      </div>
    </div>
  );
}
