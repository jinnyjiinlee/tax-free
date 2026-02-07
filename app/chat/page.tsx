"use client";

import Link from "next/link";
import { getDefaultDiagnosisResult } from "@/app/utils/diagnosis";
import AIChatPanel from "@/app/components/AIChatPanel";
import TaxFreeCharacter from "@/app/components/TaxFreeCharacter";

export default function ChatPage() {
  const defaultResult = getDefaultDiagnosisResult();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/20 overflow-hidden noise-bg">
      <a href="#chat-main" className="skip-link">본문으로 건너뛰기</a>

      {/* 배경 장식 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-indigo-50/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-blue-50/30 rounded-full blur-[60px]" />
      </div>

      {/* 헤더 - 프리미엄 글래스 */}
      <header className="relative z-20 glass-premium border-b border-slate-200/40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 홈으로 돌아가기 */}
            <Link
              href="/"
              className="flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-all text-sm font-medium"
              aria-label="홈으로 돌아가기"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">홈</span>
            </Link>

            {/* 구분선 */}
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            {/* 로고 */}
            <div className="flex items-center gap-2">
              <TaxFreeCharacter size="sm" animate={false} className="!w-8 !h-8" />
              <div>
                <span className="font-semibold text-[#1d1d1f] tracking-tight text-sm">텍스프리</span>
                <span className="hidden sm:inline text-xs text-slate-400 ml-1.5">AI 세무 상담</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/diagnosis"
              className="flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 transition-all text-sm font-medium border border-slate-200 hover:border-slate-300"
              aria-label="세무 진단 페이지로 이동"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden sm:inline">세무 진단</span>
              <span className="sm:hidden">진단</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 채팅 영역 - 프리미엄 카드 */}
      <main id="chat-main" className="relative z-10 flex-1 max-w-4xl w-full mx-auto flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden glass-premium sm:my-4 sm:mx-4 sm:rounded-2xl sm:shadow-premium-lg">
          <AIChatPanel diagnosisResult={defaultResult} fullHeight />
        </div>
      </main>
    </div>
  );
}
