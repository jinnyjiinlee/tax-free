"use client";

import { useState, useRef, useEffect } from "react";
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
  Clock,
  Calendar,
  CalendarCheck,
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
  type LucideIcon,
} from "lucide-react";
import type { DiagnosisAnswers } from "@/app/types/diagnosis";

const ENCOURAGEMENT: Record<number, string> = {
  1: "좋은 출발이에요!",
  2: "좋은 출발이에요!",
  3: "정확한 숫자를 알려주세요!",
  4: "거의 다 왔어요!",
  5: "거의 다 왔어요!",
  6: "마지막 질문이에요!",
  7: "완료 직전!",
};

/* ── 선택형 질문 정의 ── */
interface SelectQuestion {
  id: keyof DiagnosisAnswers;
  type: "select";
  title: string;
  why: string;
  options: { value: string; label: string; Icon: LucideIcon }[];
}

/* ── 숫자 입력형 질문 정의 ── */
interface NumberQuestion {
  id: keyof DiagnosisAnswers;
  type: "number";
  title: string;
  why: string;
  placeholder: string;
  unit: string;
  suffix: string;
  min: number;
  max: number;
  presets?: { label: string; value: number }[];
}

type Question = SelectQuestion | NumberQuestion;

const QUESTIONS: Question[] = [
  {
    id: "industry",
    type: "select",
    title: "사업 업종이 무엇인가요?",
    why: "업종마다 국세청이 인정하는 경비 비율이 달라요. 같은 매출이어도 업종에 따라 세금 차이가 큽니다.",
    options: [
      { value: "food-store", label: "음식점/카페", Icon: Store },
      { value: "retail", label: "소매/쇼핑몰", Icon: ShoppingCart },
      { value: "service", label: "서비스업", Icon: Briefcase },
      { value: "freelancer", label: "프리랜서", Icon: Pen },
      { value: "education", label: "학원/교육", Icon: GraduationCap },
      { value: "other", label: "기타", Icon: MoreHorizontal },
    ],
  },
  {
    id: "taxStatus",
    type: "select",
    title: "과세 유형을 알고 계신가요?",
    why: "간이과세자는 부가세를 적게 내고, 일반과세자는 매입세액 공제를 받을 수 있어요.",
    options: [
      { value: "simplified", label: "간이과세자", Icon: ShieldCheck },
      { value: "general", label: "일반과세자", Icon: ShieldAlert },
      { value: "exempt", label: "면세사업자", Icon: ShieldOff },
      { value: "unknown", label: "잘 모르겠어요", Icon: HelpCircle },
    ],
  },
  {
    id: "revenue",
    type: "number",
    title: "연 매출이 얼마인가요?",
    why: "정확한 매출을 입력하면 누진세율에 따라 정밀한 세금을 계산할 수 있어요.",
    placeholder: "예: 5000",
    unit: "만원",
    suffix: "/년",
    min: 0,
    max: 1000000,
    presets: [
      { label: "1,000만", value: 1000 },
      { label: "3,000만", value: 3000 },
      { label: "5,000만", value: 5000 },
      { label: "1억", value: 10000 },
      { label: "2억", value: 20000 },
    ],
  },
  {
    id: "businessAge",
    type: "select",
    title: "사업을 시작한 지 얼마나 되셨나요?",
    why: "신규 사업자는 단순경비율 적용이 가능해서 세금이 줄어들 수 있어요.",
    options: [
      { value: "under-1y", label: "1년 미만", Icon: Clock },
      { value: "1-3y", label: "1~3년", Icon: Calendar },
      { value: "3plus", label: "3년 이상", Icon: CalendarCheck },
    ],
  },
  {
    id: "employeeCount",
    type: "number",
    title: "직원이 몇 명인가요?",
    why: "직원이 있으면 원천징수와 4대보험 신고 의무가 생기고, 인건비가 경비로 인정돼요.",
    placeholder: "없으면 0",
    unit: "명",
    suffix: "",
    min: 0,
    max: 999,
    presets: [
      { label: "없음", value: 0 },
      { label: "1명", value: 1 },
      { label: "3명", value: 3 },
      { label: "5명", value: 5 },
      { label: "10명", value: 10 },
    ],
  },
  {
    id: "bookkeeping",
    type: "select",
    title: "장부는 어떻게 관리하고 계신가요?",
    why: "복식부기로 장부를 쓰면 세액공제 20%를 받을 수 있어요.",
    options: [
      { value: "simple", label: "직접 간편장부", Icon: BookOpen },
      { value: "accountant", label: "세무사에게 맡김", Icon: FileText },
      { value: "none", label: "안 하고 있음", Icon: AlertCircle },
      { value: "unknown", label: "잘 모르겠음", Icon: FileQuestion },
    ],
  },
  {
    id: "interestArea",
    type: "select",
    title: "가장 궁금한 세무 주제는?",
    why: "진단 결과에서 이 주제를 중심으로 맞춤 조언을 드릴게요.",
    options: [
      { value: "income-tax", label: "종합소득세 절세", Icon: Calculator },
      { value: "vat", label: "부가세 신고", Icon: Receipt },
      { value: "expenses", label: "경비처리 범위", Icon: Wallet },
      { value: "insurance", label: "4대보험", Icon: HeartHandshake },
      { value: "general", label: "세무 전반", Icon: Search },
    ],
  },
];

/* ── 숫자 포맷 (쉼표) ── */
function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<DiagnosisAnswers>>({});
  const [openWhy, setOpenWhy] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [numberInput, setNumberInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;
  const isComplete = QUESTIONS.every((q) => answers[q.id] !== undefined);

  // 숫자 입력 스텝 진입 시 기존 값 복원 & 포커스
  useEffect(() => {
    if (currentQuestion.type === "number") {
      const existing = answers[currentQuestion.id];
      setNumberInput(existing !== undefined ? String(existing) : "");
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [step, currentQuestion.type, currentQuestion.id, answers]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setDirection("forward");
    setTimeout(() => {
      if (!isLastStep) setStep((s) => s + 1);
    }, 400);
  };

  const handleNumberConfirm = () => {
    const num = parseInt(numberInput.replace(/,/g, ""), 10);
    if (isNaN(num) || num < 0) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: num }));
    setDirection("forward");
    if (!isLastStep) {
      setTimeout(() => setStep((s) => s + 1), 200);
    }
  };

  const handlePreset = (value: number) => {
    setNumberInput(String(value));
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setDirection("forward");
    if (!isLastStep) {
      setTimeout(() => setStep((s) => s + 1), 300);
    }
  };

  const handlePrev = () => {
    setDirection("backward");
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setDirection("forward");
    if (currentQuestion.type === "number" && answers[currentQuestion.id] === undefined) {
      handleNumberConfirm();
      return;
    }
    if (isLastStep && isComplete) {
      const data = { ...answers } as DiagnosisAnswers;
      localStorage.setItem("diagnosisAnswers", JSON.stringify(data));
      sessionStorage.setItem("diagnosisAnswers", JSON.stringify(data));
      router.push("/result");
    } else if (!isLastStep) {
      setStep((s) => s + 1);
    }
  };

  const currentAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      {/* 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-indigo-50/40 rounded-full blur-[80px]" />
      </div>

      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium min-h-[44px] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
              홈
            </Link>
            <div className="flex items-center gap-2">
              <TaxFreeCharacter size="sm" animate={false} className="!w-8 !h-8" />
              <span className="font-bold text-slate-900 text-sm tracking-tight">텍스프리</span>
            </div>
          </div>
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
      <main className="relative max-w-xl mx-auto px-4 py-8 pb-32">
        <div
          key={step}
          className={direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"}
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

            {/* ── 선택형 질문 ── */}
            {currentQuestion.type === "select" && (
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
                      <span className={`flex-1 font-medium transition-colors ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
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
            )}

            {/* ── 숫자 입력형 질문 ── */}
            {currentQuestion.type === "number" && (
              <div className="mb-6 space-y-5">
                {/* 입력 필드 */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={numberInput ? formatNumber(parseInt(numberInput.replace(/,/g, ""), 10) || 0) : ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      setNumberInput(raw);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNumberConfirm();
                    }}
                    placeholder={currentQuestion.placeholder}
                    className="w-full text-3xl font-bold text-slate-900 text-center py-6 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:text-xl"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-lg font-medium text-slate-400">
                    {currentQuestion.unit}{currentQuestion.suffix}
                  </span>
                </div>

                {/* 실시간 환산 */}
                {numberInput && parseInt(numberInput, 10) > 0 && (
                  <p className="text-center text-sm text-slate-500">
                    = 월{" "}
                    <span className="font-semibold text-slate-700">
                      {currentQuestion.id === "revenue"
                        ? `약 ${formatNumber(Math.round(parseInt(numberInput, 10) / 12))}만원`
                        : `${numberInput}명`}
                    </span>
                    {currentQuestion.id === "revenue" && " 매출"}
                  </p>
                )}

                {/* 빠른 선택 프리셋 */}
                {currentQuestion.presets && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2 text-center">빠른 선택</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentQuestion.presets.map((p) => {
                        const isActive = answers[currentQuestion.id] === p.value;
                        return (
                          <button
                            key={p.value}
                            onClick={() => handlePreset(p.value)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-blue-500 text-white shadow-sm shadow-blue-500/20"
                                : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 확인 버튼 */}
                {numberInput && parseInt(numberInput, 10) >= 0 && (
                  <button
                    onClick={handleNumberConfirm}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    {formatNumber(parseInt(numberInput, 10))}{currentQuestion.unit} 확인
                  </button>
                )}
              </div>
            )}

            {/* 왜 물어보나요 */}
            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={() => setOpenWhy(openWhy === step ? null : step)}
                className={`flex items-center gap-2 text-sm transition-colors duration-300 ${
                  openWhy === step ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Info className={`w-4 h-4 transition-transform duration-300 ${openWhy === step ? "rotate-12" : ""}`} />
                왜 물어보나요?
              </button>
              <div className={`grid transition-all duration-500 ease-out ${openWhy === step ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <p className="mt-3 pl-6 text-sm text-slate-500 leading-relaxed border-l-2 border-blue-100">
                    {currentQuestion.why}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-8 px-4" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
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
                disabled={!currentAnswered}
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
