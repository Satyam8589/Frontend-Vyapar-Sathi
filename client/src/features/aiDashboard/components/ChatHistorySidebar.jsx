"use client";

import { useEffect, useState } from "react";
import { fetchChatList, deleteChat } from "../services/aiDashboardService";
import { getChatId, setChatId, clearChatId } from "@/servies/api";

const ChatHistorySidebar = ({ storeId, onChatSelect, onChatDeleted, refreshKey = 0 }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChatId, setActiveChatId] = useState(getChatId());

  const loadChats = async () => {
    if (!storeId) {
      setLoading(false);
      return;
    }
try {
      setLoading(true);
      setError("");
      const data = await fetchChatList(storeId);
      setChats(data.chats || []);
    } catch (err) {
      setError(err?.message || "Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId, refreshKey]);

  const handleSelectChat = (chat) => {
    setActiveChatId(chat.chat_id);
    setChatId(chat.chat_id);
    onChatSelect?.(chat);
  };

  const handleNewChat = () => {
    clearChatId();
    setActiveChatId(null);
    onChatSelect?.(null);
  };

  const handleDeleteChat = async (chat, e) => {
    e.stopPropagation();
    if (!confirm("Delete this chat? This action cannot be undone.")) return;
    try {
      await deleteChat(storeId, chat.chat_id);
      if (activeChatId === chat.chat_id) {
        clearChatId();
        setActiveChatId(null);
      }
      await loadChats();
      onChatDeleted?.();
    } catch (err) {
      setError(err?.message || "Failed to delete chat");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-slate-50/80 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={handleNewChat}
          className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading && (
          <div className="text-center text-xs text-slate-400 py-6">
            Loading chats...
          </div>
        )}

        {!loading && error && (
          <div className="text-xs text-rose-600 bg-rose-50 rounded-lg p-3">
            {error}
          </div>
        )}

        {!loading && !error && chats.length === 0 && (
          <div className="text-center text-xs text-slate-400 py-6">
            No chats yet. Start a conversation!
          </div>
        )}

        {!loading &&
          chats.map((chat) => (
            <div
              key={chat.chat_id}
              onClick={() => handleSelectChat(chat)}
              className={`group relative rounded-xl p-3 cursor-pointer transition ${
                activeChatId === chat.chat_id
                  ? "bg-white shadow-sm border border-slate-200"
                  : "hover:bg-slate-100"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {chat.title || "New Chat"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDate(chat.updated_at)} · {chat.message_count} msgs
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition p-1"
                  title="Delete chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default ChatHistorySidebar;