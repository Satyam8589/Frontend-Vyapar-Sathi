import { apiGet, apiDelete } from "@/servies/api";
import { getSessionId, setSessionId, setChatId, getChatId } from "@/servies/api";

export const fetchForecast = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/forecast`);
  return response?.data || [];
};

export const fetchRestockPlan = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/restock`);
  return response?.data || [];
};

export const fetchInsights = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/insights`);
  return response?.data || [];
};

export const fetchSummary = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/summary`, { timeout: 45000 });
  return response?.data || null;
};

export const fetchProductInsight = async (storeId, productId) => {
  const response = await apiGet(`/ai/${storeId}/product/${productId}`);
  return response?.data || null;
};

// ---------------------------------------------------------------------------
// Chat history
// ---------------------------------------------------------------------------

export const fetchChatList = async (storeId) => {
  const response = await apiGet(`/ai/${storeId}/chats`);
  return response?.data || { chats: [], total: 0 };
};

export const fetchChatMessages = async (storeId, chatId) => {
  const response = await apiGet(`/ai/${storeId}/chats/${chatId}`);
  return response?.data || { chat_id: chatId, messages: [] };
};

export const deleteChat = async (storeId, chatId) => {
  const response = await apiDelete(`/ai/${storeId}/chats/${chatId}`);
  return response || { data: { deleted: false } };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const streamCopilotResponse = async ({
  storeId,
  message,
  chatId,
  onEvent,
  signal,
}) => {
  const token = localStorage.getItem("authToken");
  const sessionId = getSessionId();
  const effectiveChatId = chatId || getChatId();

  const response = await fetch(`${API_BASE_URL}/ai/${storeId}/copilot/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, session_id: sessionId, chat_id: effectiveChatId }),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this browser.");
  }

  const decoder = new TextDecoder("utf-8");
  const reader = response.body.getReader();
  let buffer = "";

  const parsePayload = (rawData) => {
    if (!rawData) return {};
    try {
      return JSON.parse(rawData);
    } catch {
      return { text: rawData };
    }
  };

  const parseEventBlock = (block) => {
    const lines = block.split("\n");
    let event = "message";
    const dataLines = [];

    for (const line of lines) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
    }

    const rawData = dataLines.join("\n");
    const payload = parsePayload(rawData);

    if (event === "session" && payload?.chatId) {
      setChatId(payload.chatId);
      // Also surface the generated title so the caller can refresh the
      // sidebar without a separate round-trip.
      onEvent?.({ event: "session", payload });
      return;
    }

    onEvent?.({ event, payload });
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (part.trim()) {
          parseEventBlock(part);
        }
      }
    }

    if (buffer.trim()) {
      parseEventBlock(buffer);
    }
  } finally {
    reader.releaseLock();
  }
};
