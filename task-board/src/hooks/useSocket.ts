"use client";

import { useEffect, useRef, useCallback } from "react";
import { getSocket, disconnectSocket } from "@/lib/socket";
import type { Socket } from "socket.io-client";

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = getSocket(token);

    return () => {
      disconnectSocket();
      socketRef.current = null;
    };
  }, [token]);

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("join-conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("leave-conversation", conversationId);
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, message: { id: string; content: string; senderId: string; createdAt: string }) => {
      socketRef.current?.emit("send-message", { conversationId, message });
    },
    []
  );

  const onNewMessage = useCallback(
    (callback: (data: { conversationId: string; message: unknown }) => void) => {
      socketRef.current?.on("new-message", callback);
      return () => {
        socketRef.current?.off("new-message", callback);
      };
    },
    []
  );

  const emitTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("typing", { conversationId });
  }, []);

  const emitStopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit("stop-typing", { conversationId });
  }, []);

  const onUserTyping = useCallback(
    (callback: (data: { conversationId: string; userId: string }) => void) => {
      socketRef.current?.on("user-typing", callback);
      return () => {
        socketRef.current?.off("user-typing", callback);
      };
    },
    []
  );

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    sendMessage,
    onNewMessage,
    emitTyping,
    emitStopTyping,
    onUserTyping,
  };
}
