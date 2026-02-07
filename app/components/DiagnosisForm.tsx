"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DiagnosisAnswers, BusinessType, MonthlyRevenue, BusinessRegistration, EmployeeCount, InterestArea } from "@/app/types/diagnosis";
import {
  IconBriefcase,
  IconCart,
  IconStore,
  IconSparkles,
  IconLeaf,
  IconChartBar,
  IconTrendingUp,
  IconRocket,
  IconCheck,
  IconCircle,
  IconQuestion,
  IconUser,
  IconUsers,
  IconUserGroup,
  IconDocument,
  IconReceipt,
  IconCurrency,
  IconShield,
  IconChat,
} from "./Icons";

const ICON_MAP = {
  briefcase: IconBriefcase,
  cart: IconCart,
  store: IconStore,
  sparkles: IconSparkles,
  leaf: IconLeaf,
  chartBar: IconChartBar,
  trendingUp: IconTrendingUp,
  rocket: IconRocket,
  check: IconCheck,
  circle: IconCircle,
  question: IconQuestion,
  user: IconUser,
  users: IconUsers,
  userGroup: IconUserGroup,
  document: IconDocument,
  receipt: IconReceipt,
  currency: IconCurrency,
  shield: IconShield,
  chat: IconChat,
} as const;

const QUESTIONS = [
  {
    id: "businessType" as const,
    title: "사업 유형은 무엇인가요?",
    options: [
      { value: "freelancer" as BusinessType, label: "프리랜서", iconKey: "briefcase" as const },
      { value: "online-shop" as BusinessType, label: "온라인쇼핑몰", iconKey: "cart" as const },
      { value: "offline-store" as BusinessType, label: "오프라인매장", iconKey: "store" as const },
      { value: "other" as BusinessType, label: "기타", iconKey: "sparkles" as const },
    ],
  },
  {
    id: "monthlyRevenue" as const,
    title: "월 매출 규모는 어느 정도인가요?",
    options: [
      { value: "under-500" as MonthlyRevenue, label: "500만원 이하", iconKey: "leaf" as const },
      { value: "500-2000" as MonthlyRevenue, label: "500~2000만원", iconKey: "chartBar" as const },
      { value: "2000-5000" as MonthlyRevenue, label: "2000~5000만원", iconKey: "trendingUp" as const },
      { value: "over-5000" as MonthlyRevenue, label: "5000만원 이상", iconKey: "rocket" as const },
    ],
  },
  {
    id: "businessRegistration" as const,
    title: "사업자등록을 하셨나요?",
    options: [
      { value: "yes" as BusinessRegistration, label: "예", iconKey: "check" as const },
      { value: "no" as BusinessRegistration, label: "아니오", iconKey: "circle" as const },
      { value: "unknown" as BusinessRegistration, label: "모르겠음", iconKey: "question" as const },
    ],
  },
  {
    id: "employeeCount" as const,
    title: "직원이 있나요?",
    options: [
      { value: "none" as EmployeeCount, label: "없음", iconKey: "user" as const },
      { value: "1-4" as EmployeeCount, label: "1~4명", iconKey: "users" as const },
      { value: "5-plus" as EmployeeCount, label: "5명 이상", iconKey: "userGroup" as const },
    ],
  },
  {
    id: "interestArea" as const,
    title: "가장 궁금한 것은 무엇인가요?",
    options: [
      { value: "income-tax" as InterestArea, label: "종합소득세", iconKey: "document" as const },
      { value: "vat" as InterestArea, label: "부가가치세", iconKey: "receipt" as const },
      { value: "expenses" as InterestArea, label: "경비처리", iconKey: "currency" as const },
      { value: "insurance" as InterestArea, label: "4대보험", iconKey: "shield" as const },
      { value: "general" as InterestArea, label: "전반적 상담", iconKey: "chat" as const },
    ],
  },
];

export default function DiagnosisForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Partial<DiagnosisAnswers>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (questionId: keyof DiagnosisAnswers, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 200);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === QUESTIONS.length && !isSubmitting) {
      setIsSubmitting(true);
      sessionStorage.setItem("diagnosisAnswers", JSON.stringify(answers));
      router.push("/dashboard");
    }
  };

  const currentQuestion = QUESTIONS[currentStep];
  const isComplete = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="min-h-screen bg-[#fafbfc] overflow-hidden relative">
      <a href="#diagnosis-main" className="skip-link">본문으로 건너뛰기</a>
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-100/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_0.5px,transparent_0.5px),linear-gradient(to_bottom,#e5e7eb_0.5px,transparent_0.5px)] bg-[size:24px_24px] opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_20%,transparent_100%)]" />
      </div>

      <div id="diagnosis-main" className="relative z-10 max-w-xl mx-auto px-5 py-8 md:py-12">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="flex items-center gap-2 min-h-[44px] items-center text-[#86868b] hover:text-[#1d1d1f] transition-colors group"
            aria-label="홈으로 돌아가기"
          >
            <span className="w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            <span className="text-sm font-medium">홈</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-blue-600/20">
              T
            </div>
            <span className="font-semibold text-[#1d1d1f]">텍스프리</span>
          </div>
        </header>

        {/* 타이틀 */}
        <div className="mb-10">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-[0.2em] mb-3">
            Tax Diagnosis
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] leading-tight tracking-tight">
            나의 세무 상태
            <br />
            <span className="text-blue-600">진단하기</span>
          </h1>
          <p className="text-[#86868b] mt-3 text-sm font-normal">
            {currentStep + 1}번째 질문 · 총 {QUESTIONS.length}단계
          </p>
        </div>

        {/* 스텝 인디케이터 */}
        <div
          className="flex gap-2 mb-8"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={QUESTIONS.length}
          aria-label={`진단 진행: ${currentStep + 1} / ${QUESTIONS.length} 단계`}
        >
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-blue-500" : "bg-slate-200"
              } ${i === currentStep ? "opacity-100" : i < currentStep ? "opacity-70" : "opacity-40"}`}
            />
          ))}
        </div>

        {/* 질문 카드 */}
        <div
          key={currentStep}
          className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 p-8 mb-6 shadow-xl shadow-slate-200/30"
          role="group"
          aria-labelledby={`question-${currentStep}-title`}
        >
          <div className="flex items-center gap-2.5 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-100 text-blue-700 text-sm font-semibold">
              {currentStep + 1}
            </span>
            <h2 id={`question-${currentStep}-title`} className="text-lg font-semibold text-[#1d1d1f]">{currentQuestion.title}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="선택 옵션">
            {currentQuestion.options.map((option: { value: unknown; label: string; iconKey?: keyof typeof ICON_MAP }) => {
              const isSelected = answers[currentQuestion.id] === option.value;
              const IconComponent = option.iconKey ? ICON_MAP[option.iconKey] : null;
              return (
                <button
                  key={String(option.value)}
                  onClick={() => handleSelect(currentQuestion.id, option.value)}
                  aria-pressed={isSelected}
                  className={`group relative p-5 min-h-[44px] rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-4 ${
                    isSelected
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-50/50 shadow-lg shadow-blue-500/10 scale-[1.02]"
                      : "border-slate-100 bg-white/50 hover:border-slate-200 hover:bg-slate-50/80 hover:shadow-md"
                  }`}
                >
                  {IconComponent && (
                    <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 group-hover:bg-slate-200/50 group-hover:text-slate-700 transition-colors">
                      <IconComponent />
                    </span>
                  )}
                  <span className={`font-medium ${isSelected ? "text-[#1d1d1f]" : "text-[#424245]"}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="min-h-[44px] px-6 py-3.5 rounded-2xl border border-slate-200 text-[#6e6e73] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:border-slate-300 hover:text-[#1d1d1f] transition-all font-medium text-sm"
            aria-label="이전 질문으로"
          >
            ← 이전
          </button>
          {isComplete ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-h-[44px] px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/30 text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              aria-busy={isSubmitting}
              aria-label={isSubmitting ? "결과 페이지로 이동 중" : "결과 보기"}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  이동 중...
                </>
              ) : (
                <>
                  결과 보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <div className="px-6 py-3.5 text-[#86868b] text-sm font-normal">
              선택하면 다음으로 →
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
