"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import { Search, Send, Loader2 } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";

type Conversation = {
  id: string;
  taskTitle: string;
  taskId: string;
  otherUser: { id: string; name: string | null; avatarUrl: string | null };
  lastMessage: { content: string; createdAt: string; senderId: string } | null;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string | null; avatarUrl: string | null };
};

const AVATAR_COLORS = ["#D89575", "#A8C4E0", "#E0C4A8", "#C4E0A8", "#C4A8E0", "#E0A8C4"];
function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket.io - 使用 session token（簡化：這裡用 session user id 當 placeholder）
  const { joinConversation, leaveConversation, sendMessage: socketSend, onNewMessage } = useSocket(
    session?.user?.id || null
  );

  // 載入對話列表
  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setConversations(data);
          if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
        }
      })
      .finally(() => setLoadingConvos(false));
  }, []);

  // 載入對話訊息
  useEffect(() => {
    if (!selectedId) return;
    setLoadingMsgs(true);
    fetch(`/api/conversations/${selectedId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .finally(() => setLoadingMsgs(false));
  }, [selectedId]);

  // 加入/離開 Socket 房間
  useEffect(() => {
    if (!selectedId) return;
    joinConversation(selectedId);
    return () => leaveConversation(selectedId);
  }, [selectedId, joinConversation, leaveConversation]);

  // 接收即時訊息
  useEffect(() => {
    const cleanup = onNewMessage((data: { conversationId: string; message: unknown }) => {
      if (data.conversationId === selectedId) {
        setMessages((prev) => [...prev, data.message as Message]);
      }
      // 更新對話列表的最新訊息
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId
            ? { ...c, lastMessage: { content: (data.message as Message).content, createdAt: (data.message as Message).createdAt, senderId: (data.message as Message).senderId } }
            : c
        )
      );
    });
    return cleanup;
  }, [selectedId, onNewMessage]);

  // 自動捲動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !selectedId || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch(`/api/conversations/${selectedId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const msg = await res.json();
        setMessages((prev) => [...prev, msg]);
        // 透過 Socket 廣播
        socketSend(selectedId, msg);
        // 更新對話列表
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? { ...c, lastMessage: { content: msg.content, createdAt: msg.createdAt, senderId: msg.senderId } }
              : c
          )
        );
      }
    } finally {
      setSending(false);
    }
  }, [newMessage, selectedId, sending, socketSend]);

  const selectedConvo = conversations.find((c) => c.id === selectedId);
  const filteredConvos = searchQuery
    ? conversations.filter(
        (c) =>
          c.otherUser.name?.includes(searchQuery) || c.taskTitle.includes(searchQuery)
      )
    : conversations;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-[360px] bg-white border-r border-[#E5E4E1] flex flex-col ${selectedId ? "hidden md:flex" : "flex"}`}>
          <div className="px-5 py-4 border-b border-[#E5E4E1]">
            <h2 className="text-lg font-semibold tracking-tight">訊息</h2>
          </div>
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 bg-[#EDECEA] rounded-xl px-4 py-2.5">
              <Search size={16} className="text-[#9C9B99]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋對話"
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-[#9C9B99]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-[#9C9B99]" size={24} />
              </div>
            ) : filteredConvos.length === 0 ? (
              <p className="text-center text-[#9C9B99] text-sm py-10">沒有對話</p>
            ) : (
              filteredConvos.map((convo) => {
                const color = getAvatarColor(convo.otherUser.id);
                return (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedId(convo.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
                      selectedId === convo.id
                        ? "bg-[#C8F0D8]"
                        : "hover:bg-[#FAFAF8] border-b border-[#E5E4E1]"
                    }`}
                  >
                    {convo.otherUser.avatarUrl ? (
                      <img src={convo.otherUser.avatarUrl} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`text-[15px] ${selectedId === convo.id ? "font-semibold" : "font-medium"}`}>
                          {convo.otherUser.name || "未命名"}
                        </span>
                        {convo.lastMessage && (
                          <span className="text-xs text-[#9C9B99]">
                            {new Date(convo.lastMessage.createdAt).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#3D8A5A] font-medium">{convo.taskTitle}</p>
                      {convo.lastMessage && (
                        <p className="text-[13px] text-[#6D6C6A] truncate">{convo.lastMessage.content}</p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#F5F4F1] ${!selectedId ? "hidden md:flex" : "flex"}`}>
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-[#E5E4E1] px-4 sm:px-6 py-4 flex items-center gap-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="md:hidden text-[#6D6C6A] mr-1"
                >
                  &larr;
                </button>
                {selectedConvo.otherUser.avatarUrl ? (
                  <img src={selectedConvo.otherUser.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full" style={{ backgroundColor: getAvatarColor(selectedConvo.otherUser.id) }} />
                )}
                <div>
                  <p className="text-[15px] font-semibold">{selectedConvo.otherUser.name || "未命名"}</p>
                  <p className="text-[13px] text-[#6D6C6A]">{selectedConvo.taskTitle}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMsgs ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-[#9C9B99]" size={24} />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-[#9C9B99] text-sm py-10">開始對話吧！</p>
                ) : (
                  messages.map((msg) =>
                    msg.senderId === session?.user?.id ? (
                      <div key={msg.id} className="flex justify-end">
                        <div className="bg-[#3D8A5A] text-white px-4 py-2.5 rounded-[16px_16px_4px_16px] max-w-md">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div key={msg.id} className="flex items-end gap-2">
                        {selectedConvo.otherUser.avatarUrl ? (
                          <img src={selectedConvo.otherUser.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full shrink-0" style={{ backgroundColor: getAvatarColor(selectedConvo.otherUser.id) }} />
                        )}
                        <div className="bg-white px-4 py-2.5 rounded-[16px_16px_16px_4px] shadow-[0_1px_4px_rgba(26,25,24,0.03)] max-w-md">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    )
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t border-[#E5E4E1] px-6 py-4 flex items-center gap-3">
                <div className="flex-1 bg-[#EDECEA] rounded-full px-4 py-2.5">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="輸入訊息..."
                    className="w-full bg-transparent outline-none text-sm placeholder:text-[#9C9B99]"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || sending}
                  className="w-10 h-10 bg-[#3D8A5A] rounded-full flex items-center justify-center hover:bg-[#357A4E] transition-colors disabled:opacity-50"
                >
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#9C9B99]">
              選擇一個對話開始聊天
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
