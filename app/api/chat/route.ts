import { NextRequest, NextResponse } from "next/server";
import { openai, CONFIG } from "@/app/backend/lib/openai";
import { validateRequest } from "@/app/backend/lib/validation";
import { logAPICall } from "@/app/backend/lib/logger";
import type { ChatResponse, ErrorResponse } from "@/app/backend/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractAnswer(response: any): string {
  if (typeof response?.output_text === "string" && response.output_text) {
    return response.output_text;
  }

  if (Array.isArray(response?.output_text) && response.output_text.length > 0) {
    return response.output_text.join("\n");
  }

  const messageOutput = response?.output?.find(
    (item: any) => item.type === "message"
  );
  if (messageOutput?.content?.length) {
    const textContent = messageOutput.content.find(
      (content: any) => content.type === "text" && content.text
    );
    if (textContent?.text) {
      return textContent.text;
    }
  }

  throw new Error("No text content");
}

export async function POST(request: NextRequest) {
  const start = Date.now();
  let activeConversationId: string | undefined;

  try {
    const body = await request.json();
    const { conversationId, question } = validateRequest(body);

    activeConversationId = conversationId;

    const requestBody: Parameters<typeof openai.responses.create>[0] = {
      model: CONFIG.MODEL,
      prompt: { id: CONFIG.PROMPT_ID },
      input: [
        {
          type: "message",
          role: "user",
          content: question,
        },
      ],
      tools: [
        {
          type: "file_search",
          vector_store_ids: [CONFIG.VECTOR_STORE_ID],
        },
      ],
      max_output_tokens: CONFIG.MAX_OUTPUT_TOKENS,
      temperature: CONFIG.TEMPERATURE,
      store: true,
    };

    if (activeConversationId) {
      requestBody.conversation = activeConversationId;
    }

    const response = await openai.responses.create(requestBody);

    const answer = extractAnswer(response);
    const responseConversationId = (() => {
      if (response && "conversation" in response) {
        const conversation = (response as { conversation?: unknown })
          .conversation;
        if (typeof conversation === "string") {
          return conversation;
        }
        if (
          conversation &&
          typeof conversation === "object" &&
          "id" in conversation
        ) {
          const conversationId = (conversation as { id?: string }).id;
          if (conversationId) {
            return conversationId;
          }
        }
      }

      const fallbackId = (response as { id?: string })?.id;
      return activeConversationId ?? fallbackId ?? "unknown";
    })();

    const responseData: ChatResponse = {
      conversationId: responseConversationId,
      answer,
      timestamp: new Date().toISOString(),
    };

    logAPICall({
      conversationId: responseConversationId,
      duration: Date.now() - start,
    });

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    logAPICall({
      conversationId: activeConversationId ?? "unknown",
      duration: Date.now() - start,
      error: error?.message ?? "unknown_error",
    });

    if (error?.name === "ZodError") {
      return NextResponse.json<ErrorResponse>(
        {
          error: "INVALID_REQUEST",
          message: "잘못된 요청입니다",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error?.status === 404 && activeConversationId) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "CONVERSATION_NOT_FOUND",
          message: "존재하지 않는 대화입니다",
        },
        { status: 404 }
      );
    }

    if (error?.status) {
      return NextResponse.json<ErrorResponse>(
        {
          error: "OPENAI_API_ERROR",
          message: "AI 서비스 오류입니다. 잠시 후 다시 시도해주세요",
        },
        { status: 502 }
      );
    }

    return NextResponse.json<ErrorResponse>(
      {
        error: "INTERNAL_ERROR",
        message: "서버 오류가 발생했습니다",
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
