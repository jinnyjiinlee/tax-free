"use client";

import Link from "next/link";
import { getDefaultDiagnosisResult } from "@/app/utils/diagnosis";
import AIChatPanel from "@/app/components/AIChatPanel";
import TaxFreeCharacter from "@/app/components/TaxFreeCharacter";

export default function ChatPage() {
  const defaultResult = getDefaultDiagnosisResult();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 overflow-hidden">
      <a href="#chat-main" className="skip-link">본문으로 건너뛰기</a>
      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-100/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-blue-100/30 rounded-full blur-2xl" />
      </div>

      {/* 헤더 */}
      <header className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-blue-100/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-h-[44px] items-center text-[#1d1d1f] hover:opacity-80 transition-opacity"
            aria-label="홈으로 돌아가기"
          >
            <TaxFreeCharacter size="sm" animate={false} className="!w-9 !h-9" />
            <div>
              <span className="font-semibold text-[#1d1d1f] tracking-tight">텍스프리</span>
              <span className="hidden sm:inline text-xs text-[#86868b] ml-2">AI 세무 상담</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/diagnosis"
              className="flex items-center gap-1.5 min-h-[44px] items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
              aria-label="세무 진단 페이지로 이동"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="hidden sm:inline">세무 진단</span>
              <span className="sm:hidden">진단</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 채팅 영역 */}
      <main id="chat-main" className="relative z-10 flex-1 max-w-4xl w-full mx-auto flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden bg-white/80 backdrop-blur-sm sm:my-4 sm:mx-4 sm:rounded-2xl sm:border sm:border-slate-200/60 sm:shadow-xl sm:shadow-slate-200/30">
          <AIChatPanel diagnosisResult={defaultResult} fullHeight />
        </div>
      </main>
    </div>
  );
}
