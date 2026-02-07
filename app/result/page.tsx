"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import type { DiagnosisAnswers, DiagnosisResult } from "@/app/types/diagnosis";
import { calculateDiagnosisResult } from "@/app/utils/diagnosis";

/** 진단 결과 기반 핵심 인사이트 생성 */
function getInsights(result: DiagnosisResult) {
  const insights: { icon: React.ReactNode; label: string; text: string; type: "info" | "tip" | "warning" }[] = [];
  const { answers, detail } = result;
  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;

  // 과세 유형 안내
  if (result.taxType === "simplified") {
    insights.push({
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "과세 유형",
      text: "간이과세자로 분류돼요. 부가세 부담이 적고, 연매출 4,800만원 미만이면 부가세 납부도 면제됩니다.",
      type: "info",
    });
  } else if (result.taxType === "exempt") {
    insights.push({
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "과세 유형",
      text: "면세사업자로 부가가치세가 면제됩니다. 다만 매입세액 공제도 불가하니 유의하세요.",
      type: "info",
    });
  } else {
    insights.push({
      icon: <AlertTriangle className="w-4 h-4" />,
      label: "과세 유형",
      text: "일반과세자로 분류돼요. 매입세액 공제를 잘 활용하면 부가세를 크게 줄일 수 있어요.",
      type: "warning",
    });
  }

  // 경비율 안내
  if (detail) {
    insights.push({
      icon: <FileText className="w-4 h-4" />,
      label: "적용 경비율",
      text: `${answers.industry === "freelancer" ? "프리랜서" : "해당 업종"} 경비율 ${detail.expenseRate}%가 적용돼요. 추정 경비 약 ${detail.estimatedExpense.toLocaleString()}만원이 공제됩니다.`,
      type: "info",
    });
  }

  // 장부 관리 팁
  if (answers.bookkeeping === "none" || answers.bookkeeping === "unknown") {
    insights.push({
      icon: <Lightbulb className="w-4 h-4" />,
      label: "절세 포인트",
      text: "장부를 작성하면 기장세액공제(20%)를 받을 수 있어요. 간편장부부터 시작해보세요!",
      type: "tip",
    });
  }

  // 절세 가능성
  if (total > 0) {
    insights.push({
      icon: <TrendingDown className="w-4 h-4" />,
      label: "절세 가능성",
      text: `경비처리를 잘 활용하면 약 ${Math.floor(total * 0.15).toLocaleString()}만원까지 절세할 수 있어요.`,
      type: "tip",
    });
  }

  return insights;
}

/** 신고 일정 데이터 생성 */
function getScheduleItems(result: DiagnosisResult) {
  return [
    {
      label: "종합소득세",
      period: `${result.reportSchedule.incomeTax}월 1일 ~ 31일`,
      description: "전년도 소득에 대해 신고",
    },
    {
      label: "부가가치세",
      period: `${result.reportSchedule.vat.join(", ")}월 25일까지`,
      description:
        result.taxType === "simplified"
          ? "간이과세자 반기별 신고"
          : result.taxType === "exempt"
          ? "면세사업자는 부가세 면제"
          : "일반과세자 분기별 신고",
    },
  ];
}

export default function ResultPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<DiagnosisAnswers | null>(null);

  useEffect(() => {
    const stored =
      sessionStorage.getItem("diagnosisAnswers") ||
      localStorage.getItem("diagnosisAnswers");
    if (!stored) {
      router.replace("/diagnosis");
      return;
    }
    try {
      setAnswers(JSON.parse(stored) as DiagnosisAnswers);
    } catch {
      router.replace("/diagnosis");
    }
  }, [router]);

  if (!answers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md space-y-4 p-8">
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const result = calculateDiagnosisResult(answers);
  const total = result.estimatedIncomeTax + result.estimatedVAT + result.estimatedInsurance;
  const insights = getInsights(result);
  const scheduleItems = getScheduleItems(result);

  const taxItems = [
    {
      icon: <Calculator className="w-5 h-5" />,
      label: "종합소득세",
      sublabel: result.detail ? `세율 ${result.detail.taxBracket}` : "",
      value: result.estimatedIncomeTax,
      bgClass: "bg-blue-50 border-blue-100 text-blue-600",
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      label: "부가가치세",
      sublabel: result.taxType === "exempt" ? "면세" : "",
      value: result.estimatedVAT,
      bgClass: "bg-violet-50 border-violet-100 text-violet-600",
    },
    {
      icon: <HeartHandshake className="w-5 h-5" />,
      label: "4대보험",
      sublabel: answers.employeeCount > 0 ? `직원 ${answers.employeeCount}명 기준` : "직원 없음",
      value: result.estimatedInsurance,
      bgClass: "bg-emerald-50 border-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <Link
          href="/diagnosis"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium mb-6 min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4" />
          진단 다시하기
        </Link>

        {/* 타이틀 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">진단 결과</h1>
          <p className="text-slate-600 text-sm leading-relaxed">{result.recommendation}</p>
        </div>

        {/* 연간 총 세금 요약 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
          <div className="text-center mb-6">
            <p className="text-sm text-slate-500 mb-1">연간 예상 총 세금</p>
            <p className="text-4xl font-bold text-slate-900">
              약 {total.toLocaleString()}<span className="text-xl font-medium text-slate-500">만원</span>
            </p>
            <p className="text-sm text-slate-400 mt-1">
              월 평균 약 {Math.floor(total / 12).toLocaleString()}만원
            </p>
          </div>

          {/* 세금 항목별 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {taxItems.map((item) => (
              <div key={item.label} className={`rounded-xl p-4 border ${item.bgClass}`}>
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {item.value.toLocaleString()}<span className="text-sm font-normal text-slate-500">만원</span>
                </div>
                {item.sublabel && (
                  <p className="text-xs text-slate-400 mt-1">{item.sublabel}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 계산 상세 (detail이 있을 때) */}
        {result.detail && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              계산 상세
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-slate-500">연매출</span>
                <span className="font-medium text-slate-900">{result.detail.annualRevenue.toLocaleString()}만원</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">적용 경비율</span>
                <span className="font-medium text-slate-900">{result.detail.expenseRate}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">추정 경비</span>
                <span className="font-medium text-slate-900">-{result.detail.estimatedExpense.toLocaleString()}만원</span>
              </div>
              <div className="flex justify-between py-2 border-t border-slate-100">
                <span className="text-slate-500">과세표준</span>
                <span className="font-semibold text-slate-900">{result.detail.taxableIncome.toLocaleString()}만원</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">적용 세율</span>
                <span className="font-medium text-blue-600">{result.detail.taxBracket}</span>
              </div>
              {result.detail.taxCredit > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">기장세액공제</span>
                  <span className="font-medium text-emerald-600">-{result.detail.taxCredit.toLocaleString()}만원</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 인사이트 카드 */}
        <div className="space-y-3 mb-4">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border flex gap-3 ${
                insight.type === "tip"
                  ? "bg-amber-50/50 border-amber-100"
                  : insight.type === "warning"
                  ? "bg-orange-50/50 border-orange-100"
                  : "bg-blue-50/50 border-blue-100"
              }`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  insight.type === "tip"
                    ? "bg-amber-100 text-amber-600"
                    : insight.type === "warning"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {insight.icon}
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">{insight.label}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 신고 일정 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarClock className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">다가오는 신고 일정</h2>
          </div>
          <div className="space-y-3">
            {scheduleItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="text-sm text-blue-600 font-semibold">{item.period}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors min-h-[44px]"
          >
            <BarChart3 className="w-5 h-5" />
            상세 대시보드
          </Link>
          <Link
            href="/chat"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            <MessageCircle className="w-5 h-5" />
            AI 상담하기
          </Link>
        </div>
      </div>
    </div>
  );
}
