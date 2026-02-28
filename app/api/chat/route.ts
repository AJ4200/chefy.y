import { createGroqCompletion } from "@/lib/groq-client"

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

    const content = await createGroqCompletion(
      [{ role: "system", content: systemMessage }, ...messages],
      { temperature: 0.6, maxTokens: 1400 },
    )

    return new Response(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return Response.json({ error: "Failed to process chat" }, { status: 500 })
  }
}
