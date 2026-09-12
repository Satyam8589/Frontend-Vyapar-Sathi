"use client";

import { useState } from "react";
import EmptyState from "./sections/EmptyState";
import AskCopilotSection from "./sections/AskCopilotSection";
import ChatHistorySidebar from "./ChatHistorySidebar";
import ForecastSection from "./sections/ForecastSection";
import InsightsSection from "./sections/InsightsSection";
import RestockSection from "./sections/RestockSection";
import SummarySection from "./sections/SummarySection";
import { getChatId, setChatId } from "@/servies/api";

const AIDashboardContent = ({
  forecast = [],
  restock = [],
  insights = [],
  summary = null,
  storeId,
  loadingState = {},
  errorState = {},
}) => {
  const allLoading =
    loadingState.forecast && loadingState.restock && loadingState.insights;

  if (allLoading) {
    return (
      <EmptyState
        title="Loading AI dashboard"
        description="Generating forecasts, restock guidance, and inventory insights."
      />
    );
  }

  const primaryFailed =
    !loadingState.forecast &&
    !loadingState.restock &&
    !loadingState.insights &&
    errorState.forecast &&
    errorState.restock &&
    errorState.insights;

  if (primaryFailed) {
    return (
      <EmptyState
        title="AI dashboard unavailable"
        description="Forecast, restock, and insight services are currently unavailable."
      />
    );
  }

  const [chatKey, setChatKey] = useState(getChatId());

  const handleChatSelect = (chat) => {
    if (!chat) {
      setChatKey(null);
      return;
    }
    setChatId(chat.chat_id);
    setChatKey(chat.chat_id);
  };

  const handleChatDeleted = () => {
    setChatKey(null);
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <div className="lg:w-72 lg:shrink-0">
        <ChatHistorySidebar
          storeId={storeId}
          onChatSelect={handleChatSelect}
          onChatDeleted={handleChatDeleted}
        />
      </div>

      <div className="min-w-0 flex-1 space-y-8">
        <AskCopilotSection
          storeId={storeId}
          chatId={chatKey}
          key={chatKey || "new-chat"}
        />

        <SummarySection
          storeId={storeId}
          summary={summary}
          loading={loadingState.summary}
          error={errorState.summary}
        />

        <ForecastSection
          forecast={forecast}
          loading={loadingState.forecast}
          error={errorState.forecast}
        />

        <RestockSection
          restock={restock}
          loading={loadingState.restock}
          error={errorState.restock}
        />

        <InsightsSection
          insights={insights}
          loading={loadingState.insights}
          error={errorState.insights}
        />
      </div>
    </div>
  );
};

export default AIDashboardContent;
