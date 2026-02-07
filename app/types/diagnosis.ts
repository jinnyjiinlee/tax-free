/**
 * 진단 관련 타입 정의
 */

export type BusinessType = "freelancer" | "online-shop" | "offline-store" | "other";
export type MonthlyRevenue = "under-500" | "500-2000" | "2000-5000" | "over-5000";
export type BusinessRegistration = "yes" | "no" | "unknown";
export type EmployeeCount = "none" | "1-4" | "5-plus";
export type InterestArea = "income-tax" | "vat" | "expenses" | "insurance" | "general";

export interface DiagnosisAnswers {
  businessType: BusinessType;
  monthlyRevenue: MonthlyRevenue;
  businessRegistration: BusinessRegistration;
  employeeCount: EmployeeCount;
  interestArea: InterestArea;
}

export interface DiagnosisResult {
  answers: DiagnosisAnswers;
  recommendation: string;
  estimatedIncomeTax: number; // 만원 단위
  estimatedVAT: number; // 만원 단위
  estimatedInsurance: number; // 만원 단위
  taxType: "general" | "simplified";
  reportSchedule: {
    incomeTax: string; // "5월"
    vat: string[]; // ["1월", "7월"]
  };
}
