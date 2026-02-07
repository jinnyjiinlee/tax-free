"use client";

import { useState, useCallback } from "react";
import Header from "./components/Header";
import ChatWindow, { ChatMessage } from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSend = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: content,
          conversationId: conversationId ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "요청에 실패했습니다.");
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          err instanceof Error
            ? `오류가 발생했습니다: ${err.message}`
            : "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-lg">
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </main>
  );
}
