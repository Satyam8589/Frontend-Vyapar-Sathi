"use client";

import { useEffect, useRef, useState } from "react";
import { streamCopilotResponse } from "../../services/aiDashboardService";

const SUGGESTED_PROMPTS = [
  "Which products should I restock first this week and why?",
  "What is the highest stockout risk in the next 7 days?",
  "Which anomaly needs immediate action today?",
  "Give me 3 actions to improve inventory health this week.",
];

const AskCopilotSection = ({ storeId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);
  const textareaRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  const appendAssistantText = (assistantId, textChunk) => {
    setMessages((prev) =>
      prev.map((entry) =>
        entry.id === assistantId
          ? { ...entry, text: `${entry.text}${textChunk || ""}` }
          : entry
      )
    );
  };

  const updateAssistantMeta = (assistantId, payload) => {
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
  };

  const updateAssistantError = (assistantId, errorMessage) => {
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
  };

  const resetTextareaHeight = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
  };

  const autoGrowTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
  };

  const stopStreaming = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
  };

  const askCopilot = async (promptText) => {
    const question = String(promptText || message).trim();
    if (!question || !storeId) {
      return;
    }

    setError("");
    setLoading(true);

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
        signal: controller.signal,
        onEvent: ({ event, payload }) => {
          if (event === "token") {
            appendAssistantText(assistantId, payload?.text || "");
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
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!loading) {
        askCopilot();
      }
    }
  };

  return (
    <section className="h-[700px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-1">
          {!messages.length ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-3xl font-semibold tracking-tight text-slate-800">
                Ask anything about your store inventory.
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-6 py-2">
              {messages.map((entry) => (
                <article key={entry.id} className="w-full">
                  <div
                    className={
                      entry.role === "user"
                        ? "ml-auto flex w-fit max-w-[72%] justify-end"
                        : "max-w-[78%]"
                    }
                  >
                    <pre
                      className={
                        entry.role === "user"
                          ? "inline-block w-fit max-w-full whitespace-pre-wrap rounded-2xl bg-slate-900 px-4 py-3 font-sans text-sm leading-relaxed text-white text-right"
                          : "whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800"
                      }
                    >
                      {entry.text || "Thinking..."}
                    </pre>
                  </div>
                  {entry.error ? (
                    <p className="mt-1 text-xs font-semibold text-rose-600">{entry.error}</p>
                  ) : null}
                </article>
              ))}

              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="mt-4 w-30% min-w-[100px] self-center">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
            <div className="flex items-end gap-2">
              <button
                type="button"
                className="h-10 w-10 rounded-full border border-slate-200 bg-white text-lg font-semibold text-slate-500 cursor-pointer"
                disabled
                aria-label="More tools coming soon"
              >
                +
              </button>

              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  autoGrowTextarea();
                }}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask Copilot"
                className="min-h-[44px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-left text-sm text-slate-800 outline-none"
              />

              {loading ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="h-10 rounded-full border border-slate-300 px-4 text-sm font-semibold text-slate-700 cursor-pointer bg-white hover:bg-slate-100"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!String(message).trim()}
                  onClick={() => askCopilot()}
                  className="h-10 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                 Send
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={loading}
                onClick={() => {
                  askCopilot(prompt);
                }}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>

          {error ? <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p> : null}
        </div>
      </div>
    </section>
  );
};

export default AskCopilotSection;
