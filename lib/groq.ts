import { groq } from "@ai-sdk/groq"

// Available Groq models - 8B model often works better for structured output
export const GROQ_MODELS = {
  LLAMA_3_8B: "llama3-8b-8192",
  LLAMA_3_70B: "llama3-70b-8192",
  MIXTRAL: "mixtral-8x7b-32768",
} as const

// Export the groq provider directly
export { groq }
