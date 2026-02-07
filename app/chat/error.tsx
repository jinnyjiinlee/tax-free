"use client";

import Link from "next/link";
import { MessageCircleOff } from "lucide-react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 noise-bg">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
          <MessageCircleOff className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">채팅을 불러올 수 없어요</h1>
        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
          일시적인 오류입니다. 다시 시도하거나 홈으로 돌아가 주세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="min-h-[44px] px-6 py-3 rounded-2xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="min-h-[44px] px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
