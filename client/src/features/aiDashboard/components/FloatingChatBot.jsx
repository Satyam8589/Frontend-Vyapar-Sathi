"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStorePageContext } from "@/features/store/context/storePageContext";
import AskCopilotSection from "./sections/AskCopilotSection";
import ChatHistorySidebar from "./ChatHistorySidebar";
import { getChatId, setChatId } from "@/servies/api";
import { Bot, Sparkles, X } from "lucide-react";

export default function FloatingChatBot() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const {
    copilotOpen: isOpen,
    setCopilotOpen: setIsOpen,
    copilotWidth = 480,
    setCopilotWidth,
    isDraggingCopilot,
    setIsDraggingCopilot,
  } = useStorePageContext();

  // Extract storeId from URL pathname: /storeDashboard/[storeId]/...
  const storeId = useMemo(() => {
    const match = pathname?.match(/\/storeDashboard\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const [chatKey, setChatKey] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
  const [showTooltipHint, setShowTooltipHint] = useState(true);

  useEffect(() => {
    setChatKey(getChatId());
  }, []);

  // Auto-hide tooltip hint after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltipHint(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Handle Drag Resizing on the left border of the chat drawer
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setIsDraggingCopilot(true);
  }, [setIsDraggingCopilot]);

  useEffect(() => {
    if (!isDraggingCopilot) return;

    const handleMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const newWidth = window.innerWidth - clientX;
      const minWidth = 360;
      const maxWidth = Math.min(1100, Math.floor(window.innerWidth * 0.8));
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setCopilotWidth(newWidth);
      }
    };

    const handleEnd = () => {
      setIsDraggingCopilot(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDraggingCopilot, setCopilotWidth, setIsDraggingCopilot]);

  const handleChatSelect = (chat) => {
    if (!chat) {
      setChatKey(null);
      return;
    }
    setChatId(chat.chat_id);
    setChatKey(chat.chat_id);
    setSidebarOpen(false);
  };

  const handleChatDeleted = () => {
    setChatKey(null);
  };

  const handleChatCreated = () => {
    setSidebarRefreshKey((k) => k + 1);
  };

  const handleTitleGenerated = () => {
    setSidebarRefreshKey((k) => k + 1);
  };

  // Only render on store dashboard when authenticated
  if (!storeId || !isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* MOBILE BACKDROP OVERLAY (Only visible on small mobile screens) */}
      {/* ------------------------------------------------------------- */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 md:hidden bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ------------------------------------------------------------- */}
      {/* DOCKED SLIDING RIGHT SIDEBAR CHATBOT WITH ADJUSTABLE WIDTH    */}
      {/* ------------------------------------------------------------- */}
      <aside
        style={{
          "--copilot-width": `${copilotWidth}px`,
          width: "var(--copilot-width)",
        }}
        className={`fixed top-0 right-0 z-40 flex h-full w-full sm:w-[var(--copilot-width)] max-w-full flex-col bg-white shadow-2xl border-l border-slate-200 ${
          isDraggingCopilot
            ? "transition-none select-none cursor-col-resize"
            : "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        } ${isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"}`}
        role="complementary"
        aria-label="AI Copilot Assistant"
      >
        {/* LEFT DRAG RESIZE HANDLE */}
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onDoubleClick={() => setCopilotWidth(480)}
          className="hidden sm:flex absolute -left-2 top-0 bottom-0 w-4 cursor-col-resize z-50 items-center justify-center group hover:w-5 transition-all"
          title="Drag to adjust width (Double-click to reset)"
        >
          {/* Visual Grip Handle Indicator */}
          <div className="h-16 w-1 rounded-full bg-slate-300 group-hover:bg-indigo-500 group-hover:w-1.5 group-hover:h-24 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all duration-200 flex flex-col items-center justify-center gap-1">
            <span className="w-0.5 h-0.5 rounded-full bg-white opacity-0 group-hover:opacity-100" />
            <span className="w-0.5 h-0.5 rounded-full bg-white opacity-0 group-hover:opacity-100" />
            <span className="w-0.5 h-0.5 rounded-full bg-white opacity-0 group-hover:opacity-100" />
          </div>
        </div>
        <div className="relative h-full flex flex-col overflow-hidden">
          {/* Ask Copilot AI Chat Component */}
          <AskCopilotSection
            storeId={storeId}
            chatId={chatKey}
            className="h-full flex flex-col bg-white border-0 shadow-none overflow-hidden"
            onSession={(id) => {
              setChatId(id);
              setChatKey(id);
            }}
            onChatCreated={handleChatCreated}
            onTitleGenerated={handleTitleGenerated}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            onClose={() => setIsOpen(false)}
          />

          {/* History Sidebar */}
          <ChatHistorySidebar
            storeId={storeId}
            onChatSelect={handleChatSelect}
            onChatDeleted={handleChatDeleted}
            refreshKey={sidebarRefreshKey}
            key={storeId}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING ACTION TRIGGER BUTTON (BOTTOM RIGHT CORNER)          */}
      {/* ------------------------------------------------------------- */}
      <div
        className={`fixed bottom-6 right-6 z-30 flex items-center gap-3 transition-all duration-300 ${
          isOpen
            ? "opacity-0 scale-75 pointer-events-none translate-x-8"
            : "opacity-100 scale-100 pointer-events-auto translate-x-0"
        }`}
      >
        {/* Contextual Welcoming Tooltip */}
        {showTooltipHint && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-full text-xs font-medium shadow-xl border border-white/10 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Need retail help? Ask Vyapar AI</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltipHint(false);
              }}
              className="text-slate-400 hover:text-white ml-1 transition"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Circular Floating Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setShowTooltipHint(false);
          }}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 ring-4 ring-blue-500/25 transition-all duration-300"
          aria-label="Open Vyapar AI Copilot"
          title="Open Vyapar AI Copilot"
        >
          {/* Ambient Glowing Radar Effect */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 opacity-40 blur-md group-hover:opacity-75 transition duration-500 animate-pulse -z-10" />

          {/* Bot Icon with Sparkles */}
          <div className="relative flex items-center justify-center">
            <Bot size={26} className="text-white drop-shadow-sm transition-transform group-hover:scale-110" />
            <Sparkles
              size={12}
              className="absolute -top-1 -right-1.5 text-amber-300 animate-bounce"
            />
          </div>

          {/* Active Status Live Badge */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
          </span>
        </button>
      </div>
    </>
  );
}
