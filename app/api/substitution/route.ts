import { streamText } from "ai"
import { groq, GROQ_MODELS } from "@/lib/groq"

export async function POST(req: Request) {
  try {
    const { ingredient, recipeContext, dietaryRestrictions } = await req.json()

    const systemMessage = `You are a culinary expert specializing in ingredient substitutions.
    
Your task is to provide practical ingredient substitutions. For each substitution:
1. Name the substitute ingredient
2. Provide the exact ratio/conversion (e.g., "1:1" or "use half the amount")
3. Explain any adjustments needed in cooking method or timing
4. Note any flavor or texture differences

Be concise and practical. Format each substitution clearly.

${recipeContext ? `Current recipe context: ${recipeContext}` : ""}
${dietaryRestrictions ? `Dietary restrictions to consider: ${dietaryRestrictions}` : ""}`

    const result = streamText({
      model: groq(GROQ_MODELS.LLAMA_3_8B),
      messages: [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: `What can I substitute for ${ingredient}? Give me 3-4 good alternatives with exact ratios and any cooking adjustments needed.`,
        },
      ],
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Substitution error:", error)
    return Response.json({ error: "Failed to get substitutions" }, { status: 500 })
  }
}
