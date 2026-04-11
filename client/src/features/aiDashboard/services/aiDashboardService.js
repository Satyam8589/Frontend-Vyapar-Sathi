import { apiGet } from "@/servies/api";

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const streamCopilotResponse = async ({
  storeId,
  message,
  onEvent,
  signal,
}) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/ai/${storeId}/copilot/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
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
    let payload = {};
    if (rawData) {
      try {
        payload = JSON.parse(rawData);
      } catch {
        payload = { text: rawData };
      }
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
