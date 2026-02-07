"use client";

import TaxFreeCharacter from "./TaxFreeCharacter";

export default function Header() {
  return (
    <header className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#1d1d1f] text-white shadow-md">
      <TaxFreeCharacter size="sm" animate={false} />
      <h1 className="text-xl font-semibold tracking-tight">텍스프리</h1>
      <span className="text-sm text-[#86868b] hidden sm:inline font-normal">
        개인사업자들의 세금을 책임집니다
      </span>
    </header>
  );
}
