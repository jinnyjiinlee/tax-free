"use client";

import { useEffect, useRef } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export default function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-slate-50">
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <p className="text-lg font-semibold text-[#1d1d1f] mb-2">무엇이든 물어보세요</p>
          <p className="text-sm text-[#6e6e73] font-normal">
            종합소득세, 부가가치세, 사업자등록 등<br />
            개인사업자 세무 상담을 도와드립니다.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-md"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-200">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
