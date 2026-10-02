"use client";

import { useState, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import AskCopilotSection from "./sections/AskCopilotSection";
import ChatHistorySidebar from "./ChatHistorySidebar";
import { getChatId, setChatId } from "@/servies/api";
import { Bot, Sparkles, X } from "lucide-react";

export default function FloatingChatBot() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Extract storeId from URL pathname: /storeDashboard/[storeId]/...
  const storeId = useMemo(() => {
    const match = pathname?.match(/\/storeDashboard\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const [isOpen, setIsOpen] = useState(false);
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
  }, [isOpen]);

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
      {/* FLOATING ACTION BUTTON (BOTTOM RIGHT CORNER)                  */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Contextual Welcoming Tooltip */}
        {!isOpen && showTooltipHint && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-full text-xs font-medium shadow-xl border border-white/10 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Need retail help? Ask Vyapar AI</span>
            <button
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
            setIsOpen((prev) => !prev);
            setShowTooltipHint(false);
          }}
          className={`relative group flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 active:scale-95 ${
            isOpen
              ? "w-14 h-14 bg-slate-800 hover:bg-slate-900 text-white ring-4 ring-slate-400/20"
              : "w-14 h-14 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 ring-4 ring-blue-500/25"
          }`}
          aria-label={isOpen ? "Close AI Copilot" : "Open AI Copilot"}
          title={isOpen ? "Close Chatbot" : "Open Vyapar AI Copilot"}
        >
          {/* Ambient Glowing Radar Effect (Only when closed) */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 opacity-40 blur-md group-hover:opacity-75 transition duration-500 animate-pulse -z-10" />
          )}

          {/* Morphing Icon */}
          <div
            className={`transform transition-transform duration-300 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {isOpen ? (
              <X size={24} className="stroke-[2.5]" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Bot size={26} className="text-white drop-shadow-sm" />
                <Sparkles
                  size={12}
                  className="absolute -top-1 -right-1.5 text-amber-300 animate-bounce"
                />
              </div>
            )}
          </div>

          {/* Active Status Live Badge */}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BACKDROP OVERLAY                                              */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          aria-hidden="true"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* SLIDE-OVER CHATBOT DRAWER (FROM RIGHT SIDE)                   */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full sm:w-[480px] md:w-[540px] lg:w-[600px] max-w-full flex-col bg-white shadow-2xl border-l border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
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
    </>
  );
}
