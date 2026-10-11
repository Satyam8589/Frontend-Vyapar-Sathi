"use client";

import React, { useState, useEffect, useRef } from "react";
import WaveRibbonAnimation from "./WaveRibbonAnimation";
import {
  Mic,
  MicOff,
  Sparkles,
  AlertTriangle,
  X,
  Plus,
  Send,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Loader2,
  Share2,
} from "lucide-react";

export default function CartoonVoiceBotView({
  messages = [],
  isConnected = false,
  isReady = false,
  isRecording = false,
  isMuted = false,
  permissionError = "",
  onStartRecording,
  onStopRecording,
  onToggleMute,
  onEndCall,
  onSendTextMessage,
  onSendImageInput,
  liveTranscript = "",
  isAISpeaking = false,
  activeToolStatus = null,
  onQuickPrompt,
  onClose,
  onFeedback,
  onCopy,
}) {
  const [callDuration, setCallDuration] = useState(0);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedMime, setSelectedMime] = useState("image/jpeg");
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // Jump animation on turn change
  const [isJumping, setIsJumping] = useState(false);
  const prevTurnRef = useRef({ isAISpeaking: false, isUserTalking: false });

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const transcriptContainerRef = useRef(null);

  // Call timer (ticks once connected)
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simple, clean jump animation whenever the turn switches
  useEffect(() => {
    const userTalking = Boolean(isRecording && !isMuted && liveTranscript);
    const prev = prevTurnRef.current;

    const aiTurnStarted = !prev.isAISpeaking && isAISpeaking;
    const aiTurnEnded = prev.isAISpeaking && !isAISpeaking;
    const userTurnEnded = prev.isUserTalking && !userTalking;

    if (aiTurnStarted || aiTurnEnded || userTurnEnded) {
      setIsJumping(true);
      const timer = setTimeout(() => setIsJumping(false), 600);
      return () => clearTimeout(timer);
    }

    prevTurnRef.current = { isAISpeaking: Boolean(isAISpeaking), isUserTalking: userTalking };
  }, [isAISpeaking, isRecording, isMuted, liveTranscript]);

  // Auto-scroll transcript to bottom smoothly when messages or transcripts update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, liveTranscript, isReady]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setSelectedImagePreview(result);
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if (selectedImage) {
      onSendImageInput?.(selectedImage, selectedMime, inputText);
      setSelectedImage(null);
      setSelectedImagePreview(null);
      setInputText("");
    } else if (inputText.trim()) {
      onSendTextMessage?.(inputText);
      setInputText("");
    }
  };

  const handleCopyMessage = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    onCopy?.(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeakMessage = (text, id) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`~>-]/g, " ").trim();
      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.onstart = () => setSpeakingMsgId(id);
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      setSpeakingMsgId(null);
    }
  };

  const handleShareTranscript = () => {
    if (!messages.length) return;
    const transcriptText = messages
      .map((m) => `${m.role === "user" ? "You" : "Vyapar Sakha"}: ${m.text || ""}`)
      .join("\n\n");
    navigator.clipboard.writeText(transcriptText);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const isUserTalking = Boolean(isRecording && !isMuted && liveTranscript?.trim());
  const isAiTalking = Boolean(isAISpeaking || speakingMsgId);

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-b from-slate-50 via-white to-slate-100/90 text-slate-800 overflow-hidden select-none font-sans">
      {/* ------------------------------------------------------------- */}
      {/* CSS KEYFRAMES FOR 3D BLUE ORB & JUMP ANIMATION                */}
      {/* ------------------------------------------------------------- */}
      <style jsx>{`
        @keyframes orbFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes orbJump {
          0% {
            transform: translateY(0px) scale(1);
          }
          30% {
            transform: translateY(-14px) scale(1.05, 0.95);
          }
          55% {
            transform: translateY(0px) scale(0.96, 1.04);
          }
          75% {
            transform: translateY(-4px) scale(1.01);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
        @keyframes orbAiPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1) drop-shadow(0 0 16px rgba(59, 130, 246, 0.4));
          }
          50% {
            transform: scale(1.06);
            filter: brightness(1.16) drop-shadow(0 0 24px rgba(99, 102, 241, 0.55));
          }
        }
        @keyframes orbRipple {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.55);
            opacity: 0;
          }
        }
        @keyframes orbClouds1 {
          0% {
            transform: rotate(0deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1.1);
          }
        }
        @keyframes orbClouds2 {
          0% {
            transform: rotate(360deg) scale(1.25);
          }
          100% {
            transform: rotate(0deg) scale(1.25);
          }
        }
      `}</style>

      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER BAR (STATUS BADGE, CALL DURATION, SHARE, CLOSE)     */}
      {/* ------------------------------------------------------------- */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Status badge */}
          {!isReady ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold shadow-xs">
              <Loader2 className="h-3 w-3 animate-spin text-amber-600" />
              Getting ready...
            </span>
          ) : isAiTalking ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              Speaking...
            </span>
          ) : isUserTalking ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              Listening...
            </span>
          ) : isMuted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold shadow-xs">
              <MicOff className="h-3 w-3 text-rose-600" />
              Microphone Muted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Connected
            </span>
          )}

          {/* Call duration timer */}
          <span className="font-mono text-xs text-slate-400 font-medium tracking-wide">
            {formatTimer(callDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share / Copy Transcript */}
          <button
            type="button"
            onClick={handleShareTranscript}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition flex items-center gap-1.5 text-xs font-medium"
            title="Copy conversation transcript"
          >
            {shareCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Close button if provided */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* PERMISSION ERROR ALERT (IF MIC BLOCKED)                       */}
      {/* ------------------------------------------------------------- */}
      {permissionError && (
        <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 shrink-0">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
          <span className="flex-1 font-medium">{permissionError}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TRANSCRIPT AREA (VISIBLE ABOVE ANIMATION)                      */}
      {/* ------------------------------------------------------------- */}
      <main
        ref={transcriptContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0"
      >
        {/* Empty State when no messages yet */}
        {!messages.length && !liveTranscript ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Hi there! What's on your mind today?
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Speak naturally in English or Hindi. You'll see real-time transcripts and answers right here.
            </p>
            {onQuickPrompt && (
              <div className="flex flex-wrap gap-2 justify-center mt-5">
                {["Low stock items?", "Today's sales summary?", "Help me create a product"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => onQuickPrompt(q)}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 transition font-medium shadow-xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Render messages list */
          messages.map((msg, idx) => {
            const isUser = msg.role === "user";

            if (isUser) {
              return (
                <div key={msg.id || idx} className="flex justify-end animate-fadeIn">
                  <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-blue-600 text-white px-4 py-2.5 shadow-sm text-sm font-medium leading-relaxed break-words">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Uploaded"
                        className="mt-2 rounded-lg max-h-40 object-cover border border-white/20"
                      />
                    )}
                  </div>
                </div>
              );
            }

            // Assistant turn
            return (
              <div
                key={msg.id || idx}
                className="flex flex-col items-start max-w-[85%] space-y-1.5 animate-fadeIn"
              >
                <div className="text-[15px] text-slate-800 leading-relaxed font-normal whitespace-pre-wrap break-words">
                  {msg.text}
                  {msg.streaming && (
                    <span className="inline-block h-2 w-2 ml-1 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>

                {/* Action buttons (Copy, Speaker, Thumbs Up/Down) */}
                <div className="flex items-center gap-1 text-slate-400 pt-0.5">
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(msg.text, msg.id || idx)}
                    className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Copy text"
                  >
                    {copiedMsgId === (msg.id || idx) ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeakMessage(msg.text, msg.id || idx)}
                    className={`p-1 rounded-md hover:bg-slate-100 transition ${
                      speakingMsgId === (msg.id || idx)
                        ? "text-blue-600 bg-blue-50"
                        : "hover:text-slate-700"
                    }`}
                    title="Read aloud"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onFeedback?.(msg.id, "like")}
                    className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Good answer"
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onFeedback?.(msg.id, "dislike")}
                    className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Bad answer"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Live speech interim transcript bubble ONLY when user is actively speaking and AI is NOT speaking */}
        {!isAISpeaking &&
          liveTranscript &&
          isRecording &&
          !isMuted &&
          (!messages.length ||
            messages[messages.length - 1]?.role !== "user" ||
            messages[messages.length - 1]?.text?.trim() !== liveTranscript.trim()) && (
            <div className="flex justify-end animate-fadeIn">
              <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-blue-600 text-white px-4 py-2.5 shadow-sm text-sm font-medium leading-relaxed break-words flex items-center gap-2">
                <span className="whitespace-pre-wrap">{liveTranscript}</span>
                <span className="h-2 w-2 rounded-full bg-white animate-ping shrink-0" />
              </div>
            </div>
        )}

        {/* Realtime Tool Execution Status Pill */}
        {activeToolStatus?.active && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium w-fit animate-fadeIn">
            <Sparkles className="h-3.5 w-3.5 animate-spin text-blue-600 shrink-0" />
            <span>{activeToolStatus.label || `Executing ${activeToolStatus.name}...`}</span>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-2 shrink-0" />
      </main>

      {/* ------------------------------------------------------------- */}
      {/* ANIMATION AREA: "GETTING READY" VS 3D BLUE ORB + SOUNDWAVE     */}
      {/* ------------------------------------------------------------- */}
      <section className="relative w-full flex flex-col items-center justify-center py-4 shrink-0 z-10 select-none overflow-hidden min-h-[140px]">
        {!isReady ? (
          /* BEFORE READY: "GETTING READY..." STATE */
          <div className="flex flex-col items-center justify-center py-4 transition-all animate-fadeIn">
            <div className="relative flex items-center justify-center mb-2.5">
              <div className="absolute h-16 w-16 rounded-full bg-blue-500/15 animate-ping" />
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-700 tracking-tight">
              Getting ready...
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Connecting live audio stream to Vyapar Sakha
            </p>
          </div>
        ) : (
          /* ONCE READY: WAVY SOUNDWAVE RIBBONS BEHIND 3D BLUE ORB WITH CONCENTRIC RINGS */
          <div className="relative w-full flex items-center justify-center transition-all animate-fadeIn py-2 min-h-[130px]">
            {/* 1. Fluid Wavy Soundwave Ribbon Animation (Behind the orb, stretching horizontally across) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center z-0">
              <WaveRibbonAnimation
                isAISpeaking={isAiTalking}
                isUserTalking={isUserTalking}
              />
            </div>

            {/* 2. Concentric Halo Rings & Volumetric Glow (matching reference image) */}
            <div className="relative z-10 flex items-center justify-center">
              {/* Outer static concentric halo ring from reference image */}
              <div className="absolute rounded-full pointer-events-none w-32 h-32 sm:w-36 sm:h-36 border border-blue-400/35 bg-blue-400/5 shadow-[0_0_20px_rgba(96,165,250,0.18)]" />
              <div className="absolute rounded-full pointer-events-none w-44 h-44 border border-blue-300/15" />

              {/* Audio reactive pulse ripple rings while speaking */}
              {(isAiTalking || isUserTalking) && (
                <>
                  <div
                    className="absolute rounded-full pointer-events-none w-28 h-28 border border-blue-400/40 bg-blue-400/10"
                    style={{ animation: "orbRipple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite" }}
                  />
                  <div
                    className="absolute rounded-full pointer-events-none w-36 h-36 border border-blue-400/25 bg-blue-400/5"
                    style={{
                      animation: "orbRipple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite",
                      animationDelay: "0.8s",
                    }}
                  />
                </>
              )}

              {/* Ambient soft blue volumetric glow */}
              <div
                className={`absolute rounded-full w-24 h-24 blur-xl transition-all duration-500 pointer-events-none ${
                  isAiTalking ? "bg-blue-500/35 scale-125" : "bg-blue-400/20 scale-100"
                }`}
              />

              {/* The 3D Sphere Container (Clean Blue with Jump Animation) */}
            <div
              className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden shadow-2xl transition-all duration-300"
              style={{
                boxShadow:
                  "0 14px 28px -6px rgba(37, 99, 235, 0.35), 0 0 20px rgba(96, 165, 250, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -6px 12px rgba(15, 23, 42, 0.55)",
                animation: isJumping
                  ? "orbJump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  : isAISpeaking
                  ? "orbAiPulse 2s ease-in-out infinite"
                  : "orbFloat 4s ease-in-out infinite",
              }}
            >
              {/* Base 3D Radial Sphere Lighting (Sky-Blue to Oceanic Deep) */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #bfdbfe 0%, #60a5fa 30%, #2563eb 65%, #1e40af 88%, #0f172a 100%)",
                }}
              />

              {/* Swirling Atmospheric Cloud Layer 1 */}
              <div
                className="absolute -inset-2 rounded-full opacity-80"
                style={{
                  background:
                    "radial-gradient(ellipse at 40% 45%, rgba(255, 255, 255, 0.9) 0%, rgba(191, 219, 254, 0.55) 35%, rgba(59, 130, 246, 0.25) 65%, transparent 80%)",
                  animation: "orbClouds1 16s linear infinite",
                  mixBlendMode: "overlay",
                }}
              />

              {/* Swirling Atmospheric Cloud Layer 2 */}
              <div
                className="absolute -inset-3 rounded-full opacity-65"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 55%, rgba(255, 255, 255, 0.75) 0%, rgba(147, 197, 253, 0.45) 40%, transparent 75%)",
                  animation: "orbClouds2 22s linear infinite",
                  mixBlendMode: "screen",
                }}
              />

              {/* Equatorial Soft Light Glow Band */}
              <div
                className="absolute inset-0 rounded-full opacity-45"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.7) 48%, rgba(255,255,255,0.95) 52%, transparent 70%)",
                  mixBlendMode: "overlay",
                }}
              />

              {/* 3D Specular Highlight */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 30% 22%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.35) 20%, rgba(255, 255, 255, 0) 50%)",
                }}
              />

              {/* Bottom Rim Ambient Occlusion Shadow */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 115%, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0) 65%)",
                }}
              />
            </div>
          </div>
        </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM CONTROL BAR: PILL-STYLE INPUT + MIC + CLOSE BUTTON     */}
      {/* ------------------------------------------------------------- */}
      <footer className="px-6 pb-4 pt-1 shrink-0 z-20">
        {/* Attachment preview chip if image selected */}
        {selectedImagePreview && (
          <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 w-fit text-xs text-blue-700">
            <img
              src={selectedImagePreview}
              alt="Attachment"
              className="h-7 w-7 rounded object-cover border border-blue-300"
            />
            <span className="font-medium text-[11px]">Bill image attached</span>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setSelectedImagePreview(null);
              }}
              className="p-0.5 rounded-full hover:bg-blue-200/60 text-blue-600 transition"
              title="Remove attachment"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Floating pill container */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 max-w-2xl mx-auto">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Plus / Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition shrink-0"
            title="Attach image or bill"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={selectedImage ? "Add instruction for image..." : "Type..."}
            className="flex-1 bg-transparent border-0 text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2 min-w-0"
          />

          {/* Send Button (if user typed text or attached image) */}
          {(inputText.trim() || selectedImage) && (
            <button
              type="button"
              onClick={handleSend}
              className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition shrink-0 shadow-xs"
              title="Send"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Mic Mute / Unmute Button */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`h-8 w-8 rounded-full flex items-center justify-center transition shrink-0 ${
              isMuted
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMuted ? (
              <MicOff className="h-4 w-4 text-rose-600" />
            ) : (
              <Mic className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Close Voice Call Button (Blue circle with X matching screenshot) */}
          <button
            type="button"
            onClick={onEndCall}
            className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm shadow-blue-500/30 transition shrink-0 active:scale-95"
            title="Exit voice mode"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </footer>
    </div>
  );
}
