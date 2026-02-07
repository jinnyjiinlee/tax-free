import type {
  DiagnosisAnswers,
  DiagnosisResult,
  DiagnosisDetail,
  Industry,
} from "@/app/types/diagnosis";

/* ──────────────────────────────────────────
   2024 귀속 종합소득세 누진세율표
   (소득세법 제55조)
────────────────────────────────────────── */
const TAX_BRACKETS = [
  { min: 0,       max: 1400,   rate: 0.06, deduction: 0 },
  { min: 1400,    max: 5000,   rate: 0.15, deduction: 126 },
  { min: 5000,    max: 8800,   rate: 0.24, deduction: 576 },
  { min: 8800,    max: 15000,  rate: 0.35, deduction: 1544 },
  { min: 15000,   max: 30000,  rate: 0.38, deduction: 1994 },
  { min: 30000,   max: 50000,  rate: 0.40, deduction: 2594 },
  { min: 50000,   max: 100000, rate: 0.42, deduction: 3594 },
  { min: 100000,  max: Infinity, rate: 0.45, deduction: 6594 },
];

/* ──────────────────────────────────────────
   업종별 단순경비율 / 기준경비율
   (국세청 고시, 주요 업종 대표값)
   - simple: 단순경비율 (소규모, 신규)
   - standard: 기준경비율 (일정 규모 이상)
────────────────────────────────────────── */
const EXPENSE_RATES: Record<Industry, { simple: number; standard: number }> = {
  "food-store":  { simple: 89.7, standard: 18.0 },  // 음식점
  "retail":      { simple: 91.5, standard: 12.0 },  // 소매업
  "service":     { simple: 63.1, standard: 22.4 },  // 서비스업
  "freelancer":  { simple: 64.1, standard: 20.6 },  // 프리랜서 (인적용역)
  "education":   { simple: 73.2, standard: 24.1 },  // 교육서비스
  "other":       { simple: 61.7, standard: 20.0 },  // 기타
};

/* 단순경비율 적용 기준 (직전 연도 수입금액, 만원) */
const SIMPLE_EXPENSE_THRESHOLD: Record<Industry, number> = {
  "food-store":  6000,   // 음식업: 6천만원
  "retail":      6000,   // 소매: 6천만원
  "service":     3600,   // 서비스: 3,600만원
  "freelancer":  2400,   // 인적용역: 2,400만원
  "education":   3600,   // 교육: 3,600만원
  "other":       3600,   // 기타: 3,600만원
};

/* 간이과세자 업종별 부가세율 */
const SIMPLIFIED_VAT_RATES: Record<Industry, number> = {
  "food-store":  0.015,
  "retail":      0.01,
  "service":     0.02,
  "freelancer":  0.03,
  "education":   0.02,
  "other":       0.02,
};

/* ──────────────────────────────────────────
   유틸리티
────────────────────────────────────────── */

/**
 * 문자열로 저장된 매출값을 만원 단위 숫자로 변환
 * 예: "under-24M" → 2400, "50M" → 5000, "1.5억" → 15000, "3000" → 3000
 */
function parseRevenueString(value: unknown): number {
  if (value === null || value === undefined) return 0;

  const str = String(value).trim().toLowerCase();

  // 순수 숫자 문자열
  const plainNum = Number(str.replace(/,/g, ""));
  if (!isNaN(plainNum) && plainNum >= 0) return plainNum;

  // "under-XXM" / "over-XXM" 패턴 (예: "under-24M" → 2400만원)
  const mPattern = str.match(/(\d+\.?\d*)m/i);
  if (mPattern) {
    return Math.floor(parseFloat(mPattern[1]) * 100); // M = 백만원 → 만원 단위
  }

  // "X억" 패턴
  const ukPattern = str.match(/(\d+\.?\d*)억/);
  if (ukPattern) {
    return Math.floor(parseFloat(ukPattern[1]) * 10000);
  }

  // "X천만" 패턴
  const cheonPattern = str.match(/(\d+\.?\d*)천만/);
  if (cheonPattern) {
    return Math.floor(parseFloat(cheonPattern[1]) * 1000);
  }

  return 0;
}

/* ──────────────────────────────────────────
   계산 함수
────────────────────────────────────────── */

/** 종합소득세 산출세액 계산 */
function calculateIncomeTax(taxableIncome: number): {
  tax: number;
  bracket: string;
} {
  if (taxableIncome <= 0) return { tax: 0, bracket: "과세소득 없음" };

  for (const b of TAX_BRACKETS) {
    if (taxableIncome <= b.max) {
      const tax = Math.floor(taxableIncome * b.rate - b.deduction);
      const bracket = `${b.rate * 100}% (${b.min.toLocaleString()}~${b.max === Infinity ? "" : b.max.toLocaleString()}만원)`;
      return { tax: Math.max(tax, 0), bracket };
    }
  }
  const last = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return {
    tax: Math.floor(taxableIncome * last.rate - last.deduction),
    bracket: `${last.rate * 100}%`,
  };
}

/** 적용 경비율 결정 */
function getExpenseRate(
  industry: Industry,
  revenue: number,
  businessAge: string
): number {
  const threshold = SIMPLE_EXPENSE_THRESHOLD[industry];
  const rates = EXPENSE_RATES[industry];

  // 신규사업자(1년 미만)이거나 매출이 기준 이하면 단순경비율
  if (businessAge === "under-1y" || revenue <= threshold) {
    return rates.simple;
  }
  return rates.standard;
}

/** 4대보험 추정 (사업주 부담분, 월 기준 × 12) */
function calculateInsurance(
  employeeCount: number,
  monthlyPayPerEmployee: number = 250 // 기본 월급 250만원 가정
): number {
  if (employeeCount <= 0) return 0;

  // 사업주 부담: 국민연금 4.5% + 건강보험 3.545% + 장기요양 0.4591% + 고용보험 0.9% = 약 9.4%
  const employerRate = 0.094;
  const annualInsurance = Math.floor(
    monthlyPayPerEmployee * employerRate * 12 * employeeCount
  );
  return annualInsurance;
}

/* ──────────────────────────────────────────
   메인 계산 함수
────────────────────────────────────────── */

export function calculateDiagnosisResult(
  answers: DiagnosisAnswers
): DiagnosisResult {
  const { industry, taxStatus, employeeCount: rawEmployeeCount, businessAge, bookkeeping } = answers;

  // revenue / employeeCount가 문자열로 저장된 경우 안전하게 숫자로 변환
  const revenue = typeof answers.revenue === "number" && !isNaN(answers.revenue)
    ? answers.revenue
    : parseRevenueString(answers.revenue);
  const employeeCount = typeof rawEmployeeCount === "number" && !isNaN(rawEmployeeCount)
    ? rawEmployeeCount
    : (parseInt(String(rawEmployeeCount), 10) || 0);

  // 1. 과세 유형 결정
  const isExempt = taxStatus === "exempt";
  const isSimplified =
    !isExempt &&
    (taxStatus === "simplified" ||
      (taxStatus === "unknown" && revenue <= 8000));
  const taxType = isExempt ? "exempt" : isSimplified ? "simplified" : "general";

  // 2. 경비율 결정 & 추정 경비
  const expenseRate = getExpenseRate(industry, revenue, businessAge);
  const estimatedExpense = Math.floor(revenue * (expenseRate / 100));

  // 3. 과세표준 = 매출 - 경비 - 기본공제(150만원)
  const basicDeduction = 150; // 인적공제 기본 150만원
  const taxableIncome = Math.max(revenue - estimatedExpense - basicDeduction, 0);

  // 4. 종합소득세 산출
  const { tax: incomeTaxBeforeCredit, bracket: taxBracket } =
    calculateIncomeTax(taxableIncome);

  // 5. 세액공제
  let taxCredit = 0;
  if (bookkeeping === "simple") {
    // 간편장부 기장세액공제: 산출세액의 20%, 최대 100만원
    taxCredit = Math.min(Math.floor(incomeTaxBeforeCredit * 0.2), 100);
  } else if (bookkeeping === "accountant") {
    // 복식부기 기장세액공제: 산출세액의 20%, 최대 100만원
    taxCredit = Math.min(Math.floor(incomeTaxBeforeCredit * 0.2), 100);
  }

  const estimatedIncomeTax = Math.max(incomeTaxBeforeCredit - taxCredit, 0);

  // 6. 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor(estimatedIncomeTax * 0.1);

  // 7. 부가가치세
  let estimatedVAT = 0;
  if (!isExempt) {
    if (isSimplified) {
      // 간이과세자: 매출 × 업종별 부가세율
      const vatRate = SIMPLIFIED_VAT_RATES[industry] || 0.02;
      estimatedVAT = Math.floor(revenue * vatRate);
    } else {
      // 일반과세자: 매출의 10% - 매입세액(매출의 약 5~7% 추정)
      const outputVAT = Math.floor(revenue * 0.1);
      const inputVAT = Math.floor(revenue * 0.06); // 매입비율 60% 추정
      estimatedVAT = Math.max(outputVAT - inputVAT, 0);
    }
  }

  // 8. 4대보험
  const estimatedInsurance = calculateInsurance(employeeCount);

  // 9. 추천 메시지
  const industryLabels: Record<string, string> = {
    "food-store": "음식점/카페",
    retail: "소매/쇼핑몰",
    service: "서비스업",
    freelancer: "프리랜서",
    education: "학원/교육",
    other: "기타",
  };
  const taxTypeLabels = {
    simplified: "간이과세자",
    general: "일반과세자",
    exempt: "면세사업자",
  };
  const recommendation = `${industryLabels[industry] || "기타"} · 연매출 ${revenue.toLocaleString()}만원 → ${taxTypeLabels[taxType]}로 추정됩니다.`;

  // 10. 상세 내역
  const detail: DiagnosisDetail = {
    annualRevenue: revenue,
    expenseRate,
    estimatedExpense,
    taxableIncome,
    taxBracket,
    incomeTaxBeforeCredit,
    taxCredit,
    localIncomeTax,
  };

  // answers에 정규화된 숫자값 반영
  const normalizedAnswers: DiagnosisAnswers = {
    ...answers,
    revenue,
    employeeCount,
  };

  return {
    answers: normalizedAnswers,
    recommendation,
    estimatedIncomeTax: estimatedIncomeTax + localIncomeTax, // 소득세 + 지방소득세
    estimatedVAT,
    estimatedInsurance,
    taxType,
    reportSchedule: {
      incomeTax: "5",
      vat: isSimplified
        ? ["1", "7"]
        : ["1", "4", "7", "10"],
    },
    detail,
  };
}

/** 기본 진단 결과 (챗봇 바로가기용) */
export function getDefaultDiagnosisResult(): DiagnosisResult {
  return calculateDiagnosisResult({
    industry: "freelancer",
    taxStatus: "unknown",
    revenue: 3000,
    employeeCount: 0,
    businessAge: "1-3y",
    bookkeeping: "unknown",
    interestArea: "general",
  });
}
