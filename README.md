# 텍스프리 (Tax Free)

**개인사업자들의 세금을 책임집니다.** 법인 말고 개인사업자만을 위한 세무 AI 서비스입니다.

**법인이 아닌 개인사업자**만을 위한 세무 진단·상담 서비스입니다.

## 주요 기능

### 1단계: 세무 상태 진단
- 5가지 질문으로 나의 세무 상태 파악
- 사업 유형, 매출 규모, 사업자등록 여부 등

### 2단계: 맞춤 대시보드
- 진단 결과 요약 및 추천
- 예상 세금 계산 (종합소득세, 부가가치세, 4대보험)
- 신고 일정 안내
- 시각화 차트 (월별 세금, 세금 구성 비율, 절세 전후 비교)

### 3단계: AI 상담 & 기초지식
- **AI 챗봇**: Anthropic Claude API 기반 맞춤 상담
- **기초지식**: 아코디언 형태의 세무 기초 정보
- **세무 캘린더**: 신고 일정 확인

## 프로젝트 구조

```
app/
├── page.tsx                      # 진단 화면 (랜딩)
├── dashboard/
│   └── page.tsx                  # 대시보드
├── components/
│   ├── DiagnosisForm.tsx         # 진단 질문 폼
│   ├── TaxCharts.tsx             # 차트 컴포넌트
│   ├── AIChatPanel.tsx           # AI 챗봇 패널
│   └── TaxKnowledgeAccordion.tsx # 기초지식 아코디언
├── api/
│   └── chat/
│       └── route.ts               # Claude API 라우트
├── data/
│   └── tax-knowledge.ts           # 세무 지식 데이터
├── types/
│   └── diagnosis.ts               # 타입 정의
└── utils/
    └── diagnosis.ts               # 진단 계산 로직
```

## 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일을 생성하고 Anthropic API 키를 설정하세요:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

API 키 발급: https://console.anthropic.com/

### 3. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## Git 작업 가이드

### 브랜치 전략
- **main**: 완성된 코드만 유지
- **jinny**: 개발 작업 브랜치 (기본 작업 브랜치)

### 커밋 & 푸시

**방법 1: 스크립트 사용 (추천)**
```bash
./commit-and-push.sh "feat: 새로운 기능 추가"
```

**방법 2: 직접 명령어**
```bash
git checkout jinny          # jinny 브랜치로 전환
git add .                    # 변경사항 스테이징
git commit -m "커밋 메시지"  # 커밋
git push origin jinny        # 푸시
```

### 다른 에이전트/환경에서 작업할 때
1. 프로젝트 클론: `git clone https://github.com/jinnyjiinlee/tax-free.git`
2. jinny 브랜치로 전환: `git checkout jinny`
3. 작업 후 위의 커밋/푸시 방법 사용

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **차트**: Recharts
- **AI**: Anthropic Claude API
- **디자인**: 남색(#1e3a5f) + 민트(#10b981) 컬러 시스템

## 해커톤 데모용 기능

- ✅ 세무 상태 진단 (5가지 질문)
- ✅ 맞춤형 대시보드 (차트 시각화)
- ✅ AI 챗봇 (Claude API 스트리밍)
- ✅ 기초지식 아코디언
- ✅ 반응형 디자인
