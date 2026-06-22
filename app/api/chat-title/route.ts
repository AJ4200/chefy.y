import { createGroqCompletion } from "@/lib/groq-client"

const GENERIC_TITLES = new Set(["general chat", "chat", "new chat", "untitled", "conversation"])

function cleanTitle(title: string) {
  const cleaned = title
    .replace(/["'`]/g, "")
    .replace(/^title:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()

  if (!cleaned || GENERIC_TITLES.has(cleaned.toLowerCase())) return null
  return cleaned.slice(0, 60)
}

function fallbackTitle(messages: Array<{ role: string; content: string }>) {
  const firstUserMessage = messages.find((message) => message.role === "user")?.content || "Cooking conversation"
  const cleaned = firstUserMessage
    .replace(/^\[Image uploaded\]\s*/i, "")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()

  return cleaned.split(" ").filter(Boolean).slice(0, 7).join(" ").slice(0, 60) || "Cooking conversation"
}

export async function POST(req: Request) {
  try {
    const { messages, recipeContext } = await req.json()
    const chatMessages = Array.isArray(messages) ? messages : []

    if (recipeContext?.name) {
      return Response.json({ title: cleanTitle(recipeContext.name) || fallbackTitle(chatMessages) })
    }

    const content = await createGroqCompletion(
      [
        {
          role: "system",
          content:
            "Create a specific, descriptive title for a cooking chat. Return only the title, 3-7 words. Never use generic or filler titles such as General Chat, New Chat, Untitled, or Conversation.",
        },
        {
          role: "user",
          content: chatMessages
            .slice(0, 6)
            .map((message: { role: string; content: string }) => `${message.role}: ${message.content}`)
            .join("\n"),
        },
      ],
      { temperature: 0.2, maxTokens: 40 },
    )

    return Response.json({ title: cleanTitle(content) || fallbackTitle(chatMessages) })
  } catch (error) {
    console.error("Chat title error:", error)
    return Response.json({ error: "Failed to generate chat title" }, { status: 500 })
  }
}
