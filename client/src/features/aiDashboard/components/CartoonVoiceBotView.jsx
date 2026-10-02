"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Sparkles,
  AlertTriangle,
  Radio,
  Zap,
  Heart,
  Bot,
  Sun,
  Activity,
  Flame,
  Star,
  X,
  Plus,
  MessageSquare,
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
  liveTranscript = "",
  isAISpeaking = false,
  activeToolStatus = null,
  onQuickPrompt,
  onClose,
  voiceAutoSpeak = true,
  onToggleVoiceAutoSpeak,
}) {
  const [callDuration, setCallDuration] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Dazzling Multi-Phase Entrance Stages:
  // "portal" (0 - 650ms) -> "ascending" (650ms - 1400ms) -> "powering" (1400ms - 2100ms) -> "ready" (2100ms+)
  const [entrancePhase, setEntrancePhase] = useState("portal");

  // Call timer (starts once ready)
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Multi-Phase Dazzling Entrance Sequence
  useEffect(() => {
    setEntrancePhase("portal");

    // Phase 2: Bot ascends out of the light beam (650ms)
    const t1 = setTimeout(() => {
      setEntrancePhase("ascending");
    }, 650);

    // Phase 3: Powering on & eyes flutter open (1400ms)
    const t2 = setTimeout(() => {
      setEntrancePhase("powering");
    }, 1400);

    // Phase 4: Fully awake, interactive, and sparkling (2100ms)
    const t3 = setTimeout(() => {
      setEntrancePhase("ready");
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Periodic cute blink when awake
  useEffect(() => {
    if (entrancePhase !== "ready") return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3200);
    return () => clearInterval(blinkInterval);
  }, [entrancePhase]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isBotTalking = isAISpeaking || (isConnected && isReady && !isRecording);
  const isUserTalking = isRecording && !isMuted;

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-b from-[#080c1a] via-[#0e1530] to-[#060813] text-white overflow-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* DAZZLING CUSTOM ANIMATION KEYFRAMES                           */}
      {/* ------------------------------------------------------------- */}
      <style jsx>{`
        @keyframes portalSpin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(0.2);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) rotate(180deg) scale(1.15);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) scale(1);
            opacity: 0.85;
          }
        }
        @keyframes lightBeamAscend {
          0% {
            opacity: 0;
            height: 0px;
            transform: scaleX(0.2);
          }
          50% {
            opacity: 0.9;
            height: 320px;
            transform: scaleX(1.3);
          }
          100% {
            opacity: 0.25;
            height: 380px;
            transform: scaleX(1);
          }
        }
        @keyframes dazzlingAscend {
          0% {
            transform: translateY(110px) scale(0.7);
            opacity: 0;
            filter: blur(14px) brightness(1.8);
          }
          60% {
            transform: translateY(-12px) scale(1.05);
            opacity: 1;
            filter: blur(0px) brightness(1.2);
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 1;
            filter: blur(0px) brightness(1);
          }
        }
        @keyframes gentleHoverWave {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          30% {
            transform: translateY(-9px) rotate(-1deg);
          }
          70% {
            transform: translateY(-5px) rotate(1deg);
          }
        }
        @keyframes scanlineSheen {
          0% {
            transform: translateY(-120%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(220%);
            opacity: 0;
          }
        }
        @keyframes ringRadiate {
          0% {
            transform: scale(0.3);
            opacity: 0.95;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        @keyframes starTwinkle {
          0%, 100% {
            transform: scale(0.8) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
            opacity: 1;
          }
        }
        .animate-portal-spin {
          animation: portalSpin 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-light-beam {
          animation: lightBeamAscend 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-dazzling-rise {
          animation: dazzlingAscend 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .animate-hover-wave {
          animation: gentleHoverWave 3.8s ease-in-out infinite;
        }
        .animate-scanline-sheen {
          animation: scanlineSheen 1.3s ease-out forwards;
        }
        .animate-ring-radiate {
          animation: ringRadiate 2s cubic-bezier(0.1, 0.9, 0.2, 1) infinite;
        }
        .animate-star-twinkle {
          animation: starTwinkle 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* ------------------------------------------------------------- */}
      {/* COSMIC NEON AMBIENT LIGHTS & PARTICLES                        */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[24rem] h-[24rem] bg-gradient-to-tr from-blue-600/35 via-indigo-600/40 to-violet-500/30 rounded-full blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-[85px] pointer-events-none" />
      <div className="absolute top-1/3 -right-10 w-64 h-64 bg-amber-500/20 rounded-full blur-[75px] pointer-events-none" />

      {/* Twinkling Stardust Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-14 left-8 text-amber-300 animate-star-twinkle">
          <Star className="h-4 w-4 fill-amber-300/40" />
        </div>
        <div className="absolute top-24 right-10 text-cyan-300 animate-star-twinkle [animation-delay:0.8s]">
          <Sparkles className="h-4 w-4 text-cyan-300" />
        </div>
        <div className="absolute bottom-28 left-10 text-indigo-300 animate-star-twinkle [animation-delay:1.5s]">
          <Star className="h-3 w-3 fill-indigo-300/40" />
        </div>
        <div className="absolute bottom-36 right-12 text-pink-300 animate-star-twinkle [animation-delay:1.1s]">
          <Sparkles className="h-3.5 w-3.5 text-pink-300" />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP DARK BLUE HEADER: LOGO, STATUS, TIMER & CALL CONTROLS     */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] backdrop-blur-md bg-[#090d1f]/90 animate-in fade-in slide-in-from-top-4 duration-500 shadow-md">
        {/* Left Side: Brand Logo + Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-md shadow-indigo-500/30 ring-2 ring-indigo-500/20">
              <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center overflow-hidden p-1">
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
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 text-amber-300 border border-amber-400/30">
                AI Buddy
              </span>
            </div>
            <p className="text-[10px] font-semibold text-emerald-400 leading-tight flex items-center gap-1">
              <span>Live Call</span>
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              <span className="text-indigo-200 font-medium">
                {permissionError
                  ? "Mic Error"
                  : entrancePhase !== "ready"
                  ? "Summoning..."
                  : isBotTalking
                  ? "Speaking..."
                  : isUserTalking
                  ? "Listening..."
                  : "Online"}
              </span>
            </p>
          </div>
        </div>

        {/* Right Side Controls in Blue Header */}
        <div className="flex items-center gap-1.5">
          {/* Live Call Duration */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/10 text-xs font-mono font-bold text-indigo-200 shadow-sm backdrop-blur-sm">
            <Radio className="h-3 w-3 text-red-400 animate-pulse" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          {/* Voice Auto-Speak Toggle */}
          {onToggleVoiceAutoSpeak && (
            <button
              type="button"
              onClick={onToggleVoiceAutoSpeak}
              className={`group inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm transition ${
                voiceAutoSpeak
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20"
                  : "bg-white/10 text-slate-300 hover:bg-white/15"
              }`}
              title={
                voiceAutoSpeak
                  ? "AI Voice Readout: ON (Click to turn off)"
                  : "AI Voice Readout: OFF (Click to enable)"
              }
            >
              {voiceAutoSpeak ? (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Voice ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Voice OFF</span>
                </>
              )}
            </button>
          )}

          {/* End Call Button in Blue Header */}
          <button
            type="button"
            onClick={onEndCall}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-rose-600 hover:to-red-700 hover:shadow transition animate-pulse"
            title="End Live Voice Call"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span className="font-bold">End Call</span>
          </button>

          {/* Close Drawer Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER STAGE: DAZZLING PORTAL & RISING CHARACTER              */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2">
        {/* 1. EXPANDING HOLOGRAPHIC ENERGY PORTAL (Background of character) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {/* Concentric Rotating Plasma Halo */}
          <div className="w-72 h-72 rounded-full border-2 border-dashed border-cyan-400/35 animate-portal-spin" />
          <div className="absolute inset-4 rounded-full border border-indigo-400/30 animate-spin [animation-duration:8s]" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-cyan-500/15 via-indigo-600/20 to-purple-500/15 blur-md" />
        </div>

        {/* 2. UPWARD ASCENDING LIGHT BEAM */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-t from-cyan-400/40 via-indigo-500/25 to-transparent rounded-full blur-lg animate-light-beam pointer-events-none" />

        {/* 3. DAZZLING RISING CHARACTER */}
        <div className="relative flex flex-col items-center animate-dazzling-rise">
          {/* FLOATING HOVER WRAPPER */}
          <div className={entrancePhase === "ready" ? "animate-hover-wave flex flex-col items-center" : "flex flex-col items-center"}>
            {/* Floor Startup Shockwave Rings */}
            <div className="absolute -bottom-8 w-48 h-48 rounded-full border-2 border-cyan-400/40 animate-ring-radiate pointer-events-none" />

            {/* Glowing Aura Rings when Talking */}
            {(isBotTalking || isUserTalking) && (
              <>
                <div className="absolute -inset-14 rounded-full border border-cyan-400/25 animate-ping [animation-duration:2.8s] pointer-events-none" />
                <div className="absolute -inset-9 rounded-full border-2 border-indigo-400/35 animate-pulse [animation-duration:1.6s] pointer-events-none" />
              </>
            )}

            {/* Golden Star Antenna */}
            <div className="relative flex flex-col items-center z-20">
              <div className="relative">
                <span
                  className={`h-5 w-5 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ${
                    entrancePhase === "portal"
                      ? "bg-slate-700 opacity-40 scale-50"
                      : isBotTalking
                      ? "bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-amber-400/90 scale-125 animate-bounce"
                      : isUserTalking
                      ? "bg-gradient-to-tr from-emerald-400 to-teal-300 shadow-emerald-400/90 scale-110 animate-pulse"
                      : "bg-gradient-to-tr from-cyan-400 to-blue-400 shadow-cyan-400/80 scale-100"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-white animate-spin" />
                </span>
                {entrancePhase !== "portal" && (
                  <span className="absolute -inset-2 rounded-full bg-cyan-400 opacity-40 blur-md animate-ping" />
                )}
              </div>
              <div className="w-2 h-5 bg-gradient-to-b from-cyan-300 to-indigo-600 rounded-full shadow-inner" />
            </div>

            {/* MAIN CUTE ROBOT HEAD UNIT */}
            <div className="relative group">
              {/* Cute Cat Headphone Ears */}
              {/* Left Ear */}
              <div className="absolute -left-5 top-8 w-6 h-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-1 shadow-lg shadow-blue-500/40 flex flex-col items-center justify-center border border-cyan-300/40 transition-transform group-hover:-translate-x-1">
                <div className="w-2.5 h-10 rounded-full bg-gradient-to-b from-cyan-300 to-blue-400 animate-pulse shadow-sm shadow-cyan-300" />
              </div>
              {/* Right Ear */}
              <div className="absolute -right-5 top-8 w-6 h-16 rounded-3xl bg-gradient-to-l from-blue-600 to-indigo-600 p-1 shadow-lg shadow-blue-500/40 flex flex-col items-center justify-center border border-cyan-300/40 transition-transform group-hover:translate-x-1">
                <div className="w-2.5 h-10 rounded-full bg-gradient-to-b from-cyan-300 to-blue-400 animate-pulse shadow-sm shadow-cyan-300" />
              </div>

              {/* Left Cute Floating Hand (Waving cheerfully) */}
              <div
                className={`absolute -left-12 bottom-2 z-30 transition-transform duration-700 ${
                  entrancePhase === "portal"
                    ? "opacity-0 translate-y-6 scale-50"
                    : "opacity-100 animate-bounce [animation-duration:2s]"
                }`}
              >
                <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-1 shadow-md shadow-indigo-500/40 border border-white/30 flex items-center justify-center rotate-[-15deg]">
                  <div className="h-4 w-4 rounded-xl bg-white/40" />
                </div>
              </div>

              {/* Right Cute Floating Hand */}
              <div
                className={`absolute -right-12 bottom-2 z-30 transition-transform duration-700 ${
                  entrancePhase === "portal"
                    ? "opacity-0 translate-y-6 scale-50"
                    : "opacity-100 animate-bounce [animation-duration:2.6s]"
                }`}
              >
                <div className="h-8 w-8 rounded-2xl bg-gradient-to-bl from-indigo-500 via-blue-600 to-cyan-400 p-1 shadow-md shadow-indigo-500/40 border border-white/30 flex items-center justify-center rotate-[15deg]">
                  <div className="h-4 w-4 rounded-xl bg-white/40" />
                </div>
              </div>

              {/* Robot Outer Shell (Glossy Pearlescent Indigo Helmet) */}
              <div className="relative w-52 h-44 rounded-[48px] bg-gradient-to-b from-indigo-600 via-indigo-900 to-slate-900 p-3 shadow-[0_10px_40px_rgba(79,70,229,0.45)] border-2 border-indigo-400/50 ring-4 ring-indigo-500/25 transition-transform duration-300 hover:scale-105">
                {/* Top Head Specular Highlight Curve */}
                <div className="absolute top-2 left-8 right-8 h-2 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[0.5px]" />

                {/* Robot Visor / Screen Face (Deep Neon Visor) */}
                <div className="relative w-full h-full rounded-[38px] bg-gradient-to-b from-[#060919] via-[#0b122e] to-[#070b1e] border border-cyan-400/35 p-4 flex flex-col items-center justify-between overflow-hidden shadow-inner">
                  {/* Visor Startup Scanline Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-scanline-sheen pointer-events-none" />

                  {/* Curved Glass Reflection Overlay */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.14] to-transparent rounded-t-[38px] pointer-events-none" />

                  {/* ------------------------------------------------------------- */}
                  {/* KAWAII EXPRESSIVE EYES WITH BLUSH CHEEKS                      */}
                  {/* ------------------------------------------------------------- */}
                  <div className="relative z-10 flex items-center justify-center gap-8 pt-2">
                    {/* Left Eye */}
                    <div className="relative flex flex-col items-center transition-all duration-300">
                      {entrancePhase === "portal" ? (
                        /* Closed Sleepy Curved Eye (-_-) */
                        <div className="h-1 w-7 rounded-full bg-cyan-400/50 shadow-sm" />
                      ) : isBlinking ? (
                        /* Blinking Line */
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 shadow-md shadow-cyan-400" />
                      ) : isBotTalking ? (
                        /* Happy Anime ^_^ Eye */
                        <div className="h-8 w-8 rounded-2xl bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-500 shadow-lg shadow-cyan-400/90 flex items-center justify-center transition-transform scale-110">
                          <span className="text-white font-black text-xs">^</span>
                        </div>
                      ) : (
                        /* Normal Wide Kawaii Anime Eye */
                        <div className="relative h-8 w-8 rounded-2xl bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-600 shadow-[0_0_18px_rgba(34,211,238,0.85)] flex items-center justify-center">
                          {/* Specular White Catchlights */}
                          <span className="absolute top-1 left-1.5 h-3 w-3 rounded-full bg-white shadow-sm" />
                          <span className="absolute bottom-1.5 right-2 h-1.5 w-1.5 rounded-full bg-white/80" />
                        </div>
                      )}
                      {/* Pink Blush Mark */}
                      <div
                        className={`mt-1.5 h-1.5 w-5 rounded-full bg-pink-400/70 blur-[1px] transition-opacity duration-700 ${
                          entrancePhase === "portal" ? "opacity-0" : "opacity-100 animate-pulse"
                        }`}
                      />
                    </div>

                    {/* Right Eye */}
                    <div className="relative flex flex-col items-center transition-all duration-300">
                      {entrancePhase === "portal" ? (
                        /* Closed Sleepy Curved Eye (-_-) */
                        <div className="h-1 w-7 rounded-full bg-cyan-400/50 shadow-sm" />
                      ) : isBlinking ? (
                        /* Blinking Line */
                        <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 shadow-md shadow-cyan-400" />
                      ) : isBotTalking ? (
                        /* Happy Anime ^_^ Eye */
                        <div className="h-8 w-8 rounded-2xl bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-500 shadow-lg shadow-cyan-400/90 flex items-center justify-center transition-transform scale-110">
                          <span className="text-white font-black text-xs">^</span>
                        </div>
                      ) : (
                        /* Normal Wide Kawaii Anime Eye */
                        <div className="relative h-8 w-8 rounded-2xl bg-gradient-to-b from-cyan-300 via-blue-400 to-indigo-600 shadow-[0_0_18px_rgba(34,211,238,0.85)] flex items-center justify-center">
                          {/* Specular White Catchlights */}
                          <span className="absolute top-1 left-1.5 h-3 w-3 rounded-full bg-white shadow-sm" />
                          <span className="absolute bottom-1.5 right-2 h-1.5 w-1.5 rounded-full bg-white/80" />
                        </div>
                      )}
                      {/* Pink Blush Mark */}
                      <div
                        className={`mt-1.5 h-1.5 w-5 rounded-full bg-pink-400/70 blur-[1px] transition-opacity duration-700 ${
                          entrancePhase === "portal" ? "opacity-0" : "opacity-100 animate-pulse"
                        }`}
                      />
                    </div>
                  </div>

                  {/* ------------------------------------------------------------- */}
                  {/* TALKING MOUTH / DANCING EQUALIZER PEARLS                      */}
                  {/* ------------------------------------------------------------- */}
                  <div className="relative z-10 flex items-center justify-center gap-1.5 h-6">
                    {entrancePhase === "portal" ? (
                      <div className="w-4 h-1 rounded-full bg-cyan-400/40" />
                    ) : isBotTalking ? (
                      <>
                        <span className="w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.4s] h-4 shadow-sm shadow-amber-400/70" />
                        <span className="w-1.5 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.2s] h-6 shadow-sm shadow-amber-300/80" />
                        <span className="w-2 bg-yellow-200 rounded-full animate-bounce [animation-delay:-0.5s] h-5 shadow-sm shadow-yellow-200/90" />
                        <span className="w-1.5 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.1s] h-7 shadow-sm shadow-amber-300/80" />
                        <span className="w-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3.5 shadow-sm shadow-amber-400/70" />
                      </>
                    ) : isUserTalking ? (
                      <>
                        <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s] h-4 shadow-sm shadow-emerald-400/80" />
                        <span className="w-2 bg-teal-300 rounded-full animate-bounce [animation-delay:-0.15s] h-6 shadow-sm shadow-teal-300/80" />
                        <span className="w-1.5 bg-emerald-400 rounded-full animate-bounce h-3 shadow-sm shadow-emerald-400/80" />
                      </>
                    ) : (
                      /* Kawaii Resting Cat Smile */
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-2 border-b-2 border-r-2 border-cyan-400 rounded-br-full shadow-sm shadow-cyan-400" />
                        <div className="w-3.5 h-2 border-b-2 border-l-2 border-cyan-400 rounded-bl-full shadow-sm shadow-cyan-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ROBOT CHEST BADGE WITH VYAPAR SATHI OFFICIAL MARK */}
              <div className="relative -mt-3.5 mx-auto flex items-center justify-center z-20">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-400 via-indigo-600 to-blue-500 p-[1.5px] shadow-lg shadow-indigo-500/40 ring-2 ring-white/20">
                  <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center p-1 overflow-hidden">
                    <img
                      src="/images/logo/vs_logo.png"
                      alt="Vyapar Sathi Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Hover Shadow beneath Robot */}
            <div className="w-36 h-3.5 mt-3 rounded-full bg-indigo-500/25 blur-md animate-pulse" />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* LIVE REALTIME TOOL STATUS BADGE (Redis / Pinecone / Inventory) */}
        {/* ------------------------------------------------------------- */}
        {activeToolStatus?.active && (
          <div className="mt-2.5 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-fade-in text-white text-xs font-bold z-20">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  activeToolStatus.completed ? "bg-emerald-400" : "bg-cyan-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  activeToolStatus.completed ? "bg-emerald-400" : "bg-cyan-400"
                }`}
              />
            </span>
            <span className={activeToolStatus.completed ? "text-emerald-300" : "text-cyan-200"}>
              {activeToolStatus.label}
            </span>
            {activeToolStatus.completed ? (
              <span className="text-[11px] text-emerald-400">✓ Done</span>
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-cyan-300 animate-spin" />
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* LIVE TRANSCRIPT SPEECH BUBBLE (Fades in smoothly)             */}
        {/* ------------------------------------------------------------- */}
        <div
          className={`mt-3 w-full max-w-sm px-3 transition-all duration-700 ${
            entrancePhase === "portal" || entrancePhase === "ascending"
              ? "opacity-0 translate-y-6"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="relative rounded-2xl bg-white/[0.06] border border-white/15 p-3 backdrop-blur-md text-center shadow-xl transition-all">
            {liveTranscript ? (
              <p className="text-xs sm:text-sm font-semibold text-cyan-100 italic leading-relaxed animate-fade-in">
                "{liveTranscript}"
              </p>
            ) : entrancePhase === "powering" ? (
              <p className="text-xs sm:text-sm font-semibold text-cyan-300 animate-pulse">
                "Connecting with Vyapar Sathi intelligence..."
              </p>
            ) : isBotTalking ? (
              <p className="text-xs sm:text-sm font-semibold text-amber-200 animate-pulse">
                "Hi! I'm awake and speaking with you... Ask me anything about your inventory or sales!"
              </p>
            ) : isUserTalking ? (
              <p className="text-xs sm:text-sm font-semibold text-emerald-300 animate-pulse">
                "Listening to your voice right now... Speak freely!"
              </p>
            ) : (
              <p className="text-xs text-indigo-200">
                Talk naturally with your Vyapar AI Buddy or tap any quick question below.
              </p>
            )}
          </div>
        </div>

        {/* Permission Error Banner if any */}
        {permissionError && (
          <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-500/40 px-3 py-2 text-xs text-red-200">
            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <span>{permissionError}</span>
          </div>
        )}

        {/* Quick Voice Suggestions Chips */}
        {onQuickPrompt && !liveTranscript && entrancePhase === "ready" && (
          <div className="mt-3 flex flex-wrap justify-center gap-2 max-w-xs animate-in fade-in duration-700">
            <button
              type="button"
              onClick={() => onQuickPrompt("What are my top selling items today?")}
              className="px-2.5 py-1 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-[11px] font-medium text-indigo-200 hover:text-white transition flex items-center gap-1 shadow-sm"
            >
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Top selling items?</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickPrompt("Which items are low in stock?")}
              className="px-2.5 py-1 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-[11px] font-medium text-indigo-200 hover:text-white transition flex items-center gap-1 shadow-sm"
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Low stock alerts?</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM AESTHETIC CALL CONTROLS BAR (Smoothly slides up)       */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`relative z-20 px-6 py-4 border-t border-white/[0.08] backdrop-blur-lg bg-black/40 flex items-center justify-around gap-4 transition-all duration-700 ${
          entrancePhase === "portal" || entrancePhase === "ascending"
            ? "opacity-0 translate-y-8"
            : "opacity-100 translate-y-0"
        }`}
      >
        {/* 1. Mute / Unmute Microphone Button */}
        <button
          type="button"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
          title={isRecording ? "Mute Microphone" : "Unmute Microphone"}
        >
          <div
            className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
              isRecording
                ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/40 ring-2 ring-emerald-400/50"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/10"
            }`}
          >
            {isRecording ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </div>
          <span className="text-[10px] font-semibold text-slate-300">
            {isRecording ? "Mic On" : "Muted"}
          </span>
        </button>

        {/* 2. End / Cut Call Button (Vibrant Glowing Crimson Button) */}
        <button
          type="button"
          onClick={onEndCall}
          className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
          title="Cut / End Call"
        >
          <div className="h-13 w-13 p-3 rounded-full bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 text-white shadow-xl shadow-rose-600/50 flex items-center justify-center hover:scale-105 hover:from-rose-500 hover:to-red-500 ring-4 ring-rose-500/30 transition-all">
            <PhoneOff className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-rose-300">End Call</span>
        </button>

        {/* 3. Speaker Audio Mute / Unmute Button */}
        <button
          type="button"
          onClick={onToggleMute}
          disabled={!isRecording}
          className="flex flex-col items-center gap-1 group transition-transform active:scale-95 disabled:opacity-40"
          title={isMuted ? "Unmute Speaker" : "Mute Speaker"}
        >
          <div
            className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
              !isMuted
                ? "bg-slate-800 text-indigo-300 hover:bg-slate-700 border border-white/10"
                : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
            }`}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </div>
          <span className="text-[10px] font-semibold text-slate-300">
            {isMuted ? "Audio Off" : "Speaker"}
          </span>
        </button>
      </div>
    </div>
  );
}
