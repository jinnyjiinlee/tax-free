import { NextRequest, NextResponse } from "next/server";
import { findRelevantKnowledge } from "@/app/data/tax-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 }
      );
    }

    // 관련 세무 지식 검색
    const relevantKnowledge = findRelevantKnowledge(message);

    // 지식 기반 응답 생성
    let response = "";

    if (relevantKnowledge.length > 0) {
      response = relevantKnowledge
        .map(
          (k) =>
            `[${k.category}]\n${k.content}`
        )
        .join("\n\n---\n\n");

      response = `${response}\n\n위 내용은 일반적인 안내이며, 개인별 상황에 따라 다를 수 있습니다. 정확한 상담은 국세청(126) 또는 세무사에게 문의하시기 바랍니다.`;
    } else {
      response = `죄송합니다. "${message}"와 관련된 세무 정보를 찾지 못했습니다.\n\n다음 주제로 질문해 보세요:\n- 종합소득세 / 사업소득\n- 부가가치세 / 간이과세\n- 사업자등록\n- 세금 신고 일정\n\n국세청 홈택스(hometax.go.kr) 또는 126으로도 문의하실 수 있습니다.`;
    }

    return NextResponse.json({
      message: response,
      sources: relevantKnowledge.map((k) => k.category),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
