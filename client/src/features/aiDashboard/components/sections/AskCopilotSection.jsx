"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { streamCopilotResponse, fetchChatMessages, streamClarifyResponse } from "../../services/aiDashboardService";
import { clearSessionId, clearChatId, setChatId } from "@/servies/api";
import { ChatMessage, ThinkingIndicator } from "../ChatMessage";
import AttachmentModal from "../AttachmentModal";
import ClarificationBanner from "../ClarificationBanner";
import CartoonVoiceBotView from "../CartoonVoiceBotView";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
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
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Radio,
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

const AskCopilotSection = ({
  storeId,
  chatId,
  onChatCreated,
  onTitleGenerated,
  onToggleSidebar,
  onSession,
  className = "h-[700px] flex flex-col rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden",
  onClose,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [clarification, setClarification] = useState({
    isOpen: false,
    question: "",
    chatId: null,
    threadId: null,
    isSubmitting: false,
  });

  // Voice Assistant states
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveSpeechTranscript, setLiveSpeechTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceAutoSpeak, setVoiceAutoSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const accumulatedTextRef = useRef("");
  const abortRef = useRef(null);
  const textareaRef = useRef(null);
  const endRef = useRef(null);
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  // Live call synchronization refs
  const isLiveCallActiveRef = useRef(false);
  const liveUserMsgIdRef = useRef(null);
  const liveAiMsgIdRef = useRef(null);
  const liveSilenceTimerRef = useRef(null);

  useEffect(() => {
    isLiveCallActiveRef.current = isLiveCallActive;
  }, [isLiveCallActive]);

  // Live assistant text streaming handler from WebSocket
  const handleVoiceAiText = useCallback((chunk) => {
    if (!chunk) return;
    setLiveSpeechTranscript(chunk);
    setShowSuggestions(false);
    const aiId = liveAiMsgIdRef.current || `assistant-voice-${Date.now()}`;
    liveAiMsgIdRef.current = aiId;
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === aiId);
      if (exists) {
        return prev.map((m) =>
          m.id === aiId ? { ...m, text: `${m.text || ""}${chunk}` } : m
        );
      }
      return [
        ...prev,
        {
          id: aiId,
          role: "assistant",
          text: chunk,
          timestamp: Date.now(),
          streaming: true,
          meta: null,
          error: "",
        },
      ];
    });
  }, []);

  // Live user speech transcript handler from WebSocket (if server provides it)
  const handleVoiceUserTranscript = useCallback((userText) => {
    if (!userText) return;
    setLiveSpeechTranscript(userText);
    setShowSuggestions(false);
    const userId = liveUserMsgIdRef.current || `user-voice-${Date.now()}`;
    liveUserMsgIdRef.current = userId;
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === userId);
      if (exists) {
        return prev.map((m) =>
          m.id === userId ? { ...m, text: userText } : m
        );
      }
      return [
        ...prev,
        {
          id: userId,
          role: "user",
          text: userText,
          timestamp: Date.now(),
        },
      ];
    });
  }, []);

  // Turn completion handler from WebSocket
  const handleVoiceTurnComplete = useCallback(() => {
    if (liveAiMsgIdRef.current) {
      const currentId = liveAiMsgIdRef.current;
      setMessages((prev) =>
        prev.map((m) => (m.id === currentId ? { ...m, streaming: false } : m))
      );
      liveAiMsgIdRef.current = null;
    }
    if (liveUserMsgIdRef.current) {
      liveUserMsgIdRef.current = null;
    }
  }, []);

  // Accumulate the LLM's reasoning trace (tool calls + results) for the
  // current assistant message so the user can see *why* the answer was
  // produced, not just the answer itself.
  const toolCallsRef = useRef([]);

  // Gemini Live duplex voice WebSocket
  const {
    isConnected: isVoiceWsConnected,
    isReady: isVoiceWsReady,
    isRecording: isVoiceWsRecording,
    isMuted: isVoiceWsMuted,
    permissionError: voiceWsPermissionError,
    connect: connectVoiceWs,
    disconnect: disconnectVoiceWs,
    startRecording: startVoiceWsRecording,
    stopRecording: stopVoiceWsRecording,
    toggleMute: toggleVoiceWsMute,
  } = useVoiceAssistant(user?.uid, storeId, {
    onAiText: handleVoiceAiText,
    onAiTranscript: handleVoiceAiText,
    onUserTranscript: handleVoiceUserTranscript,
    onTurnComplete: handleVoiceTurnComplete,
  });

  const handleEndLiveCall = useCallback(() => {
    setIsLiveCallActive(false);
    isLiveCallActiveRef.current = false;
    disconnectVoiceWs();

    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }

    if (liveSilenceTimerRef.current) {
      clearTimeout(liveSilenceTimerRef.current);
      liveSilenceTimerRef.current = null;
    }

    // Ensure any open in-flight assistant or user message during call is cleanly finalized
    if (liveAiMsgIdRef.current) {
      const aiId = liveAiMsgIdRef.current;
      setMessages((prev) =>
        prev.map((m) => (m.id === aiId ? { ...m, streaming: false } : m))
      );
      liveAiMsgIdRef.current = null;
    }
    liveUserMsgIdRef.current = null;
    setLiveSpeechTranscript("");
  }, [disconnectVoiceWs, isListening]);

  const handleToggleLiveCall = useCallback(() => {
    if (isLiveCallActive || isVoiceWsConnected) {
      handleEndLiveCall();
    } else {
      setIsLiveCallActive(true);
      isLiveCallActiveRef.current = true;
      setShowSuggestions(false);
      connectVoiceWs();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.warn("Could not start speech recognition on call open:", e);
        }
      }
    }
  }, [isLiveCallActive, isVoiceWsConnected, handleEndLiveCall, connectVoiceWs]);

  // Synchronize ref for AI speech status to prevent microphone echo loop
  const isSpeakingRef = useRef(false);
  const isRestartingRef = useRef(false);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Setup browser speech recognition for real-time user voice input in both Live Call & normal chat
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event) => {
          // If the AI is currently speaking out loud, ignore mic input to avoid echo loops
          if (isSpeakingRef.current) {
            return;
          }

          let latestFinal = "";
          let latestInterim = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0]?.transcript || "";
            if (event.results[i].isFinal) {
              latestFinal += transcript;
            } else {
              latestInterim += transcript;
            }
          }

          const activeText = (latestFinal || latestInterim).trim();
          if (!activeText) return;

          setLiveSpeechTranscript(activeText);

          if (isLiveCallActiveRef.current) {
            setShowSuggestions(false);

            if (latestFinal.trim()) {
              const finalText = latestFinal.trim();
              const activeUserId = liveUserMsgIdRef.current || `user-voice-${Date.now()}`;
              setMessages((prev) => {
                const exists = prev.some((m) => m.id === activeUserId);
                if (exists) {
                  return prev.map((m) =>
                    m.id === activeUserId ? { ...m, text: finalText } : m
                  );
                }
                return [
                  ...prev,
                  {
                    id: activeUserId,
                    role: "user",
                    text: finalText,
                    timestamp: Date.now(),
                  },
                ];
              });
              // Utterance finalized: reset live user message ID so next spoken phrase starts a new clean turn
              liveUserMsgIdRef.current = null;
            } else if (latestInterim.trim()) {
              const interimText = latestInterim.trim();
              const activeUserId = liveUserMsgIdRef.current || `user-voice-${Date.now()}`;
              liveUserMsgIdRef.current = activeUserId;

              setMessages((prev) => {
                const exists = prev.some((m) => m.id === activeUserId);
                if (exists) {
                  return prev.map((m) =>
                    m.id === activeUserId ? { ...m, text: interimText } : m
                  );
                }
                return [
                  ...prev,
                  {
                    id: activeUserId,
                    role: "user",
                    text: interimText,
                    timestamp: Date.now(),
                  },
                ];
              });
            }

            // User pause / silence timer as fallback to finalize turn
            if (liveSilenceTimerRef.current) {
              clearTimeout(liveSilenceTimerRef.current);
            }
            liveSilenceTimerRef.current = setTimeout(() => {
              if (liveUserMsgIdRef.current) {
                liveUserMsgIdRef.current = null;
              }
            }, 1800);
          } else {
            // NORMAL CHAT MODE: put into message input box
            setMessage(activeText);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                240
              )}px`;
            }
          }
        };

        recognition.onerror = (event) => {
          // Benign browser speech events: 'no-speech', 'aborted', 'network'
          if (event.error === "no-speech" || event.error === "aborted") {
            return;
          }
          if (event.error === "network") {
            // Handled gracefully without breaking UI
            setIsListening(false);
            return;
          }
          console.warn("Speech recognition notice:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          // If in live call mode, restart with a gentle throttle to avoid network collision
          if (isLiveCallActiveRef.current && !isRestartingRef.current) {
            isRestartingRef.current = true;
            setTimeout(() => {
              isRestartingRef.current = false;
              if (isLiveCallActiveRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                  setIsListening(true);
                } catch (_) {
                  setIsListening(false);
                }
              }
            }, 500);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setLiveSpeechTranscript("");
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [isListening]);

  const speakText = useCallback(
    (text) => {
      if (typeof window === "undefined" || !window.speechSynthesis || !voiceAutoSpeak) return;
      try {
        window.speechSynthesis.cancel();
        const cleanText = String(text || "")
          .replace(/[*_#`~>-]/g, " ")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/<[^>]*>/g, "")
          .trim();
        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("TTS error:", e);
      }
    },
    [voiceAutoSpeak]
  );

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
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
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
    setClarification((prev) => ({ ...prev, isOpen: false }));
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
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
      accumulatedTextRef.current = "";
      stopListening();

      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

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
              const chunk = payload?.text || "";
              accumulatedTextRef.current += chunk;
              appendAssistantText(assistantId, chunk);
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
              if (accumulatedTextRef.current) {
                speakText(accumulatedTextRef.current);
              }
              return;
            }

            if (event === "error") {
              const errorMessage = payload?.message || "Copilot stream failed.";
              setError(errorMessage);
              updateAssistantError(assistantId, errorMessage);
              setLoading(false);
              abortRef.current = null;
            }

            if (event === "clarification") {
              if (payload?.chatId) {
                onSession?.(payload.chatId);
              }
              setLoading(false);
              abortRef.current = null;
              setClarification({
                isOpen: true,
                question: payload?.question || "I need more information to help you.",
                chatId: payload?.chatId || chatId,
                threadId: payload?.threadId || null,
                isSubmitting: false,
              });
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
    [message, storeId, chatId, appendAssistantText, updateAssistantMeta, updateAssistantError, resetTextareaHeight, onSession, speakText, stopListening]
  );

  const handleClarificationSubmit = useCallback(
    async (answer) => {
      if (!answer || !storeId || !chatId) return;

      setClarification((prev) => ({ ...prev, isSubmitting: true }));
      accumulatedTextRef.current = "";

      const userId = `user-${Date.now()}`;
      const assistantId = `assistant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setMessages((prev) => [
        ...prev,
        {
          id: userId,
          role: "user",
          text: answer,
          timestamp: Date.now(),
        },
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

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamClarifyResponse({
          storeId,
          chatId,
          answer,
          signal: controller.signal,
          onEvent: ({ event, payload }) => {
            if (event === "token") {
              const chunk = payload?.text || "";
              accumulatedTextRef.current += chunk;
              appendAssistantText(assistantId, chunk);
              return;
            }
            if (event === "tool_call") {
              if (payload?.id) {
                upsertToolCall(assistantId, payload);
              }
              return;
            }
            if (event === "session") {
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
              setClarification((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
              if (accumulatedTextRef.current) {
                speakText(accumulatedTextRef.current);
              }
              return;
            }
            if (event === "error") {
              const errorMessage = payload?.message || "Clarify stream failed.";
              setError(errorMessage);
              updateAssistantError(assistantId, errorMessage);
              setLoading(false);
              abortRef.current = null;
              setClarification((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
              return;
            }
            if (event === "clarification") {
              updateAssistantMeta(assistantId, payload || null);
              setLoading(false);
              abortRef.current = null;
              setClarification({
                isOpen: true,
                question: payload?.question || "I need more information to help you.",
                chatId: payload?.chatId || chatId,
                threadId: payload?.threadId || null,
                isSubmitting: false,
              });
              return;
            }
          },
        });
      } catch (streamError) {
        const errorMessage = streamError?.message || "Unable to stream clarification response.";
        setError(errorMessage);
        setLoading(false);
        abortRef.current = null;
        setClarification((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
      }
    },
    [storeId, chatId, appendAssistantText, updateAssistantMeta, upsertToolCall, onChatCreated, onTitleGenerated, updateAssistantError, speakText]
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
    <section className={className}>
      <div className="flex h-full flex-col">
        {/* ------------------------------------------------------------------ */}
        {/* CONDITIONAL BODY: LIVE CALL CARTOON BOT (BLUE HEADER ONLY)         */}
        {/* VS STANDARD CHAT VIEW (WHITE HEADER + CHAT MESSAGES + INPUT BAR)   */}
        {/* ------------------------------------------------------------------ */}
        {isLiveCallActive || isVoiceWsConnected ? (
          /* FULL SCREEN INTERACTIVE CARTOON TALKING BOT WITH ITS OWN BLUE HEADER */
          <div className="flex-1 min-h-0 flex flex-col">
            <CartoonVoiceBotView
              isConnected={isVoiceWsConnected}
              isReady={isVoiceWsReady}
              isRecording={isVoiceWsRecording}
              isMuted={isVoiceWsMuted}
              permissionError={voiceWsPermissionError}
              onStartRecording={startVoiceWsRecording}
              onStopRecording={stopVoiceWsRecording}
              onToggleMute={toggleVoiceWsMute}
              onEndCall={handleEndLiveCall}
              liveTranscript={liveSpeechTranscript}
              isAISpeaking={isSpeaking}
              onClose={onClose}
              voiceAutoSpeak={voiceAutoSpeak}
              onToggleVoiceAutoSpeak={() => setVoiceAutoSpeak((prev) => !prev)}
              onQuickPrompt={(promptText) => {
                handleEndLiveCall();
                setTimeout(() => askCopilot(promptText), 200);
              }}
            />
          </div>
        ) : (
          /* STANDARD CHAT VIEW (WHITE HEADER + MESSAGES + INPUT BAR) */
          <>
            {/* TOP WHITE HEADER (ONLY SHOWN IN NORMAL CHAT MODE) */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <div className="relative h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-[1.5px] shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20">
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
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">Vyapar Sathi</h2>
                  <p className="text-[10px] font-semibold text-indigo-600 leading-tight flex items-center gap-1">
                    <span>AI Copilot</span>
                    <span className="h-1 w-1 rounded-full bg-indigo-500" />
                    <span className="text-emerald-600 font-medium">Online</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Voice auto-speak toggle */}
                <button
                  type="button"
                  onClick={() => setVoiceAutoSpeak((prev) => !prev)}
                  className={`group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm transition ${
                    voiceAutoSpeak
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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

                {/* Live Duplex Voice Call */}
                <button
                  type="button"
                  onClick={handleToggleLiveCall}
                  className="group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold shadow-sm transition bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 hover:shadow"
                  title="Start Live Interactive Voice Call"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Live Call</span>
                </button>

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

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {!messages.length && !loading ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
                  <div className="relative mx-auto">
                    <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-1 shadow-xl shadow-indigo-500/30 ring-4 ring-indigo-500/20 flex items-center justify-center">
                      <div className="h-full w-full rounded-[20px] bg-white flex items-center justify-center p-2 overflow-hidden">
                        <img
                          src="/images/logo/vs_logo.png"
                          alt="Vyapar Sathi Logo"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-white shadow-md">
                      <Sparkles className="h-4 w-4 text-white animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-3xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-slate-800 via-indigo-900 to-blue-700 bg-clip-text text-transparent">
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
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-slate-100 bg-white/80 backdrop-blur-sm p-1">
              <div className="max-w-4xl mx-auto">
                {clarification.isOpen && (
                  <ClarificationBanner
                    question={clarification.question}
                    isSubmitting={clarification.isSubmitting}
                    onSubmit={handleClarificationSubmit}
                    onDismiss={() => setClarification((prev) => ({ ...prev, isOpen: false }))}
                  />
                )}

                {/* LIVE USER SPEECH TRANSCRIPT BANNER */}
                {isListening && (
                  <div className="mb-2 flex items-center justify-between gap-3 px-3.5 py-2.5 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-blue-500/15 border border-indigo-200/90 rounded-2xl backdrop-blur-sm shadow-sm animate-pulse">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                      </div>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-xs font-bold text-indigo-950 flex-shrink-0">Listening:</span>
                        <p className="text-xs font-semibold text-indigo-800 truncate">
                          {liveSpeechTranscript ? `"${liveSpeechTranscript}"` : "Speak now, words will appear live..."}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={stopListening}
                      className="text-[11px] font-bold px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-sm transition flex-shrink-0"
                    >
                      Finish
                    </button>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm transition-all focus-within:border-indigo-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-100">
                  <div className="flex items-end gap-2 p-1 mx-1">
                    <button
                      type="button"
                      onClick={() => setShowAttachmentModal(true)}
                      className="group flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm hover:from-cyan-400 hover:to-blue-500 hover:shadow-md transition flex items-center justify-center"
                      aria-label="Add attachment"
                      title="Add attachment"
                    >
                      <Paperclip className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    </button>

                    {/* Speech to text microphone button */}
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        className={`group flex-shrink-0 h-10 w-10 rounded-xl text-white shadow-sm hover:shadow-md transition flex items-center justify-center ${
                          isListening
                            ? "bg-gradient-to-br from-rose-500 to-red-600 animate-pulse ring-2 ring-red-400/50"
                            : "bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
                        }`}
                        aria-label={isListening ? "Stop listening" : "Start speech input"}
                        title={isListening ? "Stop voice listening" : "Speak to AI (Voice to text)"}
                      >
                        {isListening ? (
                          <MicOff className="h-5 w-5 animate-bounce" />
                        ) : (
                          <Mic className="h-5 w-5 transition-transform group-hover:scale-110" />
                        )}
                      </button>
                    )}

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
                          : "Ask Copilot anything or click mic to speak..."
                      }
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
          </>
        )}
      </div>
    </section>
  );
};

export default AskCopilotSection;