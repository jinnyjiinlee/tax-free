"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DiagnosisResult } from "@/app/types/diagnosis";
import TaxFreeCharacter from "./TaxFreeCharacter";
import { IconDocument, IconReceipt, IconCurrency, IconBuilding } from "./Icons";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "like" | "dislike" | null;
  isError?: boolean;
}

interface AIChatPanelProps {
  diagnosisResult: DiagnosisResult;
  fullHeight?: boolean;
}

const QUESTION_CATEGORIES = [
  {
    icon: IconDocument,
    label: "종합소득세",
    questions: [
      "종합소득세 신고 방법 알려주세요",
      "경비처리 가능한 항목이 뭐가 있나요?",
    ],
  },
  {
    icon: IconReceipt,
    label: "부가가치세",
    questions: [
      "간이과세와 일반과세 차이가 뭐예요?",
      "부가가치세 신고 기한이 언제예요?",
    ],
  },
  {
    icon: IconCurrency,
    label: "절세 전략",
    questions: [
      "세금 줄이는 방법 알려주세요",
      "사업용 신용카드 혜택이 있나요?",
    ],
  },
  {
    icon: IconBuilding,
    label: "사업자등록",
    questions: [
      "사업자등록 절차가 어떻게 되나요?",
      "프리랜서도 사업자등록 해야 하나요?",
    ],
  },
];

export default function AIChatPanel({
  diagnosisResult,
  fullHeight,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [toast, setToast] = useState<{ type: "copy" | "newChat"; visible: boolean }>({ type: "copy", visible: false });
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null); // 재시도용
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollDown(!isNearBottom && messages.length > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [messages.length]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const showToast = (type: "copy" | "newChat") => {
    setToast({ type, visible: true });
    setTimeout(() => setToast({ type, visible: false }), 2000);
  };

  const handleCopy = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    showToast("copy");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (messageId: string, type: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, feedback: msg.feedback === type ? null : type }
          : msg
      )
    );
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleNewChat = () => {
    if (isStreaming) handleStop();
    setMessages([]);
    setInput("");
    setLastUserMessage(null);
    showToast("newChat");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleRetry = () => {
    if (lastUserMessage) {
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSend(lastUserMessage);
    }
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLastUserMessage(content);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const chatHistory = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          messages: chatHistory,
          diagnosisResult,
        }),
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error("응답 생성 실패");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantMessage.content += parsed.content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { ...assistantMessage };
                    return updated;
                  });
                }
              } catch {
                // ignore
              }
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex flex-col ${fullHeight ? "h-[calc(100vh-12rem)]" : "h-[600px]"}`}
      role="region"
      aria-label="AI 세무 상담 채팅"
    >
      {/* 토스트 */}
      {toast.visible && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium shadow-lg animate-fade-in"
          role="status"
        >
          {toast.type === "copy" ? "복사되었습니다" : "새 대화가 시작되었습니다"}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto chat-scroll px-4 py-6 space-y-5 relative"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="animate-welcome-pop mb-4">
              <TaxFreeCharacter size="md" />
            </div>
            <div className="animate-welcome-pop [animation-delay:0.15s] opacity-0 text-center mb-8">
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-1">
                안녕하세요! 텍스프리입니다
              </h3>
              <p className="text-sm text-[#6e6e73] font-normal">
                개인사업자 세무 고민, 무엇이든 물어보세요
              </p>
            </div>

            <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
              {QUESTION_CATEGORIES.map((cat, catIdx) => {
                const CatIcon = cat.icon;
                return (
                  <div
                    key={cat.label}
                    className="animate-welcome-pop opacity-0 space-y-2"
                    style={{ animationDelay: `${0.2 + catIdx * 0.08}s` }}
                  >
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[#6e6e73]">
                        <CatIcon />
                      </span>
                      <span className="text-xs font-medium text-[#86868b] uppercase tracking-wider">
                        {cat.label}
                      </span>
                    </div>
                    {cat.questions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        disabled={isLoading}
                        className="w-full text-left px-4 py-3 min-h-[44px] bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl text-sm text-[#424245] hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white/80 disabled:hover:border-blue-100"
                        aria-label={`예시 질문: ${q}`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"} ${
              msg.role === "user"
                ? "animate-message-in-right"
                : "animate-message-in-left"
            }`}
            role="article"
            aria-label={msg.role === "user" ? "사용자 메시지" : "AI 답변"}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Image
                    src="/character.png"
                    alt="텍스프리"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[78%]`}
            >
              <div
                className={`rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-600 text-white rounded-br-md shadow-lg shadow-blue-500/20"
                    : msg.isError
                    ? "bg-red-50 text-slate-800 border border-red-100 rounded-bl-md"
                    : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div
                    className={`markdown-body ${isStreaming && idx === messages.length - 1 ? "typing-cursor" : ""}`}
                  >
                    {msg.isError ? (
                      <div className="space-y-3">
                        <p className="text-sm">{msg.content}</p>
                        <button
                          onClick={handleRetry}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          다시 시도
                        </button>
                      </div>
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || " "}
                      </ReactMarkdown>
                    )}
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                )}
              </div>

              <div
                className={`flex items-center gap-1.5 mt-1.5 px-1 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <span className="text-[11px] text-[#86868b]">
                  {formatTime(msg.timestamp)}
                </span>

                {msg.role === "assistant" &&
                  msg.content &&
                  !msg.isError &&
                  !(isStreaming && idx === messages.length - 1) && (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleFeedback(msg.id, "like")}
                        className={`p-1.5 min-w-[32px] min-h-[32px] rounded-md transition-all duration-200 ${
                          msg.feedback === "like"
                            ? "text-blue-600 bg-blue-50"
                            : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
                        }`}
                        title="도움이 됐어요"
                        aria-label="도움이 됐어요"
                      >
                        <svg className="w-3.5 h-3.5" fill={msg.feedback === "like" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                          {msg.feedback !== "like" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />}
                        </svg>
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, "dislike")}
                        className={`p-1.5 min-w-[32px] min-h-[32px] rounded-md transition-all duration-200 ${
                          msg.feedback === "dislike"
                            ? "text-red-500 bg-red-50"
                            : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
                        }`}
                        title="아쉬워요"
                        aria-label="아쉬워요"
                      >
                        <svg className="w-3.5 h-3.5" fill={msg.feedback === "dislike" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
                          {msg.feedback !== "dislike" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />}
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className={`p-1.5 min-w-[32px] min-h-[32px] rounded-md transition-all duration-200 ${
                          copiedId === msg.id
                            ? "text-emerald-500 bg-emerald-50"
                            : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
                        }`}
                        title="복사하기"
                        aria-label="복사하기"
                      >
                        {copiedId === msg.id ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-2.5 justify-start animate-message-in-left" role="status" aria-live="polite" aria-label="AI가 답변을 작성하고 있습니다">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                <Image
                  src="/character.png"
                  alt="텍스프리"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                </div>
                <span className="text-xs text-[#86868b]">답변을 작성하고 있어요</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {showScrollDown && (
          <button
            onClick={() => scrollToBottom()}
            className="sticky bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 shadow-lg text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 hover:shadow-xl animate-fade-in min-h-[44px]"
            aria-label="맨 아래로 스크롤"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs font-medium">새 메시지</span>
          </button>
        )}
      </div>

      <div className="border-t border-slate-100 bg-white/80 backdrop-blur-sm px-4 py-3">
        {isStreaming && (
          <div className="flex justify-center mb-2">
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-2 min-h-[36px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
              aria-label="응답 중단"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              응답 중단
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 chat-input-glow rounded-2xl border border-slate-200 bg-white px-3 py-2 transition-all duration-200 focus-within:border-blue-300">
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="flex-shrink-0 w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              title="새 대화 시작"
              aria-label="새 대화 시작"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder={isLoading ? "답변을 기다리는 중..." : "예: 경비처리 어떻게 하나요? (Enter로 전송)"}
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none disabled:opacity-50 max-h-[120px] py-2 min-h-[44px]"
            aria-label="메시지 입력"
          />

          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:bg-blue-700 hover:shadow-md hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-sm"
            aria-label="전송"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>

        <p className="text-center text-[11px] text-[#86868b] mt-2 font-normal">
          AI가 제공하는 정보는 참고용이며, 정확한 세무 상담은 전문가에게 문의하세요 · Enter로 전송
        </p>
      </div>
    </div>
  );
}
