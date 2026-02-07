"use client";

import Link from "next/link";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">채팅을 불러올 수 없어요</h1>
        <p className="text-slate-600 text-sm mb-6">
          일시적인 오류입니다. 다시 시도하거나 홈으로 돌아가 주세요.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
