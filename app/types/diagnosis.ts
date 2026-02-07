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

export type BusinessAge = "under-1y" | "1-3y" | "3plus";
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
  revenue: number;           // 연 매출 (만원 단위)
  employeeCount: number;     // 직원 수 (명)
  businessAge: BusinessAge;
  bookkeeping: Bookkeeping;
  interestArea: InterestArea;
}

export interface DiagnosisResult {
  answers: DiagnosisAnswers;
  recommendation: string;
  estimatedIncomeTax: number;   // 만원
  estimatedVAT: number;         // 만원
  estimatedInsurance: number;   // 만원
  taxType: "general" | "simplified" | "exempt";
  reportSchedule: { incomeTax: string; vat: string[] };
  detail: DiagnosisDetail;      // 상세 계산 내역
}

/** 계산 과정 상세 */
export interface DiagnosisDetail {
  annualRevenue: number;        // 연매출 (만원)
  expenseRate: number;          // 적용 경비율 (%)
  estimatedExpense: number;     // 추정 경비 (만원)
  taxableIncome: number;        // 과세표준 (만원)
  taxBracket: string;           // 적용 세율 구간
  incomeTaxBeforeCredit: number;// 산출세액 (만원)
  taxCredit: number;            // 세액공제 (만원)
  localIncomeTax: number;       // 지방소득세 (만원)
}
