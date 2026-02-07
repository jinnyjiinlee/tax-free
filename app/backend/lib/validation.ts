import { z } from "zod";

export const ChatRequestSchema = z.object({
  conversationId: z.string().optional(),
  question: z
    .string()
    .min(1, "질문을 입력해주세요")
    .max(1000, "질문은 1000자를 초과할 수 없습니다")
    .trim(),
});

export type ValidatedChatRequest = z.infer<typeof ChatRequestSchema>;

export function validateRequest(data: unknown): ValidatedChatRequest {
  return ChatRequestSchema.parse(data);
}
