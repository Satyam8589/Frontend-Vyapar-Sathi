"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { streamCopilotResponse, fetchChatMessages } from "../../services/aiDashboardService";
import { clearSessionId, clearChatId } from "@/servies/api";
import { ChatMessage, ThinkingIndicator } from "../ChatMessage";
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
  File,
  Upload,
  X as XIcon,
  Camera,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  { text: "Which products should I restock first this week and why?", icon: "restock" },
  { text: "What is the highest stockout risk in the next 7 days?", icon: "forecast" },
  { text: "Which anomaly needs immediate action today?", icon: "anomaly" },
  { text: "Give me 3 actions to improve inventory health this week.", icon: "action" },
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

const AskCopilotSection = ({ storeId, chatId, onChatCreated, onTitleGenerated }) => {
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

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "end" });
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

  const appendAssistantText = useCallback((assistantId, textChunk) => {
    setMessages((prev) =>
      prev.map((entry) =>
        entry.id === assistantId
          ? { ...entry, text: `${entry.text}${textChunk || ""}` }
          : entry
      )
    );
  }, []);

  const updateAssistantMeta = useCallback((assistantId, payload) => {
    setMessages((prev) =>
      prev.map((entry) =>
        entry.id === assistantId
          ? {
              ...entry,
              meta: payload || null,
              streaming: false,
            }
          : entry
      )
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
        className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-slate-300 hover:shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="flex-shrink-0 p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{prompt.text}</span>
      </button>
    );
  };

  return (
    <section className="h-[600px] flex flex-col rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {!messages.length && !loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mx-auto">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white">
                  <Sparkles className="h-3.5 w-3.5 text-slate-600" />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-slate-800">Ask Vyapar Sathi</h2>
                <p className="text-slate-500 leading-relaxed">
                  Get instant insights on inventory, forecasts, restocking, and anomalies.
                  Your AI copilot analyzes real-time store data to help you make smarter decisions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <SuggestionChip key={prompt.text} prompt={prompt} icon={prompt.icon} disabled={loading} />
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Shift+Enter</kbd> for new line
              </p>
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
                {loading && messages.length > 0 && (
                  <div className="flex justify-center py-4" ref={messagesEndRef}>
                    <ThinkingIndicator />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-100 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            {messages.length > 0 && (
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
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm transition-all focus-within:border-slate-300 focus-within:shadow-md">
              <div className="flex items-end gap-2 p-2">
                <button
                  type="button"
                  onClick={() => setShowAttachmentModal(true)}
                  className="flex-shrink-0 h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition"
                  aria-label="Add attachment"
                >
                  <Plus className="h-5 w-5" />
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
                    className="flex-shrink-0 h-10 w-10 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition flex items-center justify-center"
                    aria-label="Stop generating"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!String(message).trim()}
                    onClick={() => askCopilot()}
                    className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-900 transition flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {showAttachmentModal && (
              <div
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
                onClick={closeAttachmentModal}
                role="dialog"
                aria-modal="true"
                aria-label="Add attachment"
              >
                <div
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                  onClick={closeAttachmentModal}
                />
                <div
                  ref={modalRef}
                  className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transform transition-all duration-200 ease-out"
                  style={{ opacity: 1, transform: "translateY(0)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-800">Add Attachment</h3>
                    <button
                      type="button"
                      onClick={closeAttachmentModal}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                      aria-label="Close"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleAttachmentSelect("file")}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-blue-100 text-blue-600">
                        <File className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttachmentSelect("image")}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-green-100 text-green-600">
                        <Image className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Upload Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttachmentSelect("camera")}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition"
                    >
                      <div className="flex-shrink-0 p-2 rounded-lg bg-purple-100 text-purple-600">
                        <Camera className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Take Photo</span>
                    </button>
                  </div>
                </div>
              </div>
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