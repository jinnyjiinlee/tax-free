import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세무 Free | 프리랜서·소규모 사업자 세무 상담",
  description: "종합소득세, 부가가치세, 사업자등록 등 기본 세무 상담 AI 챗봇",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
