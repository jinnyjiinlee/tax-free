/**
 * 세무 AI 챗봇용 지식 데이터
 * 대상: 프리랜서/소규모 사업자
 */

export interface TaxKnowledgeItem {
  category: string;
  keywords: string[];
  content: string;
}

export const TAX_KNOWLEDGE: TaxKnowledgeItem[] = [
  // 종합소득세
  {
    category: "종합소득세",
    keywords: ["종합소득세", "과세표준", "세율", "기준세율", "누진세율"],
    content: `종합소득세는 근로소득, 사업소득, 기타소득 등 여러 소득을 합산하여 과세하는 세금입니다.
- 과세표준: 총수입 - 필요경비 - 소득공제
- 기본세율: 6%~45% (누진세율)
- 프리랜서는 사업소득으로 신고하며, 총수입에서 경비를 차감한 금액이 과세대상입니다.`,
  },
  {
    category: "종합소득세",
    keywords: ["사업소득", "프리랜서", "프리랜서 세금"],
    content: `프리랜서 사업소득 세금 안내:
- 사업소득 = 총수입금액 - 필요경비
- 필요경비: 사업을 위해 직접 소요된 비용 (통근비, 사무용품, 장비 등)
- 종합소득세 3.3% + 지방소득세 0.33% = 약 3.63% 원천징수 (간이과세자 제외)
- 연말정산 또는 종합소득세 확정신고로 정산`,
  },
  // 부가가치세
  {
    category: "부가가치세",
    keywords: ["부가가치세", "VAT", "부가세", "10%"],
    content: `부가가치세(VAT)는 재화나 용역의 공급에 따라 부과되는 간접세입니다.
- 일반과세: 10% (공급가액의 10%)
- 매 2개월마다 부가세 신고 (짝수월 25일)
- 연매출 8,800만원 이하: 간이과세자 (2% 또는 4% 적용)`,
  },
  {
    category: "부가가치세",
    keywords: ["간이과세", "간이과세자", "8천8백만"],
    content: `간이과세자 기준:
- 직전 연도 공급가액 8,800만원 이하
- 장점: 세율 2% 또는 4%로 부담 감소, 장부 작성 간소화
- 단점: 매입세액 공제 불가 (입력세금계산서 발행 못 받음)
- 프리랜서는 매출 규모에 따라 일반/간이과세 선택`,
  },
  // 사업자등록
  {
    category: "사업자등록",
    keywords: ["사업자등록", "사업자등록증", "사업자 등록"],
    content: `사업자등록 안내:
- 사업을 시작하기 전 국세청에 등록
- 사업자등록번호 10자리 (개인: 주민번호 기반)
- 준비서류: 신분증, 사업장 임대계약서 등
- 온라인: 홈택스(hometax.go.kr)에서 전자등록 가능
- 등록 후 즉시 사업용 계좌 개설 권장`,
  },
  {
    category: "사업자등록",
    keywords: ["개인사업자", "법인", "개인사업자 vs 법인"],
    content: `개인사업자와 법인 차이:
- 개인사업자: 사업자등록만 하면 됨, 소규모에 적합
- 법인: 설립등기 필요, 이중과세 구조 (법인세 + 배당소득세)
- 연매출 8천만원 이하: 개인사업자로 시작하는 경우가 많음
- 성장 시 법인 전환 검토`,
  },
  // 기타
  {
    category: "기타",
    keywords: ["4대보험", "국민연금", "건강보험", "고용보험"],
    content: `프리랜서 4대보험:
- 국민연금: 18세~60세 의무가입 (소득無 시 신청으로 연기 가능)
- 건강보험: 지역가입자로 부양가족 제외 시 독립가입
- 고용보험: 임금노동자만 의무, 프리랜서는 선택
- 장기요양: 건강보험 가입 시 부과`,
  },
  {
    category: "기타",
    keywords: ["세금신고", "연말정산", "종합소득세 신고"],
    content: `세금 신고 일정:
- 부가세: 매 2개월 25일까지 (짝수월)
- 연말정산: 1월~2월 (근로소득이 있는 경우)
- 종합소득세: 5월 1일~31일 (확정신고)
- 가산세: 신고기한 경과 시 부과되므로 기한 준수 필수`,
  },
];

/**
 * 질문과 가장 관련 높은 지식 찾기 (간단한 키워드 매칭)
 */
export function findRelevantKnowledge(query: string): TaxKnowledgeItem[] {
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");
  const results: { item: TaxKnowledgeItem; score: number }[] = [];

  for (const item of TAX_KNOWLEDGE) {
    let score = 0;
    for (const keyword of item.keywords) {
      const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, "");
      if (normalizedQuery.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedQuery)) {
        score += 1;
      }
    }
    if (score > 0) {
      results.push({ item, score });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.item);
}
