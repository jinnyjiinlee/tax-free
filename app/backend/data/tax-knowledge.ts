/**
 * 세금 관련 상수 및 메타데이터
 */
export const TAX_CATEGORIES = {
  INCOME: "종합소득세",
  VAT: "부가가치세",
  CORPORATE: "법인세",
  PROPERTY: "종합부동산세",
  GENERAL: "일반 세무",
} as const;

export type TaxCategory =
  (typeof TAX_CATEGORIES)[keyof typeof TAX_CATEGORIES];

/**
 * PDF 파일 메타데이터
 */
export interface TaxDocument {
  fileName: string;
  category: TaxCategory;
  description: string;
  lastUpdated: string;
}

export const TAX_DOCUMENTS: TaxDocument[] = [
  {
    fileName: "25년세금절약가이드1권.pdf",
    category: TAX_CATEGORIES.GENERAL,
    description: "2025년 세금 절약 가이드 (1권)",
    lastUpdated: "2026-02-07",
  },
];

/**
 * 예시 질문 (프론트엔드 참고용)
 */
export const EXAMPLE_QUESTIONS = [
  "종합소득세 신고 기한은 언제인가요?",
  "부가가치세 계산 방법을 알려주세요",
  "프리랜서 세금 신고는 어떻게 하나요?",
  "법인세 신고 대상은 누구인가요?",
  "종합부동산세는 언제 부과되나요?",
];
