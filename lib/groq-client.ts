type GroqMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

type GroqCompletionOptions = {
  jsonMode?: boolean
  temperature?: number
  maxTokens?: number
}

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

const GROQ_MODELS = [
  "llama-3.1-8b-instant",
  "llama3-8b-8192",
  "llama-3.3-70b-versatile",
]

function getApiKey() {
  const key = process.env.GROQ_API_KEY
  if (!key) {
    throw new Error("GROQ_API_KEY is not configured")
  }
  return key
}

async function getErrorMessage(response: Response) {
  try {
    const body = await response.json()
    if (body?.error?.message) return String(body.error.message)
    return JSON.stringify(body)
  } catch {
    return await response.text()
  }
}

export async function createGroqCompletion(messages: GroqMessage[], options: GroqCompletionOptions = {}) {
  const apiKey = getApiKey()
  const errors: string[] = []

  for (const model of GROQ_MODELS) {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1800,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    })

    if (!response.ok) {
      const message = await getErrorMessage(response)
      errors.push(`${model}: ${message}`)

      const modelError =
        message.toLowerCase().includes("model") &&
        (message.toLowerCase().includes("not found") || message.toLowerCase().includes("unsupported"))
      if (modelError) {
        continue
      }

      throw new Error(`Groq API request failed: ${message}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content || typeof content !== "string") {
      throw new Error("Groq API returned an empty completion")
    }

    return content
  }

  throw new Error(`No compatible Groq model available. Errors: ${errors.join(" | ")}`)
}

