import type { DiagnosisAnswers, DiagnosisResult, RevenueRange } from "@/app/types/diagnosis";

const REVENUE_AMOUNT: Record<RevenueRange, number> = {
  "under-24M": 1500,
  "24-75M": 4500,
  "75-150M": 11250,
  "over-150M": 20000,
};

/**
 * 기본 진단 결과 (챗봇 바로가기용)
 */
export function getDefaultDiagnosisResult(): DiagnosisResult {
  return calculateDiagnosisResult({
    industry: "freelancer",
    taxStatus: "unknown",
    revenue: "24-75M",
    businessAge: "1-3y",
    employeeCount: "none",
    bookkeeping: "unknown",
    interestArea: "general",
  });
}

/**
 * 진단 답변을 기반으로 결과 생성
 */
export function calculateDiagnosisResult(
  answers: DiagnosisAnswers
): DiagnosisResult {
  const annualRevenue = REVENUE_AMOUNT[answers.revenue];
  const isSimplified =
    answers.taxStatus === "simplified" ||
    (answers.taxStatus === "unknown" && annualRevenue <= 8800);
  const taxType = isSimplified ? "simplified" : "general";

  let estimatedIncomeTax = 0;
  let estimatedVAT = 0;
  let estimatedInsurance = 0;

  if (isSimplified) {
    estimatedVAT = Math.floor(annualRevenue * 0.02);
  } else {
    estimatedVAT = Math.floor(annualRevenue * 0.1);
  }

  const estimatedIncome = Math.floor(annualRevenue * 0.7);
  estimatedIncomeTax = Math.floor(estimatedIncome * 0.066);
  estimatedInsurance =
    answers.employeeCount === "none"
      ? 0
      : Math.floor((annualRevenue / 12) * 0.1 * 12);

  const industryLabels: Record<string, string> = {
    "food-store": "음식점/카페",
    retail: "소매/쇼핑몰",
    service: "서비스업",
    freelancer: "프리랜서",
    education: "학원/교육",
    other: "기타",
  };

  const revenueLabels: Record<RevenueRange, string> = {
    "under-24M": "2,400만원 이하",
    "24-75M": "2,400~7,500만원",
    "75-150M": "7,500만~1.5억",
    "over-150M": "1.5억 이상",
  };

  const taxTypeText = isSimplified ? "간이과세자" : "일반과세자";
  const recommendation = `${industryLabels[answers.industry] || "기타"} · 연매출 ${revenueLabels[answers.revenue]} → ${taxTypeText}로 추정됩니다.`;

  return {
    answers,
    recommendation,
    estimatedIncomeTax,
    estimatedVAT,
    estimatedInsurance,
    taxType,
    reportSchedule: {
      incomeTax: "5월",
      vat: ["1월", "3월", "5월", "7월", "9월", "11월"],
    },
  };
}
