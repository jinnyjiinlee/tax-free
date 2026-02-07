"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TaxFreeCharacter from "@/app/components/TaxFreeCharacter";
import {
  ChevronLeft,
  BarChart3,
  Calculator,
  Receipt,
  HeartHandshake,
  TrendingDown,
  CalendarClock,
  Lightbulb,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Percent,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { DiagnosisAnswers, DiagnosisResult } from "@/app/types/diagnosis";
import { calculateDiagnosisResult } from "@/app/utils/diagnosis";

/* ── 인사이트 생성 ── */
function getInsights(result: DiagnosisResult) {
  const insights: { icon: React.ReactNode; label: string; text: string; type: "info" | "tip" | "warning" }[] = [];
  const { answers, detail } = result;
  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;

  if (result.taxType === "simplified") {
    insights.push({
      icon: <CheckCircle2 className="w-4 h-4" />, label: "과세 유형",
      text: "간이과세자로 분류돼요. 부가세 부담이 적고, 연매출 4,800만원 미만이면 부가세 납부도 면제됩니다.",
      type: "info",
    });
  } else if (result.taxType === "exempt") {
    insights.push({
      icon: <CheckCircle2 className="w-4 h-4" />, label: "과세 유형",
      text: "면세사업자로 부가가치세가 면제됩니다. 다만 매입세액 공제도 불가하니 유의하세요.",
      type: "info",
    });
  } else {
    insights.push({
      icon: <AlertTriangle className="w-4 h-4" />, label: "과세 유형",
      text: "일반과세자로 분류돼요. 매입세액 공제를 잘 활용하면 부가세를 크게 줄일 수 있어요.",
      type: "warning",
    });
  }

  if (detail) {
    insights.push({
      icon: <FileText className="w-4 h-4" />, label: "적용 경비율",
      text: `해당 업종 경비율 ${detail.expenseRate}%가 적용돼요. 추정 경비 약 ${detail.estimatedExpense.toLocaleString()}만원이 공제됩니다.`,
      type: "info",
    });
  }

  if (answers.bookkeeping === "none" || answers.bookkeeping === "unknown") {
    insights.push({
      icon: <Lightbulb className="w-4 h-4" />, label: "절세 포인트",
      text: "장부를 작성하면 기장세액공제(20%)를 받을 수 있어요. 간편장부부터 시작해보세요!",
      type: "tip",
    });
  }

  if (total > 0) {
    insights.push({
      icon: <TrendingDown className="w-4 h-4" />, label: "절세 가능성",
      text: `경비처리를 잘 활용하면 약 ${Math.floor(total * 0.15).toLocaleString()}만원까지 절세할 수 있어요.`,
      type: "tip",
    });
  }

  return insights;
}

/* ── 비율 바 ── */
function RatioBar({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total === 0) return null;
  return (
    <div className="space-y-2">
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex">
        {items.map((item) => {
          const pct = (item.value / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={item.label}
              className={`h-full ${item.color} first:rounded-l-full last:rounded-r-full transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[11px]">
        {items.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.label} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-slate-500">{item.label} {pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<DiagnosisAnswers | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const stored =
      sessionStorage.getItem("diagnosisAnswers") ||
      localStorage.getItem("diagnosisAnswers");
    if (!stored) { router.replace("/diagnosis"); return; }
    try { setAnswers(JSON.parse(stored) as DiagnosisAnswers); }
    catch { router.replace("/diagnosis"); }
  }, [router]);

  if (!answers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full max-w-md space-y-4 p-8">
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const result = calculateDiagnosisResult(answers);
  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;
  const monthlyAvg = Math.floor(total / 12);
  const insights = getInsights(result);
  const { detail } = result;

  const taxItems = [
    { label: "종합소득세", icon: Calculator, value: result.estimatedIncomeTax, sub: detail ? `세율 ${detail.taxBracket}` : "", color: "blue" },
    { label: "부가가치세", icon: Receipt, value: result.estimatedVAT, sub: result.taxType === "exempt" ? "면세" : result.taxType === "simplified" ? "간이과세" : "일반과세", color: "violet" },
    { label: "4대보험", icon: HeartHandshake, value: result.estimatedInsurance, sub: answers.employeeCount > 0 ? `직원 ${answers.employeeCount}명` : "직원 없음", color: "emerald" },
  ];

  const colorMap: Record<string, { bg: string; bgSoft: string; border: string; text: string; bar: string }> = {
    blue: { bg: "bg-blue-500", bgSoft: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", bar: "bg-blue-500" },
    violet: { bg: "bg-violet-500", bgSoft: "bg-violet-50", border: "border-violet-100", text: "text-violet-600", bar: "bg-violet-500" },
    emerald: { bg: "bg-emerald-500", bgSoft: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", bar: "bg-emerald-500" },
  };

  const insightStyleMap = {
    tip: { bg: "bg-gradient-to-r from-amber-50 to-yellow-50", border: "border-amber-200/60", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    warning: { bg: "bg-gradient-to-r from-orange-50 to-red-50", border: "border-orange-200/60", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
    info: { bg: "bg-gradient-to-r from-blue-50 to-indigo-50", border: "border-blue-200/60", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      {/* 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/diagnosis" className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-medium min-h-[44px] transition-colors">
            <ChevronLeft className="w-4 h-4" />
            다시 진단
          </Link>
          <div className="flex items-center gap-2">
            <TaxFreeCharacter size="sm" animate={false} className="!w-8 !h-8" />
            <span className="font-bold text-slate-900 text-sm">텍스프리</span>
          </div>
        </div>

        {/* 타이틀 */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" />
            진단 완료
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">진단 결과</h1>
          <p className="text-slate-500 text-sm leading-relaxed">{result.recommendation}</p>
        </div>

        {/* ── 총 세금 히어로 카드 ── */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 mb-4 text-white relative overflow-hidden">
          {/* 장식 */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative">
            <p className="text-sm text-slate-400 mb-1">연간 예상 총 세금 + 보험료</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs text-slate-500">약</span>
              <span className="text-5xl font-bold tracking-tight">{total.toLocaleString()}</span>
              <span className="text-xl text-slate-400">만원</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">월 평균 약 <span className="text-white font-semibold">{monthlyAvg.toLocaleString()}만원</span></p>

            {/* 세금 항목 카드 */}
            <div className="grid grid-cols-3 gap-2.5">
              {taxItems.map((item) => {
                const c = colorMap[item.color];
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`w-6 h-6 rounded-md ${c.bg} flex items-center justify-center`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">{item.label}</span>
                    </div>
                    <p className="text-lg font-bold text-white">{item.value.toLocaleString()}<span className="text-xs font-normal text-slate-500">만원</span></p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* 비율 바 */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <RatioBar items={taxItems.map((t) => ({ label: t.label, value: t.value, color: colorMap[t.color].bar }))} />
            </div>
          </div>
        </div>

        {/* ── 계산 상세 (접이식) ── */}
        {detail && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <button
              onClick={() => setShowDetail(!showDetail)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-blue-600" />
                </span>
                <span className="font-semibold text-slate-900 text-sm">종합소득세 계산 과정</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showDetail ? "rotate-180" : ""}`} />
            </button>

            <div className={`grid transition-all duration-500 ease-out ${showDetail ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="px-6 pb-5 space-y-0">
                  {[
                    { label: "연 매출", value: `${detail.annualRevenue.toLocaleString()}만원`, type: "normal" as const },
                    { label: `추정 경비 (경비율 ${detail.expenseRate}%)`, value: `-${detail.estimatedExpense.toLocaleString()}만원`, type: "minus" as const },
                    { label: "기본 인적공제", value: "-150만원", type: "minus" as const },
                    { label: "과세표준", value: `${detail.taxableIncome.toLocaleString()}만원`, type: "highlight" as const },
                    { label: "적용 세율", value: detail.taxBracket, type: "accent" as const },
                    { label: "산출세액", value: `${detail.incomeTaxBeforeCredit.toLocaleString()}만원`, type: "normal" as const },
                    ...(detail.taxCredit > 0 ? [{ label: "기장세액공제", value: `-${detail.taxCredit.toLocaleString()}만원`, type: "plus" as const }] : []),
                    { label: "지방소득세 (10%)", value: `+${detail.localIncomeTax.toLocaleString()}만원`, type: "normal" as const },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-3 ${
                        row.type === "highlight"
                          ? "bg-blue-50 rounded-lg px-3 -mx-1 my-1"
                          : "border-b border-slate-50"
                      }`}
                    >
                      <span className={`text-sm ${row.type === "highlight" ? "font-semibold text-blue-700" : "text-slate-500"}`}>
                        {row.label}
                      </span>
                      <span className={`text-sm font-semibold ${
                        row.type === "minus" ? "text-red-500"
                        : row.type === "plus" ? "text-emerald-600"
                        : row.type === "highlight" ? "text-blue-700"
                        : row.type === "accent" ? "text-blue-600"
                        : "text-slate-900"
                      }`}>
                        {row.value}
                      </span>
                    </div>
                  ))}

                  {/* 최종 */}
                  <div className="flex justify-between items-center py-4 mt-2 bg-slate-900 text-white rounded-xl px-4 -mx-1">
                    <span className="font-semibold text-sm">최종 종합소득세</span>
                    <span className="text-lg font-bold">{result.estimatedIncomeTax.toLocaleString()}만원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 인사이트 카드 ── */}
        <div className="space-y-3 mb-4">
          {insights.map((insight, i) => {
            const style = insightStyleMap[insight.type];
            return (
              <div key={i} className={`rounded-2xl p-4 border flex gap-3.5 ${style.bg} ${style.border}`}>
                <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${style.iconBg} ${style.iconColor}`}>
                  {insight.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{insight.label}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{insight.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 신고 일정 ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900 text-sm">신고 일정</h2>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "종합소득세", period: `${result.reportSchedule.incomeTax}월 1일 ~ 31일`, desc: "전년도 소득 확정신고", color: "blue" },
              { label: "부가가치세", period: `${result.reportSchedule.vat.join(", ")}월 25일까지`, desc: result.taxType === "simplified" ? "간이과세자 반기별" : result.taxType === "exempt" ? "면세 - 해당없음" : "일반과세자 분기별", color: "violet" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className={`w-2.5 h-2.5 rounded-full bg-${s.color}-500 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{s.label}</span>
                    <span className="text-xs text-slate-400">{s.desc}</span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium">{s.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="space-y-3 mb-6">
          <Link
            href="/dashboard"
            className="group flex items-center justify-between w-full px-6 py-4.5 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 min-h-[56px]"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-semibold">상세 대시보드 보기</p>
                <p className="text-[11px] text-slate-400 font-normal">차트, AI 상담, 세무 캘린더까지</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/chat"
            className="group flex items-center justify-between w-full px-6 py-4.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[56px]"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-semibold">AI 세무 상담</p>
                <p className="text-[11px] text-slate-400 font-normal">궁금한 점을 바로 물어보세요</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 면책 */}
        <p className="text-center text-[11px] text-slate-400 leading-relaxed pb-4">
          위 결과는 추정치이며 실제 세금과 다를 수 있습니다.<br />
          정확한 세무 상담은 국세청(126) 또는 세무사에게 문의하세요.
        </p>
      </div>
    </div>
  );
}
