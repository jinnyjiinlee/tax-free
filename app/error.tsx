"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fafafa]">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">문제가 발생했어요</h1>
        <p className="text-slate-600 text-sm mb-6">
          일시적인 오류입니다. 새로고침하시면 해결될 수 있어요.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
