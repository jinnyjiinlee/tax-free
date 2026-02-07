"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TaxFreeCharacter from "@/app/components/TaxFreeCharacter";
import {
  Store,
  ShoppingCart,
  Briefcase,
  Pen,
  GraduationCap,
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  HelpCircle,
  TrendingDown,
  BarChart3,
  TrendingUp,
  Rocket,
  Clock,
  Calendar,
  CalendarCheck,
  User,
  Users,
  UserPlus,
  BookOpen,
  FileText,
  AlertCircle,
  FileQuestion,
  Calculator,
  Receipt,
  Wallet,
  HeartHandshake,
  Search,
  Info,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import type { DiagnosisAnswers } from "@/app/types/diagnosis";

const ENCOURAGEMENT: Record<number, string> = {
  1: "좋은 출발이에요!",
  2: "좋은 출발이에요!",
  3: "좋은 출발이에요!",
  4: "거의 다 왔어요!",
  5: "거의 다 왔어요!",
  6: "마지막 질문이에요!",
  7: "완료 직전!",
};

const QUESTIONS = [
  {
    id: "industry" as const,
    title: "사업 업종이 무엇인가요?",
    why: "업종마다 국세청이 인정하는 경비 비율이 달라요. 같은 매출이어도 업종에 따라 세금 차이가 큽니다.",
    options: [
      { value: "food-store" as const, label: "음식점/카페", Icon: Store },
      { value: "retail" as const, label: "소매/쇼핑몰", Icon: ShoppingCart },
      { value: "service" as const, label: "서비스업", Icon: Briefcase },
      { value: "freelancer" as const, label: "프리랜서", Icon: Pen },
      { value: "education" as const, label: "학원/교육", Icon: GraduationCap },
      { value: "other" as const, label: "기타", Icon: MoreHorizontal },
    ],
  },
  {
    id: "taxStatus" as const,
    title: "과세 유형을 알고 계신가요?",
    why: "간이과세자는 부가세를 적게 내고, 일반과세자는 매입세액 공제를 받을 수 있어요.",
    options: [
      { value: "simplified" as const, label: "간이과세자", Icon: ShieldCheck },
      { value: "general" as const, label: "일반과세자", Icon: ShieldAlert },
      { value: "exempt" as const, label: "면세사업자", Icon: ShieldOff },
      { value: "unknown" as const, label: "잘 모르겠어요", Icon: HelpCircle },
    ],
  },
  {
    id: "revenue" as const,
    title: "연 매출 규모는 어느 정도인가요?",
    why: "매출에 따라 세율 구간, 장부 의무, 간이과세 가능 여부가 달라져요.",
    options: [
      { value: "under-24M" as const, label: "2,400만원 이하", Icon: TrendingDown },
      { value: "24-75M" as const, label: "2,400~7,500만원", Icon: BarChart3 },
      { value: "75-150M" as const, label: "7,500만~1.5억", Icon: TrendingUp },
      { value: "over-150M" as const, label: "1.5억 이상", Icon: Rocket },
    ],
  },
  {
    id: "businessAge" as const,
    title: "사업을 시작한 지 얼마나 되셨나요?",
    why: "신규 사업자는 단순경비율 적용이 가능해서 세금이 줄어들 수 있어요.",
    options: [
      { value: "under-1y" as const, label: "1년 미만", Icon: Clock },
      { value: "1-3y" as const, label: "1~3년", Icon: Calendar },
      { value: "3plus" as const, label: "3년 이상", Icon: CalendarCheck },
    ],
  },
  {
    id: "employeeCount" as const,
    title: "직원이 있으신가요?",
    why: "직원이 있으면 원천징수와 4대보험 신고 의무가 생겨요.",
    options: [
      { value: "none" as const, label: "없음", Icon: User },
      { value: "1-4" as const, label: "1~4명", Icon: Users },
      { value: "5-plus" as const, label: "5명 이상", Icon: UserPlus },
    ],
  },
  {
    id: "bookkeeping" as const,
    title: "장부는 어떻게 관리하고 계신가요?",
    why: "복식부기로 장부를 쓰면 세액공제 20%를 받을 수 있어요.",
    options: [
      { value: "simple" as const, label: "직접 간편장부", Icon: BookOpen },
      { value: "accountant" as const, label: "세무사에게 맡김", Icon: FileText },
      { value: "none" as const, label: "안 하고 있음", Icon: AlertCircle },
      { value: "unknown" as const, label: "잘 모르겠음", Icon: FileQuestion },
    ],
  },
  {
    id: "interestArea" as const,
    title: "가장 궁금한 세무 주제는?",
    why: "진단 결과에서 이 주제를 중심으로 맞춤 조언을 드릴게요.",
    options: [
      { value: "income-tax" as const, label: "종합소득세 절세", Icon: Calculator },
      { value: "vat" as const, label: "부가세 신고", Icon: Receipt },
      { value: "expenses" as const, label: "경비처리 범위", Icon: Wallet },
      { value: "insurance" as const, label: "4대보험", Icon: HeartHandshake },
      { value: "general" as const, label: "세무 전반", Icon: Search },
    ],
  },
];

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosisAnswers>>({});
  const [openWhy, setOpenWhy] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const currentQuestion = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;
  const isComplete = Object.keys(answers).length === QUESTIONS.length;

  const handleSelect = (value: DiagnosisAnswers[keyof DiagnosisAnswers]) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setDirection("forward");
    setTimeout(() => {
      if (!isLastStep) setStep((s) => s + 1);
    }, 500);
  };

  const handlePrev = () => {
    setDirection("backward");
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setDirection("forward");
    if (isLastStep && isComplete) {
      const data = { ...answers } as DiagnosisAnswers;
      localStorage.setItem("diagnosisAnswers", JSON.stringify(data));
      sessionStorage.setItem("diagnosisAnswers", JSON.stringify(data));
      router.push("/result");
    } else if (!isLastStep) {
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-indigo-50/40 rounded-full blur-[80px]" />
      </div>

      {/* 상단 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium min-h-[44px] items-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              홈
            </Link>
            <div className="flex items-center gap-2">
              <TaxFreeCharacter size="sm" animate={false} className="!w-8 !h-8" />
              <span className="font-bold text-slate-900 text-sm tracking-tight">텍스프리</span>
            </div>
          </div>
          {/* 프로그레스바 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">
                {step + 1} / {QUESTIONS.length}
              </span>
              <div className="flex gap-1">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i <= step ? "bg-blue-600" : "bg-slate-200"
                    } ${i === step ? "scale-125" : ""}`}
                  />
                ))}
              </div>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-blue-600 tracking-tight">
            {ENCOURAGEMENT[step + 1]}
          </p>
        </div>
      </header>

      {/* 질문 카드 */}
      <main className="relative max-w-xl mx-auto px-4 py-8 pb-24">
        <div
          key={step}
          className={
            direction === "forward"
              ? "animate-slide-in-right"
              : "animate-slide-in-left"
          }
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/80 shadow-premium p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-6">
              <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                {step + 1}
              </span>
              <h2 className="text-xl font-semibold text-slate-900 leading-snug pt-1">
                {currentQuestion.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {currentQuestion.options.map((opt) => {
                const Icon = opt.Icon;
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-300 min-h-[56px] ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/80 shadow-sm shadow-blue-500/10 scale-[1.02]"
                        : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-white text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <span
                      className={`flex-1 font-medium transition-colors ${
                        isSelected ? "text-slate-900" : "text-slate-700"
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 왜 물어보나요 */}
            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={() => setOpenWhy(openWhy === step ? null : step)}
                className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                  openWhy === step ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Info
                  className={`w-4 h-4 transition-transform duration-300 ${openWhy === step ? "rotate-12" : ""}`}
                />
                왜 물어보나요?
              </button>
              <div
                className={`grid transition-all duration-500 ease-out ${
                  openWhy === step ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="mt-3 pl-6 text-sm text-slate-500 leading-relaxed border-l-2 border-blue-100">
                    {currentQuestion.why}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 - 고정 */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-6 px-4">
          <div className="max-w-xl mx-auto flex justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 min-h-[48px]"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              이전
            </button>
            {isLastStep ? (
              <button
                onClick={handleNext}
                disabled={!isComplete}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/20 min-h-[48px]"
              >
                진단 결과 보기
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/20 min-h-[48px]"
              >
                다음
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
