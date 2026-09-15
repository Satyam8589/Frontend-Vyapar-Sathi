"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { streamCopilotResponse, fetchChatMessages } from "../../services/aiDashboardService";
import { clearSessionId, clearChatId } from "@/servies/api";
import { ChatMessage, ThinkingIndicator } from "../ChatMessage";
import AttachmentModal from "../AttachmentModal";
import {
  Send,
  X,
  Plus,
  Loader2,
  Sparkles,
  MessageSquare,
  Trash2,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Image,
  Paperclip,
  Settings,
  HelpCircle,
  Package,
  TrendingUp,
  AlertTriangle,
  Zap,
  Bot,
  User,
  Search,
  Database,
  Globe,
  Cpu,
  Wifi,
  Shield,
  Clock,
  DollarSign,
  Box,
  Truck,
  ShoppingCart,
  Heart,
  Star,
  Bell,
  Calendar,
  RefreshCw,
  Play,
  Pause,
  Square,
  Terminal,
  Code,
  Brain,
  Wand2,
  FileText,
  Lightbulb,
  CheckCircle2,
  Info,
  ArrowRight,
  XCircle,
  BarChart2,
  Upload,
  Camera,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  {
    text: "Which products should I restock first this week and why?",
    icon: "restock",
    label: "Restock",
    gradient: "from-rose-500 to-orange-500",
    bg: "bg-rose-50",
    hoverBg: "group-hover:bg-rose-100",
    iconColor: "text-rose-600",
    ring: "group-hover:ring-rose-200",
  },
  {
    text: "What is the highest stockout risk in the next 7 days?",
    icon: "forecast",
    label: "Forecast",
    gradient: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-50",
    hoverBg: "group-hover:bg-indigo-100",
    iconColor: "text-indigo-600",
    ring: "group-hover:ring-indigo-200",
  },
  {
    text: "Which anomaly needs immediate action today?",
    icon: "anomaly",
    label: "Alert",
    gradient: "from-amber-400 to-yellow-500",
    bg: "bg-amber-50",
    hoverBg: "group-hover:bg-amber-100",
    iconColor: "text-amber-600",
    ring: "group-hover:ring-amber-200",
  },
  {
    text: "Give me 3 actions to improve inventory health this week.",
    icon: "action",
    label: "Actions",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    hoverBg: "group-hover:bg-emerald-100",
    iconColor: "text-emerald-600",
    ring: "group-hover:ring-emerald-200",
  },
];

const ICON_COMPONENTS = {
  restock: Package,
  forecast: TrendingUp,
  anomaly: AlertTriangle,
  action: Zap,
};

const TOOL_ICONS = {
  get_inventory_summary: Database,
  get_low_stock_products: AlertTriangle,
  get_sales_summary: BarChart2,
  get_top_selling_products: TrendingUp,
  get_restock_priorities: Package,
  get_forecast_summary: TrendingUp,
  get_store_insights: Lightbulb,
};

const AskCopilotSection = ({ storeId, chatId, onChatCreated, onTitleGenerated, onToggleSidebar }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const abortRef = useRef(null);
  const textareaRef = useRef(null);
  const endRef = useRef(null);
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  // Accumulate the LLM's reasoning trace (tool calls + results) for the
  // current assistant message so the user can see *why* the answer was
  // produced, not just the answer itself.
  const toolCallsRef = useRef([]);

  const appendAssistantText = useCallback((assistantId, textChunk) => {
    setMessages((prev) =>
      prev.map((entry) =>
        entry.id === assistantId
          ? { ...entry, text: `${entry.text}${textChunk || ""}` }
          : entry
      )
    );
  }, []);

  const upsertToolCall = useCallback((assistantId, toolCall) => {
    setMessages((prev) =>
      prev.map((entry) => {
        if (entry.id !== assistantId) return entry;
        const calls = entry.meta?.tool_calls || [];
        const idx = calls.findIndex((c) => c.id === toolCall.id);
        const next = idx >= 0
          ? [...calls.slice(0, idx), toolCall, ...calls.slice(idx + 1)]
          : [...calls, toolCall];
        return { ...entry, meta: { ...entry.meta, tool_calls: next } };
      })
    );
   }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    if (!chatId || !storeId) {
      setMessages([]);
      setShowSuggestions(true);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setShowSuggestions(false);

    fetchChatMessages(storeId, chatId)
      .then((data) => {
        if (!isMounted) return;
        const msgs = (data?.messages || []).map((m, i) => ({
          id: `${m.role}-${i}-${Date.now()}`,
          role: m.role,
          text: m.content,
          timestamp: m.timestamp,
          streaming: false,
          meta: m.meta || null,
          error: "",
        }));
        setMessages(msgs);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || "Failed to load chat history");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [chatId, storeId]);

  const updateAssistantMeta = useCallback((assistantId, payload) => {
    setMessages((prev) =>
      prev.map((entry) => {
        if (entry.id !== assistantId) return entry;
        // Preserve the accumulated tool-call reasoning trace when the
        // backend sends a final meta payload — don't let it wipe it out.
        const existing = entry.meta?.tool_calls || [];
        return {
          ...entry,
          meta: { ...(payload || {}), tool_calls: existing },
          streaming: false,
        };
      })
    );
  }, []);

  const updateAssistantError = useCallback((assistantId, errorMessage) => {
    setMessages((prev) =>
      prev.map((entry) =>
        entry.id === assistantId
          ? {
              ...entry,
              text: entry.text || "Copilot could not complete this response.",
              error: errorMessage || "Copilot stream failed.",
              streaming: false,
            }
          : entry
      )
    );
  }, []);

  const resetTextareaHeight = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
  }, []);

  const autoGrowTextarea = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
  }, []);

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
  }, []);

  const newChat = useCallback(() => {
    stopStreaming();
    clearSessionId();
    clearChatId();
    setMessages([]);
    setError("");
    setMessage("");
    setShowSuggestions(true);
    resetTextareaHeight();
  }, [stopStreaming, resetTextareaHeight]);

  const askCopilot = useCallback(
    async (promptText) => {
      const question = String(promptText || message).trim();
      if (!question || !storeId) {
        return;
      }

      setError("");
      setLoading(true);
      setShowSuggestions(false);
      toolCallsRef.current = [];

      const userId = `user-${Date.now()}`;
      const assistantId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", text: question, timestamp: Date.now() },
        {
          id: assistantId,
          role: "assistant",
          text: "",
          streaming: true,
          meta: null,
          error: "",
          timestamp: Date.now() + 1,
        },
      ]);

      setMessage("");
      resetTextareaHeight();

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamCopilotResponse({
          storeId,
          message: question,
          chatId,
          signal: controller.signal,
          onEvent: ({ event, payload }) => {
            if (event === "token") {
              appendAssistantText(assistantId, payload?.text || "");
              return;
            }

            if (event === "tool_call") {
              // The backend streams the LLM's reasoning trace: which tool
              // it decided to call, with what arguments, and what the
              // tool returned. Surface this so the user can see *why*
              // the answer was produced, not just the answer itself.
              if (payload?.id) {
                upsertToolCall(assistantId, payload);
              }
              return;
            }

            if (event === "session") {
              // Backend created a new chat (or returned an existing one)
              // along with a freshly generated title. Let the parent
              // refresh the sidebar so the meaningful title replaces the
              // "New Chat" placeholder.
              if (payload?.chatId) {
                onChatCreated?.();
                if (payload?.title) {
                  onTitleGenerated?.(payload.chatId, payload.title);
                }
              }
              return;
            }

            if (event === "done") {
              updateAssistantMeta(assistantId, payload || null);
              setLoading(false);
              abortRef.current = null;
              return;
            }

            if (event === "error") {
              const errorMessage = payload?.message || "Copilot stream failed.";
              setError(errorMessage);
              updateAssistantError(assistantId, errorMessage);
              setLoading(false);
              abortRef.current = null;
            }
          },
        });
      } catch (streamError) {
        const errorMessage = streamError?.message || "Unable to stream copilot response.";
        setError(errorMessage);
        updateAssistantError(assistantId, errorMessage);
        setLoading(false);
        abortRef.current = null;
      }
    },
    [message, storeId, chatId, appendAssistantText, updateAssistantMeta, updateAssistantError, resetTextareaHeight]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey && !isComposing) {
        event.preventDefault();
        if (!loading) {
          askCopilot();
        }
      }
    },
    [loading, askCopilot, isComposing]
  );

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    if (e.nativeEvent.data) {
      setMessage((prev) => prev + e.nativeEvent.data);
      autoGrowTextarea();
    }
  };

  const handleCopy = useCallback((messageId) => {
    const msg = messages.find((m) => m.id === messageId);
    if (msg?.text) {
      navigator.clipboard.writeText(msg.text);
    }
  }, [messages]);

  const handleRegenerate = useCallback((messageId) => {
    const msgIndex = messages.findIndex((m) => m.id === messageId);
    if (msgIndex > 0) {
      const userMsg = messages[msgIndex - 1];
      if (userMsg?.role === "user") {
        setMessages((prev) => prev.slice(0, msgIndex));
        askCopilot(userMsg.text);
      }
    }
  }, [messages, askCopilot]);

  const handleFeedback = useCallback((messageId, feedback) => {
    console.log("Feedback:", messageId, feedback);
  }, []);

  const handleAttachmentSelect = useCallback((action) => {
    setShowAttachmentModal(false);
    // Handle different attachment types
    if (action === "file") {
      // Trigger file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.doc,.docx,.txt,.csv,.xlsx";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // Handle file upload
          console.log("File selected:", file.name);
          // You can add file upload logic here
        }
      };
      input.click();
    } else if (action === "image") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          console.log("Image selected:", file.name);
          // Handle image upload logic here
        }
      };
      input.click();
    } else if (action === "camera") {
      // Camera functionality would go here
      console.log("Camera action triggered");
    }
  }, []);

  const closeAttachmentModal = useCallback(() => {
    setShowAttachmentModal(false);
  }, []);

  const SuggestionChip = ({ prompt, icon, disabled }) => {
    const Icon = ICON_COMPONENTS[icon] || MessageSquare;
    return (
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => askCopilot(prompt.text)}
        className="group relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-transparent disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div
          className={`flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${prompt.gradient} text-white shadow-sm transition-all ${prompt.ring} ring-1 ring-transparent`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {prompt.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 truncate">
            {prompt.text}
          </p>
        </div>
        <svg
          className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  };

  return (
    <section className="h-[750px] flex flex-col rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">Vyapar Sathi</h2>
              <p className="text-[10px] text-slate-400 leading-tight">AI Copilot</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
<button
            type="button"
            onClick={newChat}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-slate-700 hover:to-slate-800 hover:shadow transition"
            title="New Chat"
          >
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-indigo-400 hover:to-purple-500 hover:shadow transition"
            title="Chat History"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {!messages.length && !loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 flex items-center justify-center mx-auto shadow-lg shadow-slate-300">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-700 bg-clip-text text-transparent">
                    Ask Vyapar Sathi
                  </span>
                </h2>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-md">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <SuggestionChip key={prompt.text} prompt={prompt} icon={prompt.icon} disabled={loading} />
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Enter</kbd>
                <span>to send</span>
                <span className="text-slate-300">·</span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Shift+Enter</kbd>
                <span>for new line</span>
              </div>
            </div>
          ) : (
            <>
              <div className="flex w-full flex-col gap-6 py-4">
                {messages.map((entry) => (
                  <ChatMessage
                    key={entry.id}
                    message={entry}
                    isStreaming={entry.streaming}
                    onCopy={handleCopy}
                    onRegenerate={handleRegenerate}
                    onFeedback={handleFeedback}
                  />
                ))}
                {/* {loading && messages.length > 0 && (
                  // <div className="flex justify-center py-4" ref={messagesEndRef}>
                  //   <ThinkingIndicator />
                  // </div>
                )} */}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-100 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            {/* {messages.length > 0 && (
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  {messages.filter((m) => m.role === "user").length} messages in this chat
                </span>
                <button
                  type="button"
                  onClick={newChat}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  New Chat
                </button>
              </div>
            )} */}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm transition-all focus-within:border-indigo-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-100">
              <div className="flex items-end gap-2 p-2">
                <button
                  type="button"
                  onClick={() => setShowAttachmentModal(true)}
                  className="group flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm hover:from-cyan-400 hover:to-blue-500 hover:shadow-md transition flex items-center justify-center"
                  aria-label="Add attachment"
                  title="Add attachment"
                >
                  <Paperclip className="h-5 w-5 transition-transform group-hover:rotate-12" />
                </button>

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
                  placeholder="Ask Copilot anything about your inventory..."
                  className="min-h-[44px] max-h-[240px] flex-1 resize-none border-0 bg-transparent px-2 py-3 text-left text-base text-slate-800 outline-none placeholder:text-slate-400"
                  disabled={loading}
                />

                {loading ? (
                  <button
                    type="button"
                    onClick={stopStreaming}
                    className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm hover:from-rose-400 hover:to-red-500 hover:shadow-md transition flex items-center justify-center"
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
                    className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-sm hover:from-slate-700 hover:to-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:from-slate-800 disabled:hover:to-slate-900 hover:shadow-md transition flex items-center justify-center"
                    aria-label="Send message"
                    title="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {showAttachmentModal && (
              <AttachmentModal
                onClose={closeAttachmentModal}
                onSelect={handleAttachmentSelect}
              />
            )}

            {error && (
              <p className="mt-3 text-sm font-medium text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            )}

            <p className="mt-3 text-xs text-slate-400 text-center">
              AI responses may contain errors. Verify critical decisions independently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskCopilotSection;