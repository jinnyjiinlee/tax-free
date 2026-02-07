# 세무 Free

프리랜서·소규모 사업자를 위한 한국 세무 상담 AI 챗봇입니다.

## 주요 기능

- **종합소득세**: 사업소득, 과세표준, 세율 등
- **부가가치세**: VAT, 간이과세, 신고 일정
- **사업자등록**: 개인사업자, 등록 절차

## 프로젝트 구조

```
app/
├── page.tsx              # 메인 채팅 페이지
├── components/
│   ├── ChatWindow.tsx    # 채팅 메시지 목록
│   ├── ChatInput.tsx     # 질문 입력창
│   └── Header.tsx        # 상단 헤더
├── api/
│   └── chat/
│       └── route.ts      # AI 챗봇 API
├── data/
│   └── tax-knowledge.ts  # 세무 지식 데이터
```

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
