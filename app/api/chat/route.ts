import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DiagnosisResult } from "@/app/types/diagnosis";
import { findRelevantKnowledge, TaxKnowledgeItem } from "@/app/data/tax-knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function buildSystemPrompt(
  diagnosisResult?: DiagnosisResult,
  relevantKnowledge?: TaxKnowledgeItem[]
): string {
  let prompt = `당신은 텍스프리(Tax Free)의 AI 세무 상담사입니다. 개인사업자들의 세금을 책임지는 서비스이며, 법인이 아닌 개인사업자만 대상으로 합니다. 친절하고 이해하기 쉽게 답변해주세요.

주요 역할:
- 종합소득세, 부가가치세, 경비처리, 사업자등록, 4대보험 등 세무 상담
- 개인사업자(프리랜서, 소규모 사업자)를 위한 실용적인 조언
- 복잡한 세무 용어를 쉬운 말로 설명
- 구체적인 예시와 함께 답변

답변 시 주의사항:
- 정확한 정보 제공 (불확실한 내용은 명시)
- 개인별 상황에 따라 다를 수 있음을 안내
- 필요시 국세청(126) 또는 세무사 상담 권유
- 수치가 나오면 명확하게 표시`;

  // 근거 데이터가 있으면 인용 지시 추가
  if (relevantKnowledge && relevantKnowledge.length > 0) {
    prompt += `\n\n[근거 인용 규칙]
아래 참고 자료가 제공되었습니다. 답변할 때 반드시 다음 규칙을 따르세요:
1. 참고 자료의 내용을 활용하여 답변하세요.
2. 답변 본문에서 해당 자료를 인용할 때 **[출처 N]** 형식으로 표시하세요. (예: "종합소득세의 기본세율은 6%~45%입니다 **[출처 1]**")
3. 답변 마지막에 "---" 구분선을 넣고, 인용한 출처 목록을 아래 형식으로 정리하세요:

> **참고 자료**
> [출처 1] 소득세법 제55조 (세율) — 종합소득세
> [출처 2] ...

4. 참고 자료에 없는 일반 지식으로 답변하는 부분은 출처 표시 없이 작성해도 됩니다.
5. 참고 자료가 질문과 관련 없다면 무시하고, 출처 없이 일반 답변하세요.

[참고 자료]`;

    relevantKnowledge.forEach((item, idx) => {
      prompt += `\n\n[출처 ${idx + 1}] ${item.source} — ${item.category}
${item.content}`;
    });
  }

  if (diagnosisResult) {
    prompt += `\n\n[사용자 진단 정보]
- 업종: ${diagnosisResult.answers.industry}
- 과세 유형: ${diagnosisResult.answers.taxStatus}
- 매출 규모: ${diagnosisResult.answers.revenue}
- 사업 연차: ${diagnosisResult.answers.businessAge}
- 직원 수: ${diagnosisResult.answers.employeeCount}
- 장부 관리: ${diagnosisResult.answers.bookkeeping}
- 관심 분야: ${diagnosisResult.answers.interestArea}
- 추천: ${diagnosisResult.recommendation}
- 예상 종합소득세: ${diagnosisResult.estimatedIncomeTax}만원
- 예상 부가가치세: ${diagnosisResult.estimatedVAT}만원
- 예상 4대보험: ${diagnosisResult.estimatedInsurance}만원
- 세금 유형: ${diagnosisResult.taxType === "general" ? "일반과세" : "간이과세"}
- 신고 일정: 종합소득세 ${diagnosisResult.reportSchedule.incomeTax}월, 부가가치세 ${diagnosisResult.reportSchedule.vat.join(", ")}월

위 진단 정보를 참고하여 사용자에게 맞춤형 답변을 제공하세요.`;
  }

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const { message, messages: chatHistory, diagnosisResult } = await request.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // API 키 확인
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY가 설정되지 않았습니다. 환경변수를 확인하세요.");
      return new Response(
        JSON.stringify({
          error: "AI 서비스가 설정되지 않았습니다. GEMINI_API_KEY 환경변수를 설정해주세요.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 질문에서 관련 지식 검색
    const relevantKnowledge = findRelevantKnowledge(message);

    const systemPrompt = buildSystemPrompt(diagnosisResult, relevantKnowledge);

    // Gemini 모델 생성
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // 대화 히스토리 구성 (최근 10개 메시지만)
    const historyMessages = (chatHistory || [])
      .slice(-10)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // 채팅 세션 시작
    const chat = model.startChat({
      history: historyMessages,
    });

    // 스트리밍 응답 생성
    const result = await chat.sendMessageStream(message);

    // ReadableStream 생성
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              const data = JSON.stringify({ content: text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
