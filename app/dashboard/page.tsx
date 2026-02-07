"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DiagnosisResult, DiagnosisAnswers } from "@/app/types/diagnosis";
import { calculateDiagnosisResult } from "@/app/utils/diagnosis";
import { MonthlyTaxChart, TaxCompositionChart, TaxComparisonChart } from "@/app/components/TaxCharts";
import TaxKnowledgeAccordion from "@/app/components/TaxKnowledgeAccordion";
import AIChatPanel from "@/app/components/AIChatPanel";
import { IconCalendar } from "@/app/components/Icons";

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

  const taxItems = [
    { label: "예상 종합소득세", value: result.estimatedIncomeTax, color: "blue" },
    { label: "예상 부가가치세", value: result.estimatedVAT, color: "violet" },
    { label: "예상 4대보험", value: result.estimatedInsurance, color: "emerald" },
  ];

  const summaryCards = [
    {
      label: "업종",
      value: INDUSTRY_LABELS[result.answers.industry] || "기타",
      sub: result.taxType === "simplified" ? "간이과세자" : "일반과세자",
    },
    {
      label: "연간 총 세금",
      value: `${total.toLocaleString()}만원`,
      sub: `월 평균 ${monthlyAvg.toLocaleString()}만원`,
    },
    {
      label: "예상 절세액",
      value: `${Math.floor(total * 0.15).toLocaleString()}만원`,
      sub: "경비처리 최적화 시",
    },
  ];

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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-500/20">T</div>
            <span className="font-semibold text-[#1d1d1f]">텍스프리</span>
          </div>
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">맞춤 세무 대시보드</h1>
          <p className="text-slate-400 font-normal">진단 결과를 바탕으로 준비된 정보입니다</p>
        </div>

        {/* 핵심 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
              <p className="text-xl font-bold text-[#1d1d1f] tracking-tight">{card.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* 진단 결과 요약 - 프리미엄 카드 */}
        <div className="gradient-border gradient-border-animated rounded-2xl mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-premium">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#1d1d1f]">진단 결과</h2>
            </div>
            <p className="text-base text-slate-600 mb-6 font-normal">{result.recommendation}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {taxItems.map((item) => (
                <div key={item.label} className="card-premium bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-100">
                  <div className="text-sm text-slate-400 mb-1.5">{item.label}</div>
                  <div className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                    {item.value.toLocaleString()}<span className="text-base font-medium text-slate-500 ml-0.5">만원</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-sm text-slate-400">
                <span className="font-medium text-slate-600">신고 일정:</span> 종합소득세 {result.reportSchedule.incomeTax}월,
                부가가치세 {result.reportSchedule.vat.join(", ")}월
              </div>
            </div>
          </div>
        </div>

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
                  onClick={() => setActiveTab(tab)}
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
              <div role="tabpanel" id="panel-calendar" aria-labelledby="tab-calendar" className="text-center py-12 text-slate-400">
                <p className="mb-4 font-normal">세무 캘린더 기능은 준비 중입니다.</p>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-6 inline-block border border-slate-100">
                  <div className="text-sm space-y-3 text-left text-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                        <IconCalendar />
                      </div>
                      <span>종합소득세 신고: {result.reportSchedule.incomeTax}월 1일~31일</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                        <IconCalendar />
                      </div>
                      <span>부가가치세 신고: {result.reportSchedule.vat.join(", ")}월 25일까지</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
