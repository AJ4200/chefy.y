import { z } from "zod"
import { createGroqCompletion } from "@/lib/groq-client"

// Simplified schema for better Groq compatibility
const recipeSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      cookingTime: z.number(),
      servings: z.number(),
      difficulty: z.enum(["Easy", "Medium", "Hard"]),
      ingredients: z.array(
        z.object({
          name: z.string(),
          amount: z.string(),
          preparation: z.string().optional(),
        }),
      ),
      instructions: z.array(z.string()),
      cookingMethod: z.string(),
      tips: z.array(z.string()),
      presentation: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  const body = await req.json()
  const ingredients = Array.isArray(body?.ingredients) ? body.ingredients : []
  const cookingMethods = Array.isArray(body?.cookingMethods) ? body.cookingMethods : []
  const cookingTime = typeof body?.cookingTime === "number" ? body.cookingTime : Number(body?.cookingTime)

  try {
    if (!ingredients || ingredients.length === 0) {
      return Response.json({ error: "Ingredients are required" }, { status: 400 })
    }

    // Simplified and more direct prompt for Groq
    const prompt = `Create 3 recipes using these ingredients: ${ingredients.join(", ")}.

${cookingMethods.length > 0 ? `Cooking methods: ${cookingMethods.join(", ")}.` : ""}
${cookingTime ? `Target time: ${cookingTime} minutes.` : ""}

For each recipe, provide:
- name: creative recipe name
- description: brief description
- cookingTime: time in minutes (number)
- servings: number of servings (number)
- difficulty: "Easy", "Medium", or "Hard"
- ingredients: array of objects with name, amount, and optional preparation
- instructions: array of step-by-step instructions
- cookingMethod: main cooking method used
- tips: array of 2-3 helpful tips
- presentation: how to serve and present the dish

Make recipes practical and delicious.
Return only valid JSON with a top-level "recipes" array.`

    const text = await createGroqCompletion(
      [
        {
          role: "system",
          content: "You are a recipe generation assistant. Respond with strict JSON only.",
        },
        { role: "user", content: prompt },
      ],
      { jsonMode: true, temperature: 0.5, maxTokens: 2200 },
    )

    const parsed = safeParseJson(text)
    const validated = recipeSchema.safeParse(parsed)

    if (!validated.success) {
      throw new Error("Model returned an invalid recipe payload")
    }

    return Response.json(validated.data)
  } catch (error) {
    console.error("Error generating recipes:", error)

    try {
      const fallbackPrompt = `Create 3 simple recipes using: ${ingredients.join(", ")}.
      
Format as valid JSON with this structure:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "cookingTime": 30,
      "servings": 4,
      "difficulty": "Easy",
      "ingredients": [{"name": "ingredient", "amount": "1 cup"}],
      "instructions": ["Step 1", "Step 2"],
      "cookingMethod": "baking",
      "tips": ["Tip 1", "Tip 2"],
      "presentation": "How to serve"
    }
  ]
}`

      const fallbackText = await createGroqCompletion(
        [
          { role: "system", content: "Return strict JSON only. Do not add markdown." },
          { role: "user", content: fallbackPrompt },
        ],
        { jsonMode: true, temperature: 0.4, maxTokens: 1800 },
      )

      const parsedFallback = safeParseJson(fallbackText)
      const validatedFallback = recipeSchema.safeParse(parsedFallback)
      if (!validatedFallback.success) {
        throw new Error("Fallback payload did not match schema")
      }

      return Response.json(validatedFallback.data)
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError)
      return Response.json({ error: "Failed to generate recipes. Please try again." }, { status: 500 })
    }
  }
}

function safeParseJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const codeFenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
    const candidate = codeFenceMatch ? codeFenceMatch[1] : text
    return JSON.parse(candidate)
  }
}
