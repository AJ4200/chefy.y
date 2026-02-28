import { generateObject } from "ai"
import { z } from "zod"
import { groq, GROQ_MODELS } from "@/lib/groq"

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
  try {
    const { ingredients, cookingMethods, cookingTime } = await req.json()

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

Make recipes practical and delicious.`

    const result = await generateObject({
      model: groq(GROQ_MODELS.LLAMA_3_8B), // Using 8B model for better JSON generation
      schema: recipeSchema,
      prompt,
      mode: "json", // Explicitly use JSON mode
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Error generating recipes:", error)

    // Fallback to text generation if structured generation fails
    try {
      const { generateText } = await import("ai")
      const { ingredients, cookingMethods, cookingTime } = await req.json()

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

      const textResult = await generateText({
        model: groq(GROQ_MODELS.LLAMA_3_8B),
        prompt: fallbackPrompt,
      })

      // Try to parse the text result as JSON
      const parsedResult = JSON.parse(textResult.text)
      return Response.json(parsedResult)
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError)
      return Response.json({ error: "Failed to generate recipes. Please try again." }, { status: 500 })
    }
  }
}
