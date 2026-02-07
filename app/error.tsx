"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">문제가 발생했어요</h1>
        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
          일시적인 오류입니다. 다시 시도하시거나 홈으로 돌아가 주세요.
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
