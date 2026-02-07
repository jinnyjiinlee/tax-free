"use client";

export default function Header() {
  return (
    <header className="flex items-center justify-center gap-2 px-4 py-4 bg-slate-800 text-white shadow-md">
      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-lg font-bold">
        T
      </div>
      <h1 className="text-xl font-bold tracking-tight">세무 Free</h1>
      <span className="text-sm text-slate-300 hidden sm:inline">
        프리랜서 · 소규모 사업자 세무 상담
      </span>
    </header>
  );
}
