"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  ChevronDown,
  MessageCircle,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  Sparkles,
  Zap,
  Target,
  Lightbulb,
  HelpCircle,
  Shield,
  Clock,
  Calendar,
} from "lucide-react";
import TaxFreeCharacter from "./components/TaxFreeCharacter";

/* ─────────────────────────────────────────
   Hooks
───────────────────────────────────────── */

/** Intersection Observer 기반 스크롤 리빌 */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/** 카운터 애니메이션 */
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { ref, count };
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */

const WORRIES_ROW1 = [
  { icon: HelpCircle, text: "종합소득세 신고, 대체 어떻게 하는 거지?", who: "프리랜서 3년차" },
  { icon: Target, text: "경비처리 어디까지 되는 건지 모르겠어...", who: "1인 쇼핑몰 운영자" },
  { icon: Clock, text: "세무사 맡기자니 비용이 부담돼요", who: "배달 라이더" },
  { icon: Shield, text: "간이과세? 일반과세? 뭐가 다른 거야?", who: "사업 시작 준비 중" },
];

const WORRIES_ROW2 = [
  { icon: Calendar, text: "부가세 신고 기한을 또 놓칠 뻔했어...", who: "네일 아티스트" },
  { icon: BookOpen, text: "프리랜서인데 사업자등록 해야 하나요?", who: "유튜브 크리에이터" },
  { icon: Zap, text: "작년에 세금 폭탄 맞았는데 왜인지 모르겠어", who: "과외 선생님" },
  { icon: Sparkles, text: "4대보험 보험료가 왜 이렇게 비싸죠?", who: "디자인 프리랜서" },
];

const FEATURES = [
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    title: "2분 세무 진단",
    description: "7가지 질문만 답하면 나의 세무 유형과 연간 예상 세금을 즉시 확인",
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    title: "AI 맞춤 상담",
    description: "진단 결과 기반 개인별 세무 조언, AI가 24시간 실시간 답변",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    title: "맞춤 대시보드",
    description: "예상 세금, 신고 일정, 절세 비교를 한 화면에서 시각화",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    title: "세무 기초 지식",
    description: "종합소득세, 부가세, 경비처리 등 개인사업자 필수 지식",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
];

const USAGE_STEPS = [
  { num: "01", title: "세무 진단", desc: "사업 유형, 매출 규모 등 7가지 질문에 답하세요", Icon: ClipboardCheck },
  { num: "02", title: "결과 확인", desc: "예상 세금과 신고 일정을 차트로 확인하세요", Icon: BarChart3 },
  { num: "03", title: "AI 상담", desc: "궁금한 점을 AI에게 물어보고 맞춤 답변을 받으세요", Icon: MessageCircle },
];

const FAQ = [
  { q: "정말 무료인가요?", a: "네. 세무 진단과 AI 상담은 모두 무료로 이용 가능합니다. 회원가입도 필요 없어요." },
  { q: "법인도 이용할 수 있나요?", a: "텍스프리는 개인사업자(프리랜서, 소규모 사업자) 전용 서비스입니다." },
  { q: "AI 답변이 정확한가요?", a: "AI가 제공하는 정보는 참고용이며, 정확한 세무 상담은 국세청(126) 또는 세무사에게 문의하세요." },
  { q: "내 정보는 안전한가요?", a: "입력하신 정보는 서버에 저장되지 않으며, 세션 종료 시 자동으로 삭제됩니다." },
];

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */

function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
}) {
  const dirMap = {
    up: "scroll-hidden",
    left: "scroll-hidden-left",
    right: "scroll-hidden-right",
    scale: "scroll-hidden-scale",
  };
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${dirMap[direction]} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

/** 히어로 라이브 데모 채팅 */
function HeroDemoChat() {
  return (
    <div className="demo-chat-window rounded-2xl border border-slate-200/60 overflow-hidden w-full max-w-md mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-white/80">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">T</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">텍스프리 AI</div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-slate-400">온라인</span>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="px-4 py-5 space-y-3 bg-gradient-to-b from-slate-50/50 to-white min-h-[180px]">
        {/* 유저 메시지 */}
        <div className="flex justify-end opacity-0 animate-chat-msg-1">
          <div className="bg-slate-900 text-white text-[13px] rounded-2xl rounded-br-md px-4 py-2.5 max-w-[75%]">
            프리랜서인데 세금 얼마나 내야해요?
          </div>
        </div>

        {/* 타이핑 인디케이터 */}
        <div className="flex justify-start opacity-0 animate-chat-typing">
          <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-dot-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-dot-pulse [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-dot-pulse [animation-delay:0.4s]" />
            </div>
          </div>
        </div>

        {/* AI 메시지 1 */}
        <div className="flex justify-start gap-2 opacity-0 animate-chat-msg-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[9px] font-bold">T</span>
          </div>
          <div className="bg-white border border-slate-100 text-slate-700 text-[13px] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[80%] shadow-sm leading-relaxed">
            월 매출이 <strong className="text-slate-900">500만원</strong>이라면, 연간 종합소득세는 약 <strong className="text-blue-600">120만원</strong>으로 예상돼요.
          </div>
        </div>

        {/* AI 메시지 2 */}
        <div className="flex justify-start gap-2 opacity-0 animate-chat-msg-3">
          <div className="w-6 h-6" />
          <div className="bg-blue-50 border border-blue-100 text-slate-600 text-[12px] rounded-xl px-3.5 py-2 max-w-[80%]">
            📌 경비처리를 잘하면 <strong className="text-blue-700">30~50% 절세</strong>가 가능해요!
          </div>
        </div>
      </div>

      {/* 인풋 바 */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white/80">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
          <span className="text-sm text-slate-400 flex-1">세무 질문을 입력하세요...</span>
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 마키 고민 카드 한 줄 */
function MarqueeRow({ items, reverse = false }: { items: typeof WORRIES_ROW1; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-container overflow-hidden">
      <div className={`flex gap-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`} style={{ width: "max-content" }}>
        {doubled.map((w, i) => {
          const IconComponent = w.icon;
          return (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-slate-100/80 shadow-premium group hover:shadow-premium-lg hover:border-slate-200/80 hover:-translate-y-1 transition-all duration-500 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                <IconComponent className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-slate-700 font-medium text-[14px] leading-snug mb-2">&ldquo;{w.text}&rdquo;</p>
              <span className="text-xs text-slate-400 font-medium">— {w.who}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** FAQ 아이템 */
function FAQItem({ item, index }: { item: typeof FAQ[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <ScrollReveal delay={index * 0.08}>
      <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-500 ${open ? "border-slate-200 shadow-premium" : "border-slate-100 hover:border-slate-200/80 shadow-premium hover:shadow-premium-lg"}`}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-6 py-5 flex justify-between items-center text-left min-h-[44px]"
          aria-expanded={open}
        >
          <span className="font-semibold text-slate-900 pr-4 tracking-tight">{item.q}</span>
          <span className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${open ? "bg-slate-900 text-white rotate-180" : "bg-slate-50 text-slate-500"}`}>
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
          </span>
        </button>
        <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">{item.a}</div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const stat1 = useCounter(2);
  const stat2 = useCounter(7);
  const stat3 = useCounter(24);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left - 300,
      y: e.clientY - rect.top - 300,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-hidden noise-bg">
      <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>

      {/* ──── 배경: 메쉬 그라디언트 ──── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(99,102,241,0.05),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(248,250,252,0.5)_50%,rgba(241,245,249,0.8)_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-slate-50/90 via-white/40 to-transparent" />
        <div className="absolute top-32 right-1/4 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px]" />
        <div className="absolute top-48 left-1/4 w-[450px] h-[450px] bg-indigo-50/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-slate-100/30 rounded-full blur-[80px]" />
      </div>

      {/* ──── 네비게이션 ──── */}
      <nav className="sticky top-0 z-50 glass-premium border-b border-slate-200/30 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset]">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <TaxFreeCharacter size="sm" animate={false} />
            <span className="text-lg font-bold text-slate-900 tracking-tight">텍스프리</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/chat" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline-flex min-h-[44px] items-center tracking-tight">
              챗봇 바로가기
            </Link>
            <Link
              href="/diagnosis"
              className="btn-shine inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold tracking-tight hover:bg-slate-800 transition-all duration-300 shadow-[0_2px_8px_rgba(15,23,42,0.12)]"
            >
              무료 진단 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* ████████ 히어로 ████████ */}
      <section
        ref={heroRef}
        id="main-content"
        className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* 마우스 추적 그라디언트 */}
        <div
          className="hero-gradient-follow hidden md:block"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />

        <div className="relative max-w-6xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* 왼쪽: 카피 */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/60 mb-8 shadow-premium animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-slate-600 tracking-tight">개인사업자 전용 · 무료</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.4rem] xl:text-[3.8rem] font-bold text-slate-900 leading-[1.06] tracking-[-0.04em] mb-6 animate-fade-in">
                세금, 혼자 고민하지
                <br />
                <span className="text-shimmer">마세요</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed tracking-tight animate-fade-in opacity-0 [animation-delay:0.2s]">
                법인 말고 개인사업자만을 위한
                <br className="hidden sm:block" />
                맞춤 세무 진단과 AI 상담
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10 animate-fade-in opacity-0 [animation-delay:0.35s]">
                <Link
                  href="/diagnosis"
                  className="btn-shine group inline-flex items-center justify-center gap-2.5 min-h-[52px] px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-[15px] tracking-tight hover:bg-slate-800 transition-all duration-300 shadow-[0_4px_14px_rgba(15,23,42,0.15)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.2)] hover:-translate-y-0.5"
                >
                  나의 세무 상태 진단하기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 min-h-[52px] px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/80 text-slate-700 font-semibold text-[15px] tracking-tight hover:border-slate-300 hover:bg-white transition-all duration-300 shadow-premium"
                >
                  <MessageCircle className="w-5 h-5 text-blue-600" strokeWidth={2} />
                  바로 상담하기
                </Link>
              </div>

              {/* 통계 - 카운터 애니메이션 */}
              <div className="flex justify-center lg:justify-start gap-12 animate-fade-in opacity-0 [animation-delay:0.5s]">
                <div className="text-center lg:text-left" ref={stat1.ref}>
                  <div className="text-2xl font-bold text-slate-900 counter-value tracking-tight">{stat1.count}<span className="text-slate-400 font-medium">분</span></div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">평균 진단 시간</div>
                </div>
                <div className="w-px h-8 bg-slate-200/80 self-center" />
                <div className="text-center lg:text-left" ref={stat2.ref}>
                  <div className="text-2xl font-bold text-slate-900 counter-value tracking-tight">{stat2.count}<span className="text-slate-400 font-medium">개</span></div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">질문으로 완료</div>
                </div>
                <div className="w-px h-8 bg-slate-200/80 self-center" />
                <div className="text-center lg:text-left" ref={stat3.ref}>
                  <div className="text-2xl font-bold text-slate-900 counter-value tracking-tight">{stat3.count}<span className="text-slate-400 font-medium">시간</span></div>
                  <div className="text-xs text-slate-500 mt-1 font-medium">AI 상담 가능</div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 라이브 데모 */}
            <div className="hidden lg:block animate-fade-in opacity-0 [animation-delay:0.4s]">
              <div className="relative">
                {/* 배경 장식 */}
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/40 via-transparent to-indigo-100/40 rounded-3xl blur-2xl" />
                <div className="relative">
                  <HeroDemoChat />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ████████ 고민 - 마키 ████████ */}
      <section className="relative z-10 py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/80 border border-slate-200/60 mb-6">
              <span className="text-sm font-medium text-slate-600 tracking-tight">혹시 이런 고민 있으신가요?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-[-0.03em]">
              개인사업자 · 프리랜서라면
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700">
                한 번쯤 해본 고민들
              </span>
            </h2>
          </ScrollReveal>
        </div>

        {/* 마키 (무한 스크롤) */}
        <div className="space-y-4 mb-14">
          <MarqueeRow items={WORRIES_ROW1} />
          <MarqueeRow items={WORRIES_ROW2} reverse />
        </div>

        {/* 해결 메시지 */}
        <ScrollReveal className="text-center" direction="scale">
          <div className="inline-flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm rounded-3xl px-12 py-10 border border-slate-100 shadow-premium">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-7 h-7 text-amber-400" strokeWidth={2} />
            </div>
            <p className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              이 고민들, <span className="text-blue-600">텍스프리</span>가 해결해드릴게요
            </p>
            <p className="text-sm text-slate-500">2분 진단 한 번이면 나에게 맞는 세무 정보를 한눈에 확인할 수 있어요</p>
          </div>
        </ScrollReveal>
      </section>

      <div className="section-divider" />

      {/* ████████ 서비스 특징 ████████ */}
      <section className="relative z-10 py-24 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-[-0.03em]">
              왜 텍스프리인가요
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-[15px]">개인사업자만을 위한 4가지 핵심 가치</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="group relative bg-white rounded-2xl p-7 border border-slate-100/80 shadow-premium h-full hover:border-slate-200/80 hover:shadow-premium-lg transition-all duration-500">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} text-white flex items-center justify-center mb-5 shadow-lg ${f.shadow} group-hover:scale-105 transition-transform duration-500`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">{f.icon}</svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ████████ 사용 방법 ████████ */}
      <section className="relative z-10 py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              사용 방법
            </h2>
            <p className="text-slate-500">3단계로 간단하게 시작하세요</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-0 md:gap-0">
            {USAGE_STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="relative text-center px-6 py-8 group">
                  {/* 커넥터 */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-[4.5rem] right-0 translate-x-1/2 z-10">
                      <svg width="40" height="24" viewBox="0 0 40 24" className="text-blue-300">
                        <path d="M0 12h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                          {/* 아이콘 */}
                  {(() => {
                    const StepIcon = step.Icon;
                    return (
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-100 flex items-center justify-center mx-auto mb-5 group-hover:scale-105 group-hover:border-blue-100 group-hover:shadow-premium-blue transition-all duration-500">
                        <StepIcon className="w-9 h-9 text-slate-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                    );
                  })()}

                  <span className="inline-block text-xs font-bold text-blue-400 tracking-widest uppercase mb-2">Step {step.num}</span>
                  <h3 className="font-bold text-slate-900 text-xl mb-3">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* 시작하기 버튼 */}
          <ScrollReveal className="text-center mt-10" delay={0.4}>
            <Link
              href="/diagnosis"
              className="btn-shine inline-flex items-center justify-center gap-2 min-h-[52px] px-10 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 transition-all shadow-premium-lg hover:shadow-2xl hover:-translate-y-0.5"
            >
              지금 진단 시작하기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ████████ FAQ ████████ */}
      <section className="relative z-10 py-24 bg-[#fafafa]">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              자주 묻는 질문
            </h2>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ████████ CTA ████████ */}
      <section className="relative z-10 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(59,130,246,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:6rem_6rem]" />
        <ScrollReveal className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
            <TaxFreeCharacter size="sm" animate={false} className="!w-10 !h-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.03em]">
            지금 바로 시작하세요
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">회원가입 없이, 2분이면 나의 세무 상태를 확인할 수 있어요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/diagnosis"
              className="btn-shine inline-flex items-center justify-center gap-2 min-h-[52px] px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg tracking-tight hover:bg-slate-50 transition-all duration-300 shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
            >
              무료로 진단받기
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 min-h-[52px] px-10 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/15 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" strokeWidth={2} />
              AI 상담 시작
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ████████ 푸터 ████████ */}
      <footer className="relative z-10 py-14 bg-slate-950 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <TaxFreeCharacter size="sm" animate={false} />
              <div>
                <span className="font-bold text-white tracking-tight">텍스프리</span>
                <p className="text-xs text-slate-500 mt-0.5">개인사업자들의 세금을 책임집니다</p>
              </div>
            </div>
            <div className="flex gap-8">
              <Link href="/diagnosis" className="text-sm text-slate-400 hover:text-white transition-colors">진단</Link>
              <Link href="/chat" className="text-sm text-slate-400 hover:text-white transition-colors">챗봇</Link>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">대시보드</Link>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mt-8 mb-6" />
          <p className="text-center text-xs text-slate-600">
            법인이 아닌 개인사업자 전용 서비스
          </p>
        </div>
      </footer>
    </div>
  );
}
