"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DiagnosisResult, DiagnosisAnswers } from "@/app/types/diagnosis";
import { calculateDiagnosisResult } from "@/app/utils/diagnosis";
import { MonthlyTaxChart, TaxCompositionChart, TaxComparisonChart } from "@/app/components/TaxCharts";
import TaxKnowledgeAccordion from "@/app/components/TaxKnowledgeAccordion";
import AIChatPanel from "@/app/components/AIChatPanel";
import TaxCalendar from "@/app/components/TaxCalendar";

const INDUSTRY_LABELS: Record<string, string> = {
  "food-store": "음식점/카페",
  retail: "소매/쇼핑몰",
  service: "서비스업",
  freelancer: "프리랜서",
  education: "학원/교육",
  other: "기타",
};

export default function DashboardPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge" | "calendar">("chat");

  // URL 해시로 탭 상태 유지 (예: /dashboard#knowledge)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const valid = ["chat", "knowledge", "calendar"] as const;
    if (valid.includes(hash as typeof valid[number])) {
      setActiveTab(hash as typeof valid[number]);
    }
  }, []);

  const handleTabChange = (tab: "chat" | "knowledge" | "calendar") => {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
  };

  const tabs: ("chat" | "knowledge" | "calendar")[] = ["chat", "knowledge", "calendar"];
  const tabLabels = { chat: "AI 상담", knowledge: "기초지식", calendar: "세무 캘린더" };
  const tabIcons = {
    chat: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    knowledge: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    calendar: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, current: "chat" | "knowledge" | "calendar") => {
    const currentIdx = tabs.indexOf(current);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tabs[(currentIdx + 1) % tabs.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(tabs[(currentIdx - 1 + tabs.length) % tabs.length]);
    }
  };

  useEffect(() => {
    const stored =
      sessionStorage.getItem("diagnosisAnswers") ||
      localStorage.getItem("diagnosisAnswers");
    if (!stored) {
      router.push("/");
      return;
    }

    try {
      const answers = JSON.parse(stored) as DiagnosisAnswers;
      const diagnosisResult = calculateDiagnosisResult(answers);
      setResult(diagnosisResult);
    } catch (error) {
      console.error("Failed to parse diagnosis answers:", error);
      router.push("/");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] noise-bg" role="status" aria-live="polite" aria-label="대시보드 로딩 중">
        <div className="w-full max-w-2xl space-y-6 p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-200 animate-pulse" />
            <div className="h-8 flex-1 bg-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;
  const monthlyAvg = Math.floor(total / 12);
  const savingsEstimate = Math.floor(total * 0.15);

  const taxItems = [
    {
      label: "종합소득세",
      desc: "소득에 대한 세금",
      value: result.estimatedIncomeTax,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
      ring: "ring-blue-100",
      iconPath: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      label: "부가가치세",
      desc: "매출에 대한 세금",
      value: result.estimatedVAT,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      text: "text-violet-600",
      ring: "ring-violet-100",
      iconPath: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      label: "4대보험",
      desc: "사업주 부담분",
      value: result.estimatedInsurance,
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      ring: "ring-emerald-100",
      iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
  ];

  const taxTypeLabel = result.taxType === "simplified" ? "간이과세자" : result.taxType === "exempt" ? "면세사업자" : "일반과세자";
  const taxTypeBadgeClass = result.taxType === "simplified"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60"
    : result.taxType === "exempt"
    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60"
    : "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60";

  return (
    <div className="min-h-screen bg-[#fafafa] noise-bg">
      <a href="#dashboard-main" className="skip-link">본문으로 건너뛰기</a>
      <div className="max-w-7xl mx-auto px-4 py-8" id="dashboard-main">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 min-h-[44px] text-slate-400 hover:text-slate-700 transition-colors group">
            <span className="w-9 h-9 rounded-full glass-premium flex items-center justify-center group-hover:bg-white transition-all shadow-premium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            <span className="text-sm font-medium">홈으로</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/diagnosis"
              className="text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors min-h-[44px] flex items-center"
            >
              진단 다시하기
            </Link>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20">T</div>
              <span className="font-semibold text-[#1d1d1f]">텍스프리</span>
            </div>
          </div>
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">맞춤 세무 대시보드</h1>
          <p className="text-slate-400 font-normal">진단 결과를 바탕으로 준비된 정보입니다</p>
        </div>

        {/* 히어로 진단 결과 */}
        <div className="relative rounded-3xl mb-6 overflow-hidden">
          {/* 배경 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px" }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/8 rounded-full blur-[60px]" />

          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            {/* 상단: 업종 + 과세유형 */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium ring-1 ring-white/10">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {INDUSTRY_LABELS[result.answers.industry] || "기타"}
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${taxTypeBadgeClass}`}>
                {taxTypeLabel}
              </span>
            </div>

            {/* 연간 총 세금 - 히어로 */}
            <div className="mb-8">
              <p className="text-sm text-white/50 font-medium mb-1">연간 예상 총 세금</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-6xl font-bold text-white tracking-tighter tabular-nums">
                  {total.toLocaleString()}
                </span>
                <span className="text-xl text-white/50 font-medium">만원</span>
              </div>
              <p className="text-sm text-white/40 mt-2 font-normal">
                월 평균 <span className="text-white/70 font-semibold">{monthlyAvg.toLocaleString()}만원</span>
              </p>
            </div>

            {/* 절세 가능성 배지 */}
            {savingsEstimate > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 backdrop-blur-sm ring-1 ring-emerald-400/20 mb-8">
                <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-sm text-emerald-300 font-medium">
                  경비 최적화 시 약 <span className="font-bold text-emerald-200">{savingsEstimate.toLocaleString()}만원</span> 절세 가능
                </span>
              </div>
            )}

            {/* 세금 항목 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {taxItems.map((item) => {
                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div
                    key={item.label}
                    className="group relative bg-white/[0.06] backdrop-blur-sm rounded-2xl p-5 ring-1 ring-white/[0.08] hover:bg-white/[0.1] hover:ring-white/[0.14] transition-all duration-300"
                  >
                    {/* 상단 아이콘 + 라벨 */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90">{item.label}</p>
                        <p className="text-[11px] text-white/35">{item.desc}</p>
                      </div>
                    </div>

                    {/* 금액 */}
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-white tracking-tight tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-white/40 ml-1 font-medium">만원</span>
                    </div>

                    {/* 비율 바 */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-white/50 tabular-nums w-9 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 신고 일정 */}
            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-xs text-white/40">종합소득세</span>
                  <span className="text-xs font-semibold text-white/70">{result.reportSchedule.incomeTax}월</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="text-xs text-white/40">부가가치세</span>
                  <span className="text-xs font-semibold text-white/70">{result.reportSchedule.vat.join(", ")}월</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 계산 내역 */}
        {result.detail && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "연매출", value: `${result.detail.annualRevenue.toLocaleString()}만원`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
              { label: "경비율", value: `${result.detail.expenseRate}%`, icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
              { label: "과세표준", value: `${result.detail.taxableIncome.toLocaleString()}만원`, icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
              { label: "적용 세율", value: result.detail.taxBracket.split("(")[0].trim(), icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-lg font-bold text-[#1d1d1f] tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MonthlyTaxChart result={result} />
          <TaxCompositionChart result={result} />
        </div>
        <div className="mb-6">
          <TaxComparisonChart result={result} />
        </div>

        {/* 탭 섹션 - 프리미엄 */}
        <div className="bg-white rounded-2xl shadow-premium-lg border border-slate-100 overflow-hidden">
          {/* 탭 헤더 - 필 스타일 */}
          <div className="px-6 pt-5 pb-0">
            <div role="tablist" aria-label="대시보드 메뉴" className="inline-flex bg-slate-100 rounded-xl p-1 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls={`panel-${tab}`}
                  id={`tab-${tab}`}
                  onClick={() => handleTabChange(tab)}
                  onKeyDown={(e) => handleTabKeyDown(e, tab)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 min-h-[40px] rounded-lg font-medium text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-white text-[#1d1d1f] shadow-premium"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tabIcons[tab]}
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === "chat" && <div role="tabpanel" id="panel-chat" aria-labelledby="tab-chat"><AIChatPanel diagnosisResult={result} /></div>}
            {activeTab === "knowledge" && <div role="tabpanel" id="panel-knowledge" aria-labelledby="tab-knowledge"><TaxKnowledgeAccordion /></div>}
            {activeTab === "calendar" && (
              <div role="tabpanel" id="panel-calendar" aria-labelledby="tab-calendar">
                <TaxCalendar result={result} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
