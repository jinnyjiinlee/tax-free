export interface ChatRequest {
  conversationId?: string;
  question: string;
}

export interface ChatResponse {
  conversationId: string;
  answer: string;
  timestamp: string;
}

export interface ErrorResponse {
  error: ErrorCode;
  message: string;
  details?: unknown;
  retryAfter?: number;
}

export type ErrorCode =
  | "INVALID_REQUEST"
  | "CONVERSATION_NOT_FOUND"
  | "RATE_LIMIT_EXCEEDED"
  | "OPENAI_API_ERROR"
  | "INTERNAL_ERROR";

export interface OpenAIResponse {
  id: string;
  object: "response";
  output: ResponseOutput[];
}

export interface ResponseOutput {
  type: "message";
  content: ContentBlock[];
}

export interface ContentBlock {
  type: "text";
  text: string;
  annotations?: Annotation[];
}

export interface Annotation {
  type: "file_citation";
  file_citation: {
    file_id: string;
    quote: string;
  };
}
