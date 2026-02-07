import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-slate-200 mb-4">404</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있어요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="min-h-[44px] px-6 py-3 rounded-2xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors inline-flex items-center justify-center"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/diagnosis"
            className="min-h-[44px] px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors inline-flex items-center justify-center"
          >
            세무 진단 시작
          </Link>
        </div>
      </div>
    </div>
  );
}
