"use client";

import { DiagnosisResult } from "@/app/types/diagnosis";

interface CardProps {
  result: DiagnosisResult;
}

const COLORS = {
  incomeTax: "#3182F6",
  vat: "#8B5CF6",
  insurance: "#10B981",
};

const INDUSTRY_LABELS: Record<string, string> = {
  "food-store": "음식점/카페",
  retail: "소매/쇼핑몰",
  service: "서비스업",
  freelancer: "프리랜서",
  education: "학원/교육",
  other: "기타",
};

/** 세금 요약 카드 - 파이차트 스타일 바 */
export function TaxSummaryCard({ result }: CardProps) {
  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;
  if (total <= 0) return null;

  const items = [
    { label: "종합소득세", value: result.estimatedIncomeTax, color: COLORS.incomeTax },
    { label: "부가가치세", value: result.estimatedVAT, color: COLORS.vat },
    { label: "4대보험", value: result.estimatedInsurance, color: COLORS.insurance },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-4 border border-slate-200/80 my-2 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">연간 예상 세금</span>
      </div>

      <div className="text-2xl font-bold text-slate-900 mb-3">
        {total.toLocaleString()}<span className="text-sm font-medium text-slate-500">만원</span>
      </div>

      {/* 비율 바 */}
      <div className="h-2.5 rounded-full overflow-hidden flex mb-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="h-full transition-all duration-500"
            style={{
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>

      {/* 항목 리스트 */}
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600">{item.label}</span>
            </div>
            <span className="font-semibold text-slate-800">{item.value.toLocaleString()}만원</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 신고 일정 카드 */
export function ScheduleCard({ result }: CardProps) {
  const schedules = [
    {
      label: "종합소득세",
      month: `${result.reportSchedule.incomeTax}월`,
      period: "1일~31일",
      color: "blue",
    },
    {
      label: "부가가치세",
      month: `${result.reportSchedule.vat.join(", ")}월`,
      period: "25일까지",
      color: "violet",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl p-4 border border-slate-200/80 my-2 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">신고 일정</span>
      </div>

      <div className="space-y-2">
        {schedules.map((s) => (
          <div key={s.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/80 border border-slate-100">
            <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${
              s.color === "blue" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600"
            }`}>
              <span className="text-[10px] font-bold leading-none">{s.month.split(",")[0]}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{s.label}</p>
              <p className="text-xs text-slate-500">{s.month} {s.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 절세 팁 카드 */
export function SavingTipCard({ result }: CardProps) {
  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;
  const saving = Math.floor(total * 0.15);
  const { answers } = result;

  const tips: string[] = [];

  if (answers.bookkeeping === "none" || answers.bookkeeping === "unknown") {
    tips.push("장부 작성 시 기장세액공제 20% 적용 가능");
  }
  if (result.taxType === "general") {
    tips.push("매입세액 공제를 위해 세금계산서 꼼꼼히 챙기기");
  }
  if (answers.industry === "freelancer") {
    tips.push("통신비·교통비·장비비 경비처리 활용하기");
  }
  tips.push("사업용 카드/계좌를 분리하여 경비 증빙 확보");

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl p-4 border border-amber-200/60 my-2 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">절세 포인트</span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-lg font-bold text-amber-700">최대 {saving.toLocaleString()}만원</span>
        <span className="text-sm text-slate-500">절세 가능</span>
      </div>

      <div className="space-y-1.5">
        {tips.slice(0, 3).map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-200/60 text-amber-700 flex items-center justify-center text-[10px] font-bold mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-slate-700">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 내 진단 정보 카드 */
export function MyInfoCard({ result }: CardProps) {
  const { answers } = result;
  const taxTypeLabels: Record<string, string> = {
    simplified: "간이과세자",
    general: "일반과세자",
    exempt: "면세사업자",
  };

  const items = [
    { label: "업종", value: INDUSTRY_LABELS[answers.industry] || "기타" },
    { label: "연매출", value: `${answers.revenue.toLocaleString()}만원` },
    { label: "과세유형", value: taxTypeLabels[result.taxType] || result.taxType },
    { label: "직원", value: answers.employeeCount > 0 ? `${answers.employeeCount}명` : "없음" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-xl p-4 border border-slate-200/80 my-2 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">내 진단 정보</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="p-2.5 rounded-lg bg-white/80 border border-slate-100">
            <p className="text-[10px] font-medium text-slate-400 uppercase">{item.label}</p>
            <p className="text-sm font-semibold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 경비율 상세 카드 */
export function ExpenseCard({ result }: CardProps) {
  if (!result.detail) return null;

  const { detail } = result;
  const expenseRatio = detail.annualRevenue > 0
    ? ((detail.estimatedExpense / detail.annualRevenue) * 100).toFixed(1)
    : "0";

  return (
    <div className="bg-gradient-to-br from-slate-50 to-cyan-50/30 rounded-xl p-4 border border-slate-200/80 my-2 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-cyan-100 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">경비 분석</span>
      </div>

      <div className="space-y-2.5">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-slate-600">적용 경비율</span>
          <span className="text-lg font-bold text-cyan-700">{detail.expenseRate}%</span>
        </div>

        {/* 경비율 바 */}
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-700"
            style={{ width: `${Math.min(detail.expenseRate, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-lg bg-white/80 border border-slate-100">
            <p className="text-[10px] text-slate-400">연매출</p>
            <p className="font-semibold text-slate-800">{detail.annualRevenue.toLocaleString()}만원</p>
          </div>
          <div className="p-2 rounded-lg bg-white/80 border border-slate-100">
            <p className="text-[10px] text-slate-400">추정 경비</p>
            <p className="font-semibold text-emerald-700">{detail.estimatedExpense.toLocaleString()}만원</p>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          매출의 {expenseRatio}%를 경비로 인정받아 과세표준이 줄어들어요
        </p>
      </div>
    </div>
  );
}

/* ── 키워드 매칭으로 적절한 카드 선택 ── */
export type VisualCardType = "summary" | "schedule" | "saving" | "info" | "expense";

const KEYWORD_MAP: { keywords: string[]; card: VisualCardType }[] = [
  { keywords: ["세금", "얼마", "총", "예상", "종합", "부가", "소득세", "부가세"], card: "summary" },
  { keywords: ["신고", "일정", "기한", "언제", "마감", "월"], card: "schedule" },
  { keywords: ["절세", "줄이", "절약", "아끼", "팁", "방법", "전략"], card: "saving" },
  { keywords: ["경비", "비용", "처리", "공제", "매입"], card: "expense" },
  { keywords: ["사업", "프리랜서", "업종", "매출", "직원", "내 정보", "현황"], card: "info" },
];

/** 사용자 메시지에서 적절한 시각화 카드 타입 결정 */
export function detectVisualCard(message: string): VisualCardType | null {
  const normalized = message.toLowerCase();

  for (const { keywords, card } of KEYWORD_MAP) {
    const matchCount = keywords.filter((kw) => normalized.includes(kw)).length;
    if (matchCount >= 1) return card;
  }
  return null;
}

/** 카드 타입에 따라 컴포넌트 반환 */
export function VisualCard({ type, result }: { type: VisualCardType; result: DiagnosisResult }) {
  switch (type) {
    case "summary":
      return <TaxSummaryCard result={result} />;
    case "schedule":
      return <ScheduleCard result={result} />;
    case "saving":
      return <SavingTipCard result={result} />;
    case "expense":
      return <ExpenseCard result={result} />;
    case "info":
      return <MyInfoCard result={result} />;
    default:
      return null;
  }
}
