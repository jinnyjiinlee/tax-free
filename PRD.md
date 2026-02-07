# 텍스프리 (Tax Free) PRD

> 개인사업자 전용 세무 진단 & AI 상담 서비스
> 
> **Last Updated**: 2026-02-07

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|---|---|
| **서비스명** | 텍스프리 (Tax Free) |
| **목적** | 개인사업자(프리랜서, 소규모 사업자)가 세무를 쉽게 이해하고 절세할 수 있도록 돕는 서비스 |
| **타겟 사용자** | 법인이 아닌 개인사업자 (프리랜서, 음식점, 소매업, 서비스업, 학원/교육 등) |
| **핵심 가치** | 무료 · 회원가입 불필요 · 2분 진단 · AI 맞춤 상담 |

---

## 2. 기술 스택

### 프론트엔드
- **Framework**: Next.js 14.2 (App Router)
- **언어**: TypeScript 5.0+
- **스타일링**: Tailwind CSS 3.4
- **차트**: Recharts 2.12
- **아이콘**: Lucide React
- **마크다운**: react-markdown + remark-gfm

### 백엔드 (API Route)
- **AI 모델**: Google Gemini 2.0 Flash (`@google/generative-ai`)
- **런타임**: Node.js (Next.js API Route)
- **응답 방식**: Server-Sent Events (스트리밍)

### 환경 변수
| 변수 | 설명 | 필수 |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API 키 | Yes |

---

## 3. 사용자 플로우

```
[홈페이지] ──→ [세무 진단 (7단계)] ──→ [진단 결과] ──→ [대시보드]
     │                                       │              │
     │                                       ↓              ↓
     └──────────────────────────────→ [AI 채팅 상담] ←──────┘
```

---

## 4. 페이지별 기능 명세

### 4.1 홈페이지 (`/`)

| 섹션 | 설명 |
|---|---|
| **히어로** | 메인 카피 "세금, 혼자 고민하지 마세요" + CTA 2개 (진단하기, 바로 상담) + 통계 카운터 애니메이션 |
| **고민 마키** | 개인사업자 고민 카드 8개가 무한 스크롤 |
| **서비스 특징** | 2분 세무 진단, AI 맞춤 상담, 맞춤 대시보드, 세무 기초 지식 |
| **O/X 퀴즈** | 5개 세무 상식 문제 + 용어 설명 + 결과 등급(S/A/B/C/D) + 틀린 문제→채팅 유도 |
| **세무 캘린더** | 2025년 월별 신고 일정 그리드 + 다가오는 일정 카드 (클릭 시 상세 설명 펼침) |
| **사용 방법** | 3단계 안내 (진단 → 결과 확인 → AI 상담) |
| **FAQ** | 4개 아코디언 |
| **CTA** | 다크 배경 최종 전환 유도 |

**캘린더 카드 클릭 시 펼침 내용:**
- 이게 뭐예요? (파란색) — 해당 신고의 의미
- 어떻게 하나요? (초록색) — 홈택스 단계별 방법
- 안 하면 어떻게 돼요? (빨간색) — 가산세 등 불이익

---

### 4.2 세무 진단 (`/diagnosis`)

**7단계 질문:**

| 단계 | 질문 | 입력 타입 | 선택지 |
|---|---|---|---|
| 1 | 사업 업종 | 선택 | 음식점/카페, 소매/쇼핑몰, 서비스업, 프리랜서, 학원/교육, 기타 |
| 2 | 과세 유형 | 선택 | 간이과세자, 일반과세자, 면세사업자, 잘 모르겠어요 |
| 3 | 연 매출 | 숫자 입력 | 프리셋: 1,000만 / 3,000만 / 5,000만 / 1억 / 2억 |
| 4 | 사업 연차 | 선택 | 1년 미만, 1~3년, 3년 이상 |
| 5 | 직원 수 | 숫자 입력 | 프리셋: 없음 / 1명 / 3명 / 5명 / 10명 |
| 6 | 장부 관리 | 선택 | 직접 간편장부, 세무사에게 맡김, 안 하고 있음, 잘 모르겠음 |
| 7 | 관심 분야 | 선택 | 종합소득세 절세, 부가세 신고, 경비처리 범위, 4대보험, 세무 전반 |

**UX 기능:**
- 진행바 + 단계 인디케이터
- 각 질문별 "왜 물어보나요?" 설명 펼침
- 숫자 입력 시 실시간 월 매출 환산
- 슬라이드 애니메이션 (forward/backward)
- 답변 저장: `localStorage` + `sessionStorage` (`diagnosisAnswers` 키)

---

### 4.3 진단 결과 (`/result`)

| 섹션 | 설명 |
|---|---|
| **총 세금 요약** | 연간 예상 총 세금 (큰 숫자) + 월 평균 |
| **항목별 카드** | 종합소득세 / 부가가치세 / 4대보험 각각 금액 + 세부 정보 |
| **계산 상세** | 연매출 → 경비율 → 추정 경비 → 과세표준 → 세율 → 세액공제 (접이식) |
| **인사이트** | 과세 유형 안내, 적용 경비율, 절세 포인트, 절세 가능성 (색상 구분 카드) |
| **신고 일정** | 종합소득세/부가가치세 신고 시기 안내 |
| **CTA** | 상세 대시보드 / AI 상담하기 |

---

### 4.4 대시보드 (`/dashboard`)

| 섹션 | 설명 |
|---|---|
| **히어로 결과 카드** | 업종 배지 + 총 세금 + 절세 가능성 + 항목별 비율 바 |
| **계산 상세 카드** | 연매출, 경비율, 과세표준, 적용 세율 (4개 카드) |
| **차트** | 월별 세금 납부 일정 (스택 바) · 세금 구성 비율 (도넛) · 절세 시뮬레이션 (비교 바 + 맞춤 팁) |
| **탭: AI 상담** | AI 채팅 패널 (시각화 카드 포함) |
| **탭: 기초지식** | 세무 지식 아코디언 (카테고리별) |
| **탭: 세무 캘린더** | 진단 결과 기반 맞춤 세무 일정 + 필터 + 타임라인/그리드 뷰 |

**탭 특징:** URL 해시 연동 (`#chat`, `#knowledge`, `#calendar`), 키보드 네비게이션

---

### 4.5 AI 채팅 (`/chat`)

| 기능 | 설명 |
|---|---|
| **예시 질문** | 4개 카테고리 (종합소득세, 부가가치세, 절세 전략, 사업자등록) × 2개씩 |
| **스트리밍 응답** | Gemini AI 실시간 스트리밍 (SSE) |
| **시각화 카드** | 키워드 감지로 자동 표시 — 세금 요약, 신고 일정, 절세 팁, 내 정보, 경비 분석 |
| **메시지 액션** | 좋아요/싫어요 · 복사 · 재시도 · 응답 중단 · 새 대화 |
| **출처 인용** | AI 응답에 `[출처 N]` 형식으로 근거 표시 |

---

## 5. 데이터 모델

### DiagnosisAnswers (진단 입력)
```typescript
{
  industry: Industry;           // 업종
  taxStatus: TaxStatus;         // 과세 유형
  revenue: number;              // 연매출 (만원)
  employeeCount: number;        // 직원 수
  businessAge: BusinessAge;     // 사업 연차
  bookkeeping: Bookkeeping;     // 장부 관리
  interestArea: InterestArea;   // 관심 분야
}
```

### DiagnosisResult (진단 결과)
```typescript
{
  answers: DiagnosisAnswers;
  recommendation: string;          // 추천 메시지
  estimatedIncomeTax: number;      // 종합소득세 (만원)
  estimatedVAT: number;            // 부가가치세 (만원)
  estimatedInsurance: number;      // 4대보험 (만원)
  taxType: "general" | "simplified" | "exempt";
  reportSchedule: {
    incomeTax: string;             // "5"
    vat: string[];                 // ["1","7"] 또는 ["1","4","7","10"]
  };
  detail: DiagnosisDetail;         // 상세 계산 내역
}
```

### DiagnosisDetail (계산 상세)
```typescript
{
  annualRevenue: number;           // 연매출 (만원)
  expenseRate: number;             // 적용 경비율 (%)
  estimatedExpense: number;        // 추정 경비 (만원)
  taxableIncome: number;           // 과세표준 (만원)
  taxBracket: string;              // 적용 세율 구간
  incomeTaxBeforeCredit: number;   // 산출세액 (만원)
  taxCredit: number;               // 세액공제 (만원)
  localIncomeTax: number;          // 지방소득세 (만원)
}
```

---

## 6. 세금 계산 로직

### 6.1 종합소득세
1. 업종별 경비율 적용 (단순경비율 / 기준경비율)
2. 과세표준 = 매출 - 경비 - 기본공제(150만원)
3. 누진세율 적용 (6%~45%, 소득세법 제55조)
4. 기장세액공제 (장부 작성 시 20%, 최대 100만원)
5. 지방소득세 (소득세의 10%)

### 6.2 부가가치세
- **간이과세자**: 매출 × 업종별 부가세율 (1%~3%)
- **일반과세자**: 매출 10% - 매입세액(매출의 약 6% 추정)
- **면세사업자**: 0원

### 6.3 4대보험
- 직원 수 × 월급(250만원 가정) × 사업주 부담율(9.4%) × 12개월

---

## 7. API 명세

### POST `/api/chat`

| 필드 | 타입 | 설명 |
|---|---|---|
| `message` | string | 사용자 메시지 (필수) |
| `messages` | array | 대화 히스토리 (최근 10개) |
| `diagnosisResult` | DiagnosisResult | 진단 결과 (선택) |

**응답**: SSE 스트리밍
```
data: {"content": "종합소득세란..."}\n\n
data: {"content": "..."}\n\n
data: [DONE]\n\n
```

---

## 8. 컴포넌트 목록

| 컴포넌트 | 역할 |
|---|---|
| `AIChatPanel` | AI 채팅 인터페이스 (스트리밍, 시각화 카드, 피드백) |
| `TaxCharts` | 차트 3종 (월별 스택 바 · 도넛 · 절세 비교) |
| `TaxCalendar` | 맞춤 세무 캘린더 (타임라인/그리드, 필터, D-day) |
| `TaxKnowledgeAccordion` | 세무 기초지식 아코디언 |
| `ChatVisualCards` | 채팅 내 시각화 카드 5종 (세금요약, 일정, 절세팁, 내정보, 경비) |
| `TaxFreeCharacter` | 캐릭터 이미지 컴포넌트 |
| `Icons` | 커스텀 SVG 아이콘 모음 |

---

## 9. 데이터 저장

| 저장소 | 키 | 용도 |
|---|---|---|
| `localStorage` | `diagnosisAnswers` | 진단 답변 영구 저장 (재방문 시 유지) |
| `sessionStorage` | `diagnosisAnswers` | 진단 답변 세션 저장 (탭 닫으면 삭제) |
| 메모리 | — | 채팅 메시지 (새로고침 시 초기화) |

> **참고**: 현재 DB 연동 없음. 백엔드 서버 구축 시 API 통신으로 전환 예정.

---

## 10. UX/접근성

- **반응형**: 모바일 우선 설계, Tailwind 브레이크포인트 활용
- **터치**: 최소 44px 터치 영역 보장
- **접근성**: ARIA 레이블/역할, 스킵 링크, 키보드 네비게이션, 포커스 관리
- **모션**: `prefers-reduced-motion` 미디어 쿼리 지원
- **애니메이션**: 스크롤 리빌, 카운터, 마키, 슬라이드 전환, 타이핑 인디케이터

---

## 11. 프로젝트 구조

```
app/
├── api/chat/route.ts              # AI 채팅 API (Gemini 스트리밍)
├── components/
│   ├── AIChatPanel.tsx            # 채팅 인터페이스
│   ├── ChatVisualCards.tsx        # 채팅 시각화 카드 5종
│   ├── TaxCharts.tsx              # 세금 차트 3종
│   ├── TaxCalendar.tsx            # 세무 캘린더
│   ├── TaxKnowledgeAccordion.tsx  # 기초지식 아코디언
│   ├── TaxFreeCharacter.tsx       # 캐릭터
│   └── Icons.tsx                  # 아이콘
├── data/tax-knowledge.ts          # 세무 지식 데이터
├── types/diagnosis.ts             # 타입 정의
├── utils/diagnosis.ts             # 세금 계산 로직
├── page.tsx                       # 홈
├── diagnosis/page.tsx             # 진단 (7단계)
├── result/page.tsx                # 결과
├── dashboard/page.tsx             # 대시보드
├── chat/page.tsx                  # AI 채팅
├── error.tsx                      # 에러 페이지
├── layout.tsx                     # 루트 레이아웃
└── globals.css                    # 글로벌 스타일
```

---

## 12. 향후 로드맵

| 우선순위 | 기능 | 설명 |
|---|---|---|
| P0 | 백엔드 API 연동 | 세금 계산을 백엔드 서버로 이전, DB 저장 |
| P1 | 사용자 계정 | 회원가입/로그인, 진단 결과 저장/불러오기 |
| P1 | 알림 기능 | 신고 일정 D-day 알림 (이메일/푸시) |
| P2 | PDF 리포트 | 진단 결과를 PDF로 다운로드 |
| P2 | 세무사 연결 | 전문 세무사 매칭/상담 예약 |
| P3 | 영수증 OCR | 사진 촬영으로 경비 자동 입력 |
