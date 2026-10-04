"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  AlertTriangle,
  Radio,
  Star,
  X,
  Zap,
  Send,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";

export default function CartoonVoiceBotView({
  isConnected,
  isReady,
  isRecording,
  isMuted,
  permissionError,
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
}) {
  const [callDuration, setCallDuration] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [entrancePhase, setEntrancePhase] = useState("portal");

  // Multimodal Text & Image Input States
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedMime, setSelectedMime] = useState("image/jpeg");
  const fileInputRef = useRef(null);

  // Call timer (starts once ready)
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Multi-Phase Entrance Sequence
  useEffect(() => {
    setEntrancePhase("portal");

    const t1 = setTimeout(() => setEntrancePhase("ascending"), 400);
    const t2 = setTimeout(() => setEntrancePhase("powering"), 900);
    const t3 = setTimeout(() => setEntrancePhase("ready"), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Cute eye blink loop
  useEffect(() => {
    if (entrancePhase !== "ready") return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3400);
    return () => clearInterval(blinkInterval);
  }, [entrancePhase]);

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

  const isBotTalking = Boolean(isAISpeaking);
  const isUserTalking = isRecording && !isMuted;

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-b from-[#070a17] via-[#0d132b] to-[#050712] text-white overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* ANIMATION KEYFRAMES                                            */}
      {/* ------------------------------------------------------------- */}
      <style jsx>{`
        @keyframes portalSpin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(0.3);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
            opacity: 0.8;
          }
        }
        @keyframes gentleHoverWave {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes wavePulse {
          0% {
            transform: scale(0.85);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes starTwinkle {
          0%, 100% {
            transform: scale(0.8) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.9;
          }
        }
        .animate-portal-spin {
          animation: portalSpin 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-hover-wave {
          animation: gentleHoverWave 3.5s ease-in-out infinite;
        }
        .animate-wave-pulse {
          animation: wavePulse 2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }
        .animate-star-twinkle {
          animation: starTwinkle 2.8s ease-in-out infinite;
        }
      `}</style>

      {/* Hidden File Input for Bill/Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Ambient Neon Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[22rem] h-[22rem] bg-gradient-to-tr from-blue-600/30 via-indigo-600/35 to-violet-500/25 rounded-full blur-[90px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-4 w-60 h-60 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-56 h-56 bg-amber-500/15 rounded-full blur-[70px] pointer-events-none" />

      {/* Twinkling Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-6 text-amber-300 animate-star-twinkle">
          <Star className="h-4 w-4 fill-amber-300/30" />
        </div>
        <div className="absolute top-20 right-8 text-cyan-300 animate-star-twinkle [animation-delay:0.7s]">
          <Sparkles className="h-4 w-4 text-cyan-300" />
        </div>
        <div className="absolute bottom-24 left-8 text-indigo-300 animate-star-twinkle [animation-delay:1.4s]">
          <Star className="h-3 w-3 fill-indigo-300/30" />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP MINIMALIST HEADER: LOGO, STATUS, TIMER & CLOSE             */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-white/[0.08] backdrop-blur-md bg-[#090d1f]/85 shadow-sm">
        {/* Brand Logo & Connection Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-md shadow-indigo-500/30">
              <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center p-1 overflow-hidden">
                <img
                  src="/images/logo/vs_logo.png"
                  alt="Vyapar Sathi Logo"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white leading-tight">Vyapar Sathi</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-300 border border-amber-400/30">
                AI Voice + Vision
              </span>
            </div>
            <p className="text-[10px] font-semibold text-emerald-400 leading-tight flex items-center gap-1">
              <span>Live Partner</span>
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              <span className="text-indigo-200 font-medium">
                {permissionError
                  ? "Mic Error"
                  : isBotTalking
                  ? "Speaking..."
                  : isUserTalking
                  ? "Listening..."
                  : "Ready"}
              </span>
            </p>
          </div>
        </div>

        {/* Live Call Duration Timer & Close Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/10 text-xs font-mono font-bold text-indigo-200 shadow-sm backdrop-blur-sm">
            <Radio className="h-3 w-3 text-red-400 animate-pulse" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
              title="Close Voice Assistant"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER STAGE: ANIMATED MASCOT & VOICE STAGE                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2">
        {/* Holographic Portal Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-64 h-64 rounded-full border border-dashed border-cyan-400/30 animate-portal-spin" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-600/15 to-purple-500/10 blur-xl" />
        </div>

        {/* Dynamic Voice Activity Pulsing Rings */}
        {(isBotTalking || isUserTalking) && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className={`w-64 h-64 rounded-full border-2 ${isBotTalking ? "border-amber-400/40" : "border-emerald-400/40"} animate-wave-pulse`} />
            <div className={`w-80 h-80 rounded-full border ${isBotTalking ? "border-amber-300/25" : "border-emerald-300/25"} animate-wave-pulse [animation-delay:0.6s]`} />
          </div>
        )}

        {/* Mascot Wrapper */}
        <div className={entrancePhase === "ready" ? "animate-hover-wave flex flex-col items-center z-10" : "flex flex-col items-center z-10"}>
          {/* Golden Sparkle Antenna */}
          <div className="relative flex flex-col items-center">
            <span
              className={`h-5 w-5 rounded-full shadow-md flex items-center justify-center transition-all duration-500 ${
                isBotTalking
                  ? "bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-amber-400/90 scale-125 animate-bounce"
                  : isUserTalking
                  ? "bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-emerald-400/90 scale-110 animate-pulse"
                  : "bg-gradient-to-tr from-cyan-400 to-blue-400 shadow-cyan-400/80"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-white animate-spin" />
            </span>
            <div className="w-1.5 h-4 bg-gradient-to-b from-cyan-300 to-indigo-600 rounded-full" />
          </div>

          {/* CUTE ROBOT HEAD */}
          <div className="relative group">
            {/* Left Ear */}
            <div className="absolute -left-4 top-7 w-5 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-1 shadow-md border border-cyan-300/30 flex items-center justify-center">
              <div className="w-2 h-8 rounded-full bg-cyan-300/80 animate-pulse" />
            </div>
            {/* Right Ear */}
            <div className="absolute -right-4 top-7 w-5 h-14 rounded-2xl bg-gradient-to-l from-blue-600 to-indigo-600 p-1 shadow-md border border-cyan-300/30 flex items-center justify-center">
              <div className="w-2 h-8 rounded-full bg-cyan-300/80 animate-pulse" />
            </div>

            {/* Helmet Shell */}
            <div className="relative w-48 h-40 rounded-[42px] bg-gradient-to-b from-indigo-600 via-indigo-900 to-slate-900 p-2.5 shadow-[0_10px_35px_rgba(79,70,229,0.4)] border-2 border-indigo-400/40 ring-4 ring-indigo-500/20 transition-transform duration-300 hover:scale-105">
              {/* Visor Screen */}
              <div className="relative w-full h-full rounded-[32px] bg-gradient-to-b from-[#060919] via-[#0b122e] to-[#070b1e] border border-cyan-400/30 p-3 flex flex-col items-center justify-between overflow-hidden shadow-inner">
                {/* Curved Reflection */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.12] to-transparent rounded-t-[32px] pointer-events-none" />

                {/* Kawaii Eyes */}
                <div className="relative z-10 flex items-center justify-center gap-7 pt-2">
                  {/* Left Eye */}
                  <div className="flex flex-col items-center">
                    {isBlinking ? (
                      <div className="h-1.5 w-7 rounded-full bg-cyan-300 shadow-md" />
                    ) : isBotTalking ? (
                      <div className="h-7 w-7 rounded-xl bg-gradient-to-b from-cyan-300 to-blue-400 shadow-lg shadow-cyan-400/80 flex items-center justify-center">
                        <span className="text-white font-black text-xs">^</span>
                      </div>
                    ) : (
                      <div className="relative h-7 w-7 rounded-xl bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.8)] flex items-center justify-center">
                        <span className="absolute top-1 left-1 h-2.5 w-2.5 rounded-full bg-white" />
                      </div>
                    )}
                    <div className="mt-1 h-1 w-4 rounded-full bg-pink-400/60 blur-[0.5px]" />
                  </div>

                  {/* Right Eye */}
                  <div className="flex flex-col items-center">
                    {isBlinking ? (
                      <div className="h-1.5 w-7 rounded-full bg-cyan-300 shadow-md" />
                    ) : isBotTalking ? (
                      <div className="h-7 w-7 rounded-xl bg-gradient-to-b from-cyan-300 to-blue-400 shadow-lg shadow-cyan-400/80 flex items-center justify-center">
                        <span className="text-white font-black text-xs">^</span>
                      </div>
                    ) : (
                      <div className="relative h-7 w-7 rounded-xl bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-600 shadow-[0_0_15px_rgba(34,211,238,0.8)] flex items-center justify-center">
                        <span className="absolute top-1 left-1 h-2.5 w-2.5 rounded-full bg-white" />
                      </div>
                    )}
                    <div className="mt-1 h-1 w-4 rounded-full bg-pink-400/60 blur-[0.5px]" />
                  </div>
                </div>

                {/* Mouth Equalizer / Expression */}
                <div className="relative z-10 flex items-center justify-center gap-1 h-5">
                  {isBotTalking ? (
                    <>
                      <span className="w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.4s] h-3.5" />
                      <span className="w-1.5 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.2s] h-5" />
                      <span className="w-1.5 bg-yellow-200 rounded-full animate-bounce [animation-delay:-0.5s] h-4" />
                      <span className="w-1.5 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.1s] h-5" />
                      <span className="w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                    </>
                  ) : isUserTalking ? (
                    <>
                      <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3.5" />
                      <span className="w-1.5 bg-teal-300 rounded-full animate-bounce [animation-delay:-0.15s] h-5" />
                      <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce h-3" />
                    </>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-1.5 border-b-2 border-r-2 border-cyan-400 rounded-br-full" />
                      <div className="w-3 h-1.5 border-b-2 border-l-2 border-cyan-400 rounded-bl-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chest Logo */}
            <div className="relative -mt-3 mx-auto flex items-center justify-center z-20">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-400 via-indigo-600 to-blue-500 p-[1px] shadow-md">
                <div className="h-full w-full rounded-[7px] bg-white flex items-center justify-center p-0.5 overflow-hidden">
                  <img
                    src="/images/logo/vs_logo.png"
                    alt="Vyapar Sathi Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-32 h-3 mt-2 rounded-full bg-indigo-500/20 blur-md animate-pulse" />
        </div>

        {/* ACTIVE TOOL EXECUTION BADGE */}
        {activeToolStatus?.active && (
          <div className="mt-2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/50 shadow-md text-white text-xs font-bold z-20">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className={activeToolStatus.completed ? "text-emerald-300" : "text-cyan-200"}>
              {activeToolStatus.label}
            </span>
            {activeToolStatus.completed ? (
              <span className="text-[11px] text-emerald-400">✓</span>
            ) : (
              <Sparkles className="h-3 w-3 text-cyan-300 animate-spin" />
            )}
          </div>
        )}

        {/* LIVE TRANSCRIPT SPEECH BUBBLE */}
        <div className="mt-3 w-full max-w-sm px-3 z-10">
          <div className="relative rounded-2xl bg-white/[0.07] border border-white/15 p-3 backdrop-blur-md text-center shadow-lg">
            {liveTranscript ? (
              <p className="text-xs sm:text-sm font-semibold text-cyan-100 italic leading-relaxed">
                "{liveTranscript}"
              </p>
            ) : isBotTalking ? (
              <p className="text-xs sm:text-sm font-semibold text-amber-200 animate-pulse">
                "Speaking..."
              </p>
            ) : isUserTalking ? (
              <p className="text-xs sm:text-sm font-semibold text-emerald-300 animate-pulse">
                "Listening... Speak, type, or upload bill image!"
              </p>
            ) : (
              <p className="text-xs text-indigo-200">
                Speak into mic, upload paper bill image, or type text below.
              </p>
            )}
          </div>
        </div>

        {/* Permission Error Banner */}
        {permissionError && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/40 px-3 py-2 text-xs text-red-200 z-10">
            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <span>{permissionError}</span>
          </div>
        )}

        {/* Quick Voice Suggestions Chips */}
        {onQuickPrompt && !liveTranscript && (
          <div className="mt-2.5 flex flex-wrap justify-center gap-1.5 max-w-xs z-10">
            <button
              type="button"
              onClick={() => onQuickPrompt("What are my top selling items today?")}
              className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] font-medium text-indigo-200 hover:text-white transition flex items-center gap-1"
            >
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Top selling items?</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickPrompt("Which items are low in stock?")}
              className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[11px] font-medium text-indigo-200 hover:text-white transition flex items-center gap-1"
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Low stock alerts?</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MULTIMODAL INPUT BAR (TEXT + IMAGE ATTACHMENT)                */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 px-4 pt-2 pb-1 border-t border-white/[0.08] backdrop-blur-md bg-slate-950/70 flex flex-col gap-2">
        {/* Image Attachment Preview Badge */}
        {selectedImagePreview && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-900/60 border border-indigo-400/40 w-fit self-start text-xs text-indigo-200">
            <img
              src={selectedImagePreview}
              alt="Attached Bill"
              className="h-7 w-7 rounded object-cover border border-white/30"
            />
            <span className="font-semibold text-[11px]">Bill image attached</span>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setSelectedImagePreview(null);
              }}
              className="p-0.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Bill Photo Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-indigo-200 hover:text-white transition flex items-center justify-center shrink-0"
            title="Upload Supplier Bill Photo or Image"
          >
            <ImageIcon className="h-4 w-4 text-cyan-400" />
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              selectedImage
                ? "Add instruction for bill image..."
                : "Type message or ask anything..."
            }
            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/15 text-xs text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim() && !selectedImage}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-40 disabled:hover:from-cyan-500 transition flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20"
            title="Send Text / Image to Gemini Realtime"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SIMPLIFIED 2-BUTTON CONTROLS BAR (MIC TOGGLE + END CALL)      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 px-8 py-3 backdrop-blur-lg bg-black/60 flex items-center justify-center gap-8 border-t border-white/[0.05]">
        {/* 1. Mic On / Mute Button */}
        <button
          type="button"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
          title={isRecording ? "Mute Microphone" : "Turn On Microphone"}
        >
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-xl transition-all ${
              isRecording
                ? "bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/40 ring-4 ring-emerald-400/40"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/15"
            }`}
          >
            {isRecording ? <Mic className="h-5 w-5 animate-pulse" /> : <MicOff className="h-5 w-5" />}
          </div>
          <span className="text-[11px] font-semibold text-slate-200">
            {isRecording ? "Mic On" : "Muted"}
          </span>
        </button>

        {/* 2. End Call Button */}
        <button
          type="button"
          onClick={onEndCall}
          className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
          title="End Live Call"
        >
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 text-white shadow-xl shadow-rose-600/50 flex items-center justify-center hover:scale-105 hover:from-rose-500 hover:to-red-500 ring-4 ring-rose-500/30 transition-all">
            <PhoneOff className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-rose-300">End Call</span>
        </button>
      </div>
    </div>
  );
}
