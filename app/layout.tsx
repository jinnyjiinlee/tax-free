import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "텍스프리 | 개인사업자들의 세금을 책임집니다",
  description: "법인 말고 개인사업자만을 위한 세무 AI. 나의 세무 상태를 진단하고, 맞춤형 상담을 받아보세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased min-h-screen font-sans">{children}</body>
    </html>
  );
}
