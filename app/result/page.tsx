"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, BarChart3, Calculator, Receipt, HeartHandshake } from "lucide-react";
import type { DiagnosisAnswers } from "@/app/types/diagnosis";
import { calculateDiagnosisResult } from "@/app/utils/diagnosis";

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
        <div className="text-slate-500 text-sm">로딩 중...</div>
      </div>
    );
  }

  const result = calculateDiagnosisResult(answers);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <Link
          href="/diagnosis"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mb-6 min-h-[44px] items-center"
        >
          <ChevronLeft className="w-4 h-4" />
          진단 다시하기
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          진단 결과
        </h1>
        <p className="text-slate-600 text-sm mb-8">{result.recommendation}</p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            예상 세금
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Calculator className="w-4 h-4" />
                <span className="text-sm font-medium">종합소득세</span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                약 {result.estimatedIncomeTax.toLocaleString()}만원
              </div>
            </div>
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Receipt className="w-4 h-4" />
                <span className="text-sm font-medium">부가가치세</span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                약 {result.estimatedVAT.toLocaleString()}만원
              </div>
            </div>
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <HeartHandshake className="w-4 h-4" />
                <span className="text-sm font-medium">4대보험</span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                약 {result.estimatedInsurance.toLocaleString()}만원
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            종합소득세 {result.reportSchedule.incomeTax}월, 부가가치세{" "}
            {result.reportSchedule.vat.join(", ")}월 신고
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 min-h-[44px]"
          >
            <BarChart3 className="w-5 h-5" />
            대시보드 보기
          </Link>
          <Link
            href="/chat"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 min-h-[44px]"
          >
            AI 상담하기
          </Link>
        </div>
      </div>
    </div>
  );
}
