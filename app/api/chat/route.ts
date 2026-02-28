import { streamText } from "ai"
import { groq, GROQ_MODELS } from "@/lib/groq"

export async function POST(req: Request) {
  try {
    const { messages, recipeContext } = await req.json()

    // Add recipe context to the system message if available
    const systemMessage = recipeContext
      ? `You are Chefy.Y's cooking assistant. You provide helpful, friendly advice about cooking.
         
         Current recipe context:
         Recipe: ${recipeContext.name}
         Ingredients: ${recipeContext.ingredients.map((i: any) => i.name).join(", ")}
         Cooking Method: ${recipeContext.cookingMethod}
         
         Answer questions specifically about this recipe when relevant. Be concise, practical, and encouraging.`
      : `You are Chefy.Y's cooking assistant. You provide helpful, friendly advice about cooking.
         Be concise, practical, and encouraging. Focus on answering cooking questions clearly.`

    const result = streamText({
      model: groq(GROQ_MODELS.LLAMA_3_8B),
      messages: [{ role: "system", content: systemMessage }, ...messages],
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat error:", error)
    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
