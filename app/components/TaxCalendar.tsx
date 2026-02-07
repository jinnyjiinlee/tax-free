"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Receipt,
  HeartHandshake,
  CreditCard,
  Bell,
  Filter,
  Flame,
  Shield,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DiagnosisResult } from "@/app/types/diagnosis";

/* ── 타입 ── */
interface TaxEvent {
  id: string;
  month: number;
  day: string;
  deadline: number; // 마감일 (1~31)
  title: string;
  description: string;
  category: "income-tax" | "vat" | "insurance" | "withholding" | "other";
  importance: "must" | "recommended" | "optional";
  tip?: string;
}

interface TaxCalendarProps {
  result: DiagnosisResult;
}

/* ── 카테고리 스타일 ── */
const CAT: Record<string, {
  color: string; bg: string; bgSoft: string; border: string;
  dot: string; icon: LucideIcon; label: string;
}> = {
  "income-tax": {
    color: "text-blue-600", bg: "bg-blue-500", bgSoft: "bg-blue-50",
    border: "border-blue-200", dot: "bg-blue-500", icon: FileText, label: "종합소득세",
  },
  vat: {
    color: "text-violet-600", bg: "bg-violet-500", bgSoft: "bg-violet-50",
    border: "border-violet-200", dot: "bg-violet-500", icon: Receipt, label: "부가가치세",
  },
  insurance: {
    color: "text-emerald-600", bg: "bg-emerald-500", bgSoft: "bg-emerald-50",
    border: "border-emerald-200", dot: "bg-emerald-500", icon: HeartHandshake, label: "4대보험",
  },
  withholding: {
    color: "text-amber-600", bg: "bg-amber-500", bgSoft: "bg-amber-50",
    border: "border-amber-200", dot: "bg-amber-500", icon: CreditCard, label: "원천징수",
  },
  other: {
    color: "text-slate-600", bg: "bg-slate-400", bgSoft: "bg-slate-50",
    border: "border-slate-200", dot: "bg-slate-400", icon: Bell, label: "기타",
  },
};

const IMPORTANCE_STYLE = {
  must: { label: "필수", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: Flame },
  recommended: { label: "권장", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: Shield },
  optional: { label: "선택", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", icon: Clock },
};

/* ── 이벤트 생성 ── */
function getTaxEvents(result: DiagnosisResult): TaxEvent[] {
  const events: TaxEvent[] = [];
  const isSimplified = result.taxType === "simplified";
  const isExempt = result.taxType === "exempt";
  const hasEmployees = result.answers.employeeCount > 0;

  // 종합소득세
  events.push({
    id: "income-tax-confirm",
    month: 5, day: "1일 ~ 31일", deadline: 31,
    title: "종합소득세 확정신고 · 납부",
    description: `전년도 소득에 대한 종합소득세를 신고하고 납부합니다.`,
    category: "income-tax", importance: "must",
    tip: `예상 납부액: ${result.estimatedIncomeTax.toLocaleString()}만원. 홈택스에서 전자신고 가능합니다.`,
  });
  events.push({
    id: "income-tax-interim",
    month: 11, day: "1일 ~ 30일", deadline: 30,
    title: "종합소득세 중간예납",
    description: "직전 과세기간 종합소득세액의 1/2을 미리 납부합니다.",
    category: "income-tax", importance: "must",
    tip: "중간예납세액이 50만원 미만이면 납부 의무가 면제됩니다.",
  });

  // 부가가치세
  if (isSimplified) {
    events.push({
      id: "vat-simplified-confirm",
      month: 1, day: "1일 ~ 25일", deadline: 25,
      title: "부가가치세 확정신고 (간이)",
      description: `간이과세자 연 1회 신고 · 납부`,
      category: "vat", importance: "must",
      tip: `예상 부가세: ${result.estimatedVAT.toLocaleString()}만원`,
    });
    events.push({
      id: "vat-simplified-interim",
      month: 7, day: "1일 ~ 25일", deadline: 25,
      title: "부가가치세 예정부과 (간이)",
      description: "국세청 고지에 따라 납부합니다.",
      category: "vat", importance: "recommended",
    });
  } else if (!isExempt) {
    ([1, 7] as const).forEach((m) => {
      events.push({
        id: `vat-confirm-${m}`,
        month: m, day: "1일 ~ 25일", deadline: 25,
        title: "부가가치세 확정신고 · 납부",
        description: `직전 6개월분 확정 신고`,
        category: "vat", importance: "must",
        tip: `예상 부가세(반기): ${Math.floor(result.estimatedVAT / 2).toLocaleString()}만원`,
      });
    });
    ([4, 10] as const).forEach((m) => {
      events.push({
        id: `vat-interim-${m}`,
        month: m, day: "1일 ~ 25일", deadline: 25,
        title: "부가가치세 예정신고 · 납부",
        description: "직전 3개월분 예정 신고 및 납부입니다.",
        category: "vat", importance: "must",
      });
    });
  }

  // 원천징수
  if (hasEmployees) {
    for (let m = 1; m <= 12; m++) {
      events.push({
        id: `withholding-${m}`,
        month: m, day: "10일까지", deadline: 10,
        title: "원천징수 신고 · 납부",
        description: `직원 ${result.answers.employeeCount}명 급여 소득세 원천징수분`,
        category: "withholding", importance: m === 3 ? "must" : "optional",
        tip: m === 3 ? "3월은 지급명세서 제출 기한이기도 합니다." : undefined,
      });
    }
  }

  // 4대보험
  if (hasEmployees) {
    events.push({
      id: "insurance-annual",
      month: 3, day: "15일까지", deadline: 15,
      title: "4대보험 보수총액 신고",
      description: `전년도 보수총액 확정 신고`,
      category: "insurance", importance: "must",
      tip: `연간 예상 사업주 부담: ${result.estimatedInsurance.toLocaleString()}만원`,
    });
    events.push({
      id: "insurance-adjust",
      month: 4, day: "말일까지", deadline: 30,
      title: "4대보험 정산 보험료 납부",
      description: "보수총액 신고에 따른 정산 차액 납부",
      category: "insurance", importance: "recommended",
    });
  }

  // 면세사업자
  if (isExempt) {
    events.push({
      id: "biz-status-report",
      month: 2, day: "1일 ~ 10일", deadline: 10,
      title: "사업장현황 신고",
      description: "면세사업자는 매년 사업장현황을 신고해야 합니다.",
      category: "other", importance: "must",
    });
  }

  return events.sort((a, b) => a.month - b.month || a.deadline - b.deadline);
}

/* ── D-day 계산 ── */
function getDday(month: number, deadline: number): { text: string; urgent: boolean; past: boolean } {
  const now = new Date();
  const year = now.getFullYear();
  const target = new Date(year, month - 1, deadline);
  if (target < new Date(year, now.getMonth(), now.getDate())) {
    // 올해 이미 지남
    return { text: "완료", urgent: false, past: true };
  }
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return { text: "D-Day", urgent: true, past: false };
  if (diff <= 14) return { text: `D-${diff}`, urgent: true, past: false };
  if (diff <= 30) return { text: `D-${diff}`, urgent: false, past: false };
  return { text: `${month}월`, urgent: false, past: false };
}

/* ── 필터 타입 ── */
type ImportanceFilter = "all" | "must" | "recommended" | "optional";
type CategoryFilter = "all" | "income-tax" | "vat" | "insurance" | "withholding" | "other";

const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

/* ──────────────────────────────────────────
   메인 컴포넌트
────────────────────────────────────────── */
export default function TaxCalendar({ result }: TaxCalendarProps) {
  const events = useMemo(() => getTaxEvents(result), [result]);
  const currentMonth = new Date().getMonth() + 1;

  const [importanceFilter, setImportanceFilter] = useState<ImportanceFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  // 필터링
  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (importanceFilter !== "all" && e.importance !== importanceFilter) return false;
      if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
      return true;
    });
  }, [events, importanceFilter, categoryFilter]);

  const mustCount = events.filter((e) => e.importance === "must").length;
  const doneCount = events.filter((e) => getDday(e.month, e.deadline).past).length;
  const upcomingMust = events
    .filter((e) => e.importance === "must" && !getDday(e.month, e.deadline).past)
    .slice(0, 3);

  // 월별 그룹
  const monthGroups = useMemo(() => {
    const groups: Record<number, typeof filtered> = {};
    filtered.forEach((e) => {
      if (!groups[e.month]) groups[e.month] = [];
      groups[e.month].push(e);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* ── 헤더 + 통계 ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-base">2025년 세무 캘린더</h3>
            <p className="text-xs text-slate-400">
              나의 상황에 맞는 신고 일정만 보여드려요
            </p>
          </div>
          {/* 뷰 토글 */}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            {(["timeline", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                {v === "timeline" ? "타임라인" : "월별"}
              </button>
            ))}
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3.5 border border-red-100">
            <p className="text-[11px] font-medium text-red-400 mb-0.5">필수 신고</p>
            <p className="text-xl font-bold text-red-600">{mustCount}<span className="text-xs font-medium text-red-400 ml-0.5">건</span></p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3.5 border border-emerald-100">
            <p className="text-[11px] font-medium text-emerald-400 mb-0.5">처리 완료</p>
            <p className="text-xl font-bold text-emerald-600">{doneCount}<span className="text-xs font-medium text-emerald-400 ml-0.5">건</span></p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3.5 border border-blue-100">
            <p className="text-[11px] font-medium text-blue-400 mb-0.5">전체 일정</p>
            <p className="text-xl font-bold text-blue-600">{events.length}<span className="text-xs font-medium text-blue-400 ml-0.5">건</span></p>
          </div>
        </div>
      </div>

      {/* ── 다가오는 필수 일정 ── */}
      {upcomingMust.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold">놓치면 안 되는 일정</span>
          </div>
          <div className="space-y-2.5">
            {upcomingMust.map((e) => {
              const dday = getDday(e.month, e.deadline);
              const cat = CAT[e.category];
              return (
                <div key={e.id} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                  <span className={`w-8 h-8 rounded-lg ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                    <cat.icon className="w-4 h-4 text-white" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{e.title}</p>
                    <p className="text-[11px] text-slate-400">{e.month}월 {e.day}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    dday.urgent
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-white/20 text-white"
                  }`}>
                    {dday.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 필터 바 ── */}
      <div className="space-y-3">
        {/* 중요도 필터 */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex gap-1.5 flex-1 overflow-x-auto">
            {([
              { key: "all" as const, label: "전체", count: events.length },
              { key: "must" as const, label: "필수", count: events.filter(e => e.importance === "must").length },
              { key: "recommended" as const, label: "권장", count: events.filter(e => e.importance === "recommended").length },
              { key: "optional" as const, label: "선택", count: events.filter(e => e.importance === "optional").length },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => setImportanceFilter(f.key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                  importanceFilter === f.key
                    ? f.key === "must"
                      ? "bg-red-500 text-white"
                      : "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f.key === "must" && <Flame className="w-3 h-3" />}
                {f.label}
                <span className={`text-[10px] ${importanceFilter === f.key ? "opacity-70" : "text-slate-400"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
              categoryFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            전체
          </button>
          {Object.entries(CAT).map(([key, style]) => {
            const count = events.filter(e => e.category === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(key as CategoryFilter)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                  categoryFilter === key
                    ? `${style.bgSoft} ${style.color} ring-1 ${style.border}`
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 타임라인 뷰 ── */}
      {viewMode === "timeline" && (
        <div className="space-y-6">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-slate-200" />
              <p className="text-sm font-medium">해당하는 일정이 없어요</p>
              <p className="text-xs mt-1">필터를 변경해보세요</p>
            </div>
          )}

          {Object.entries(monthGroups).map(([monthStr, monthEvents]) => {
            const month = parseInt(monthStr, 10);
            const isCurrent = month === currentMonth;
            return (
              <div key={month}>
                {/* 월 헤더 */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm font-bold ${isCurrent ? "text-blue-600" : "text-slate-900"}`}>
                    {month}월
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">이번 달</span>
                  )}
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[11px] text-slate-400">{monthEvents.length}건</span>
                </div>

                {/* 이벤트 카드 */}
                <div className="space-y-2 pl-2 border-l-2 border-slate-100 ml-1">
                  {monthEvents.map((event) => {
                    const cat = CAT[event.category];
                    const imp = IMPORTANCE_STYLE[event.importance];
                    const ImpIcon = imp.icon;
                    const CatIcon = cat.icon;
                    const dday = getDday(event.month, event.deadline);
                    const isExpanded = expandedId === event.id;

                    return (
                      <div key={event.id} className="relative pl-4">
                        {/* 타임라인 도트 */}
                        <span className={`absolute -left-[5px] top-5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          dday.past ? "bg-slate-300" : cat.dot
                        }`} />

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : event.id)}
                          className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ${
                            dday.past
                              ? "bg-slate-50/80 border-slate-100 opacity-60"
                              : isExpanded
                              ? `${cat.bgSoft} ${cat.border} shadow-sm`
                              : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* 아이콘 */}
                            <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              dday.past ? "bg-slate-100" : cat.bgSoft
                            }`}>
                              <CatIcon className={`w-4 h-4 ${dday.past ? "text-slate-400" : cat.color}`} />
                            </span>

                            <div className="flex-1 min-w-0">
                              {/* 뱃지 행 */}
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${imp.bg} ${imp.color} ${imp.border} border`}>
                                  <ImpIcon className="w-2.5 h-2.5" />
                                  {imp.label}
                                </span>
                                <span className={`text-[10px] font-medium ${cat.color}`}>{cat.label}</span>
                                {dday.past && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> 완료
                                  </span>
                                )}
                              </div>

                              {/* 제목 */}
                              <h4 className="font-semibold text-slate-900 text-[13px] leading-snug">{event.title}</h4>

                              {/* 기간 */}
                              <div className="flex items-center gap-1.5 mt-1">
                                <Clock className="w-3 h-3 text-slate-300" />
                                <span className="text-[11px] text-slate-400">{event.month}월 {event.day}</span>
                              </div>
                            </div>

                            {/* D-day */}
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                                dday.past
                                  ? "bg-slate-100 text-slate-400"
                                  : dday.urgent
                                  ? "bg-red-500 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}>
                                {dday.text}
                              </span>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                            </div>
                          </div>

                          {/* 확장 내용 */}
                          <div className={`grid transition-all duration-300 ease-out ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="overflow-hidden">
                              <div className="pt-3 border-t border-slate-100 space-y-2">
                                <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                                {event.tip && (
                                  <div className="flex gap-2 bg-blue-50/80 rounded-lg p-3">
                                    <AlertTriangle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-blue-700 leading-relaxed">{event.tip}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 월별 그리드 뷰 ── */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {MONTH_NAMES.map((name, i) => {
            const month = i + 1;
            const monthEvents = filtered.filter((e) => e.month === month);
            const isCurrent = month === currentMonth;
            const hasMust = monthEvents.some((e) => e.importance === "must");
            const dday = monthEvents.length > 0 ? getDday(month, monthEvents[0].deadline) : null;

            return (
              <button
                key={month}
                onClick={() => {
                  setCategoryFilter("all");
                  setViewMode("timeline");
                }}
                className={`relative p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md group ${
                  isCurrent
                    ? "bg-blue-50 border-blue-200 ring-2 ring-blue-100"
                    : monthEvents.length > 0
                    ? "bg-white border-slate-100 hover:border-slate-200"
                    : "bg-slate-50/30 border-slate-100/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-base font-bold ${
                    isCurrent ? "text-blue-600" : monthEvents.length > 0 ? "text-slate-900" : "text-slate-300"
                  }`}>
                    {name}
                  </span>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  {hasMust && !isCurrent && <Flame className="w-3 h-3 text-red-400" />}
                </div>

                {monthEvents.length > 0 ? (
                  <>
                    <div className="flex gap-1 mb-1.5">
                      {monthEvents.slice(0, 4).map((e) => (
                        <span key={e.id} className={`w-1.5 h-1.5 rounded-full ${CAT[e.category].dot}`} />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {monthEvents.length}건
                      {hasMust && <span className="text-red-500 ml-1">필수 포함</span>}
                    </p>
                  </>
                ) : (
                  <p className="text-[11px] text-slate-300">일정 없음</p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ── 범례 ── */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">범례</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {Object.entries(IMPORTANCE_STYLE).map(([key, style]) => (
            <div key={key} className="flex items-center gap-1.5">
              <style.icon className={`w-3 h-3 ${style.color}`} />
              <span className="text-[11px] text-slate-600">{style.label} — {
                key === "must" ? "미신고 시 가산세" : key === "recommended" ? "해두면 좋음" : "상황에 따라"
              }</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1.5 border-t border-slate-200/60">
          {Object.entries(CAT).map(([, style]) => (
            <div key={style.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${style.dot}`} />
              <span className="text-[11px] text-slate-500">{style.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
