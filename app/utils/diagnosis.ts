import { DiagnosisAnswers, DiagnosisResult, MonthlyRevenue } from "@/app/types/diagnosis";

/**
 * 기본 진단 결과 (챗봇 바로가기용)
 */
export function getDefaultDiagnosisResult(): DiagnosisResult {
  return {
    answers: {
      businessType: "freelancer",
      monthlyRevenue: "500-2000",
      businessRegistration: "unknown",
      employeeCount: "none",
      interestArea: "general",
    },
    recommendation: "맞춤 진단을 받으시면 더 정확한 상담이 가능합니다.",
    estimatedIncomeTax: 0,
    estimatedVAT: 0,
    estimatedInsurance: 0,
    taxType: "general",
    reportSchedule: { incomeTax: "5월", vat: ["1월", "3월", "5월", "7월", "9월", "11월"] },
  };
}

/**
 * 진단 답변을 기반으로 결과 생성
 */
export function calculateDiagnosisResult(answers: DiagnosisAnswers): DiagnosisResult {
  const { businessType, monthlyRevenue, businessRegistration, employeeCount } = answers;

  const monthlyRevenueMap: Record<MonthlyRevenue, number> = {
    "under-500": 300,
    "500-2000": 1250,
    "2000-5000": 3500,
    "over-5000": 6000,
  };
  const monthlyRevenueAmount = monthlyRevenueMap[monthlyRevenue];
  const annualRevenue = monthlyRevenueAmount * 12;

  const isSimplified = annualRevenue <= 8800;
  const taxType = isSimplified ? "simplified" : "general";

  let estimatedIncomeTax = 0;
  let estimatedVAT = 0;
  let estimatedInsurance = 0;

  if (isSimplified) {
    estimatedVAT = Math.floor(annualRevenue * 0.02);
    const estimatedIncome = Math.floor(annualRevenue * 0.7);
    estimatedIncomeTax = Math.floor(estimatedIncome * 0.066);
  } else {
    estimatedVAT = Math.floor(annualRevenue * 0.1);
    const estimatedIncome = Math.floor(annualRevenue * 0.7);
    estimatedIncomeTax = Math.floor(estimatedIncome * 0.066);
  }

  estimatedInsurance = Math.floor(monthlyRevenueAmount * 0.1 * 12);

  const businessTypeName = {
    freelancer: "프리랜서",
    "online-shop": "온라인쇼핑몰",
    "offline-store": "오프라인매장",
    other: "기타",
  }[businessType];

  const revenueText = {
    "under-500": "500만원 이하",
    "500-2000": "500~2000만원",
    "2000-5000": "2000~5000만원",
    "over-5000": "5000만원 이상",
  }[monthlyRevenue];

  const taxTypeText = isSimplified ? "간이과세자" : "일반과세자";
  const recommendation = `월 매출 ${revenueText} ${businessTypeName} → ${taxTypeText} 추천`;

  return {
    answers,
    recommendation,
    estimatedIncomeTax,
    estimatedVAT,
    estimatedInsurance,
    taxType,
    reportSchedule: { incomeTax: "5월", vat: ["1월", "3월", "5월", "7월", "9월", "11월"] },
  };
}
