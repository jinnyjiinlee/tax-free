"use client";

import Link from "next/link";
import TaxFreeCharacter from "./components/TaxFreeCharacter";

const WORRIES = [
  {
    emoji: "😰",
    text: "종합소득세 신고, 대체 어떻게 하는 거지?",
    who: "프리랜서 3년차",
  },
  {
    emoji: "🤔",
    text: "경비처리 어디까지 되는 건지 모르겠어...",
    who: "1인 쇼핑몰 운영자",
  },
  {
    emoji: "💸",
    text: "세무사 맡기자니 비용이 부담돼요",
    who: "배달 라이더",
  },
  {
    emoji: "😵",
    text: "간이과세? 일반과세? 뭐가 다른 거야?",
    who: "사업 시작 준비 중",
  },
  {
    emoji: "📅",
    text: "부가세 신고 기한을 또 놓칠 뻔했어...",
    who: "네일 아티스트",
  },
  {
    emoji: "🧾",
    text: "프리랜서인데 사업자등록 해야 하나요?",
    who: "유튜브 크리에이터",
  },
  {
    emoji: "😥",
    text: "작년에 세금 폭탄 맞았는데 왜인지 모르겠어",
    who: "과외 선생님",
  },
  {
    emoji: "🏦",
    text: "4대보험 지역가입자 보험료가 왜 이렇게 비싸죠?",
    who: "디자인 프리랜서",
  },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "2분 세무 진단",
    description: "5가지 질문만 답하면 나의 세무 유형과 연간 예상 세금을 즉시 확인",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI 맞춤 상담",
    description: "진단 결과 기반 개인별 세무 조언, Gemini AI로 24시간 실시간 답변",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "맞춤 대시보드",
    description: "예상 세금, 신고 일정, 절세 전후 비교를 한 화면에서 시각화",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "기초 세무 지식",
    description: "종합소득세, 부가세, 경비처리 등 개인사업자 필수 지식만 간단히",
  },
];

const STATS = [
  { value: "2분", label: "평균 진단 시간" },
  { value: "5개", label: "질문으로 완료" },
  { value: "무료", label: "회원가입 불필요" },
];

const USAGE_STEPS = [
  {
    num: "01",
    title: "세무 진단",
    desc: "사업 유형, 매출 규모, 사업자등록 여부 등 5가지 질문에 답하세요",
  },
  {
    num: "02",
    title: "맞춤 대시보드",
    desc: "예상 세금과 신고 일정을 차트로 한눈에 확인하고, AI 상담 탭으로 이동하세요",
  },
  {
    num: "03",
    title: "AI 상담",
    desc: "궁금한 점을 바로 물어보고, 진단 결과를 반영한 맞춤 답변을 받아보세요",
  },
];

const FAQ = [
  {
    q: "정말 무료인가요?",
    a: "네. 세무 진단과 AI 상담은 모두 무료로 이용 가능합니다. 회원가입도 필요 없어요.",
  },
  {
    q: "법인도 이용할 수 있나요?",
    a: "텍스프리는 개인사업자(프리랜서, 소규모 사업자) 전용 서비스입니다.",
  },
  {
    q: "AI 답변이 정확한가요?",
    a: "AI가 제공하는 정보는 참고용이며, 정확한 세무 상담은 국세청(126) 또는 세무사에게 문의하세요.",
  },
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSend = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: content,
          conversationId: conversationId ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "요청에 실패했습니다.");
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          err instanceof Error
            ? `오류가 발생했습니다: ${err.message}`
            : "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden">
      {/* 스킵 링크 - 키보드 사용자 접근성 */}
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-blue-50/80 via-white/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-slate-50/90 to-transparent" />
      </div>

      {/* 네비게이션 - 스티키, 글래스 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <TaxFreeCharacter size="sm" animate={false} />
            <span className="text-lg font-bold text-slate-900 tracking-tight">텍스프리</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/chat" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:inline-flex min-h-[44px] items-center" aria-label="챗봇 바로가기">
              챗봇 바로가기
            </Link>
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="무료 진단 시작"
            >
              무료 진단 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 */}
      <section id="main-content" className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-32" aria-labelledby="hero-title">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-700">개인사업자 전용 · 무료</span>
            </div>

            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight mb-6 max-w-4xl mx-auto">
              세금, 혼자 고민하지
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                마세요
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              법인 말고 개인사업자만을 위한
              <br className="hidden sm:block" />
              맞춤 세무 진단과 AI 상담
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/diagnosis"
                className="group inline-flex items-center justify-center gap-2.5 min-h-[44px] w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/25 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label="나의 세무 상태 진단하기"
              >
                나의 세무 상태 진단하기
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-semibold text-base hover:border-blue-200 hover:bg-blue-50/50 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label="챗봇으로 바로 상담하기"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                챗봇으로 바로 상담하기
              </Link>
            </div>

            {/* 통계 */}
            <div className="flex justify-center gap-12 md:gap-16">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 히어로 미리보기 - 카드 스타일 */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 h-14 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl flex items-center px-4">
                    <span className="text-sm font-medium text-slate-600">예상 종합소득세</span>
                    <span className="ml-auto text-lg font-bold text-slate-900">약 120만원</span>
                  </div>
                  <div className="flex-1 h-14 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl flex items-center px-4">
                    <span className="text-sm font-medium text-slate-600">예상 부가세</span>
                    <span className="ml-auto text-lg font-bold text-slate-900">약 80만원</span>
                  </div>
                </div>
                <div className="h-32 bg-slate-50 rounded-2xl flex items-center justify-center">
                  <span className="text-slate-400 text-sm">월별 예상 세금 차트 미리보기</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 고민 섹션 */}
      <section id="worries" className="relative z-10 py-24 bg-white overflow-hidden" aria-labelledby="worries-heading">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-6">
              <span className="text-sm font-medium text-red-600">혹시 이런 고민 있으신가요?</span>
            </div>
            <h2 id="worries-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              개인사업자·프리랜서라면
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                한 번쯤 해본 고민들
              </span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              세금 문제, 혼자 끙끙대고 있지 않으셨나요?
            </p>
          </div>

          {/* 말풍선 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {WORRIES.map((worry, i) => (
              <div
                key={i}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-300 hover:-translate-y-1"
              >
                {/* 말풍선 꼬리 */}
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-slate-50 group-hover:bg-white border-b border-r border-slate-100 group-hover:border-slate-200 rotate-45 transition-all duration-300" />
                
                <div className="text-2xl mb-3">{worry.emoji}</div>
                <p className="text-slate-800 font-medium text-[15px] leading-snug mb-3">
                  &ldquo;{worry.text}&rdquo;
                </p>
                <span className="text-xs text-slate-400 font-medium">— {worry.who}</span>
              </div>
            ))}
          </div>

          {/* 해결 메시지 */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl px-10 py-8 border border-blue-100">
              <div className="text-4xl">💡</div>
              <p className="text-lg md:text-xl font-bold text-slate-900">
                이 고민들, <span className="text-blue-600">텍스프리</span>가 해결해드릴게요
              </p>
              <p className="text-sm text-slate-500">
                2분 진단 한 번이면 나에게 맞는 세무 정보를 한눈에 확인할 수 있어요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 특징 */}
      <section id="features" className="relative z-10 py-24 bg-slate-50/50" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              왜 텍스프리인가요
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">개인사업자만을 위한 4가지 핵심 가치</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-slate-50/80 rounded-2xl p-6 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section id="usage" className="relative z-10 py-24 bg-white" aria-labelledby="usage-heading">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="usage-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              사용 방법
            </h2>
            <p className="text-slate-600">3단계로 간단하게 시작하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {USAGE_STEPS.map((step, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-0.5 bg-slate-200" />
                )}
                <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                  <span className="text-4xl font-bold text-blue-100">{step.num}</span>
                  <h3 className="font-bold text-slate-900 text-xl mt-4 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-24 bg-slate-50/50" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-4" role="list">
            {FAQ.map((item, i) => (
              <details key={i} className="group border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-colors" role="listitem">
                <summary className="px-6 py-4 cursor-pointer list-none font-semibold text-slate-900 flex justify-between items-center [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="px-6 pb-4 pt-0 text-slate-600 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 py-24 bg-slate-900" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            지금 바로 시작하세요
          </h2>
          <p className="text-slate-400 text-lg mb-10">회원가입 없이, 2분이면 나의 세무 상태를 확인할 수 있어요</p>
          <Link
            href="/diagnosis"
            className="inline-flex items-center justify-center min-h-[44px] px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-slate-100 transition-all shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label="무료로 진단받기"
          >
            무료로 진단받기
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="relative z-10 py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TaxFreeCharacter size="sm" animate={false} />
            <span className="font-semibold text-white">텍스프리</span>
          </div>
          <p className="text-slate-500 text-sm">
            개인사업자들의 세금을 책임집니다 · 법인이 아닌 개인사업자 전용
          </p>
          <div className="flex gap-6">
            <Link href="/diagnosis" className="text-sm text-slate-400 hover:text-white transition-colors">진단</Link>
            <Link href="/chat" className="text-sm text-slate-400 hover:text-white transition-colors">챗봇</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
