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

export default function DashboardPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge" | "calendar">("chat");

  useEffect(() => {
    // 세션 스토리지에서 진단 답변 가져오기
    const stored = sessionStorage.getItem("diagnosisAnswers");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#6e6e73] font-normal">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-[#6e6e73] hover:text-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">홈으로</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">T</div>
            <span className="font-semibold text-[#1d1d1f]">텍스프리</span>
          </div>
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2 tracking-tight">맞춤 세무 대시보드</h1>
          <p className="text-[#6e6e73] font-normal">진단 결과를 바탕으로 준비된 정보입니다</p>
        </div>

        {/* 진단 결과 요약 카드 */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-200/50 border border-blue-100 p-6 mb-6 border-l-4 border-l-blue-500">
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">진단 결과</h2>
          <p className="text-lg text-[#424245] mb-6 font-normal">{result.recommendation}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
              <div className="text-sm text-[#86868b] mb-1">예상 종합소득세</div>
              <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                {result.estimatedIncomeTax.toLocaleString()}만원
              </div>
            </div>
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
              <div className="text-sm text-[#86868b] mb-1">예상 부가가치세</div>
              <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                {result.estimatedVAT.toLocaleString()}만원
              </div>
            </div>
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
              <div className="text-sm text-[#86868b] mb-1">예상 4대보험</div>
              <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                {result.estimatedInsurance.toLocaleString()}만원
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-100">
            <div className="text-sm text-[#6e6e73]">
              <span className="font-medium text-[#424245]">신고 일정:</span> 종합소득세 {result.reportSchedule.incomeTax}월, 
              부가가치세 {result.reportSchedule.vat.join(", ")}월
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

        {/* 탭 섹션 */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-200/50 border border-blue-100 overflow-hidden">
          {/* 탭 헤더 */}
          <div className="flex border-b border-blue-100">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "chat"
                  ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-[#86868b] hover:text-blue-600 hover:bg-blue-50/30"
              }`}
            >
              AI 상담
            </button>
            <button
              onClick={() => setActiveTab("knowledge")}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "knowledge"
                  ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-[#86868b] hover:text-blue-600 hover:bg-blue-50/30"
              }`}
            >
              기초지식
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === "calendar"
                  ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-[#86868b] hover:text-blue-600 hover:bg-blue-50/30"
              }`}
            >
              세무 캘린더
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === "chat" && <AIChatPanel diagnosisResult={result} />}
            {activeTab === "knowledge" && <TaxKnowledgeAccordion />}
            {activeTab === "calendar" && (
              <div className="text-center py-12 text-[#6e6e73]">
                <p className="mb-4 font-normal">세무 캘린더 기능은 준비 중입니다.</p>
                <div className="bg-blue-50/50 rounded-xl p-6 inline-block">
                  <div className="text-sm space-y-2.5 text-left text-[#424245]">
                    <div className="flex items-center gap-2">
                      <IconCalendar />
                      <span>종합소득세 신고: {result.reportSchedule.incomeTax}월 1일~31일</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCalendar />
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
