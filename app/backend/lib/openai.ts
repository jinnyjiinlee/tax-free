import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

if (!process.env.PROMPT_ID) {
  throw new Error("PROMPT_ID is required");
}

if (!process.env.VECTOR_STORE_ID) {
  throw new Error("VECTOR_STORE_ID is required");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const CONFIG = {
  PROMPT_ID: process.env.PROMPT_ID,
  VECTOR_STORE_ID: process.env.VECTOR_STORE_ID,
  MODEL: "gpt-4o",
  MAX_OUTPUT_TOKENS: 2000,
  TEMPERATURE: 0.3,
} as const;
