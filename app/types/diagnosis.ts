/**
 * 진단 관련 타입 정의
 */

export type Industry =
  | "food-store"
  | "retail"
  | "service"
  | "freelancer"
  | "education"
  | "other";

export type TaxStatus =
  | "simplified"
  | "general"
  | "exempt"
  | "unknown";

export type RevenueRange =
  | "under-24M"
  | "24-75M"
  | "75-150M"
  | "over-150M";

export type BusinessAge = "under-1y" | "1-3y" | "3plus";
export type EmployeeCount = "none" | "1-4" | "5-plus";
export type Bookkeeping =
  | "simple"
  | "accountant"
  | "none"
  | "unknown";
export type InterestArea =
  | "income-tax"
  | "vat"
  | "expenses"
  | "insurance"
  | "general";

export interface DiagnosisAnswers {
  industry: Industry;
  taxStatus: TaxStatus;
  revenue: RevenueRange;
  businessAge: BusinessAge;
  employeeCount: EmployeeCount;
  bookkeeping: Bookkeeping;
  interestArea: InterestArea;
}

export interface DiagnosisResult {
  answers: DiagnosisAnswers;
  recommendation: string;
  estimatedIncomeTax: number;
  estimatedVAT: number;
  estimatedInsurance: number;
  taxType: "general" | "simplified";
  reportSchedule: { incomeTax: string; vat: string[] };
}
