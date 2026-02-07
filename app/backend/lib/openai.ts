import OpenAI from "openai";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: getEnvVar("OPENAI_API_KEY"),
    });
  }
  return _openai;
}

export const CONFIG = {
  get PROMPT_ID() { return getEnvVar("PROMPT_ID"); },
  get VECTOR_STORE_ID() { return getEnvVar("VECTOR_STORE_ID"); },
  MODEL: "gpt-4o" as const,
  MAX_OUTPUT_TOKENS: 2000,
  TEMPERATURE: 0.3,
};

// 하위 호환용 export
export const openai = new Proxy({} as OpenAI, {
  get(_, prop) {
    return (getOpenAI() as any)[prop];
  },
});
