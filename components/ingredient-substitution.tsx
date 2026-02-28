"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowRightLeft, Search, X, Loader2 } from "lucide-react"
import type { Recipe } from "@/lib/types"

interface IngredientSubstitutionProps {
  recipe?: Recipe | null
  onClose: () => void
}

export function IngredientSubstitution({ recipe, onClose }: IngredientSubstitutionProps) {
  const [ingredient, setIngredient] = useState("")
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [substitutions, setSubstitutions] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const findSubstitutions = async () => {
    if (!ingredient.trim()) return

    setIsLoading(true)
    setSubstitutions("")

    try {
      const response = await fetch("/api/substitution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient: ingredient.trim(),
          recipeContext: recipe?.name,
          dietaryRestrictions: dietaryRestrictions.trim() || undefined,
        }),
      })

      if (!response.ok) throw new Error("Failed to get substitutions")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let result = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        result += decoder.decode(value)
        setSubstitutions(result)
      }
    } catch (error) {
      console.error("Error getting substitutions:", error)
      setSubstitutions("Sorry, I couldn't find substitutions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const quickIngredients = ["Eggs", "Butter", "Milk", "Flour", "Sugar", "Oil"]

  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
      <CardHeader className="pb-3 border-b border-white/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Ingredient Substitution
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <Label className="text-white font-medium">What ingredient do you need to replace?</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="e.g., eggs, butter, milk..."
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && findSubstitutions()}
              className="backdrop-blur-sm bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
            <Button
              onClick={findSubstitutions}
              disabled={!ingredient.trim() || isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickIngredients.map((item) => (
            <Button
              key={item}
              variant="outline"
              size="sm"
              onClick={() => setIngredient(item)}
              className="border-white/30 text-white hover:bg-white/10"
            >
              {item}
            </Button>
          ))}
        </div>

        <div>
          <Label className="text-white font-medium">Dietary restrictions (optional)</Label>
          <Input
            placeholder="e.g., vegan, gluten-free, nut-free..."
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            className="backdrop-blur-sm bg-white/20 border-white/30 text-white placeholder:text-white/50 mt-2"
          />
        </div>

        {(substitutions || isLoading) && (
          <>
            <Separator className="bg-white/20" />
            <div className="min-h-[200px]">
              <h3 className="text-white font-semibold mb-3">Substitution Options</h3>
              {isLoading && !substitutions ? (
                <div className="flex items-center gap-2 text-white/70">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Finding substitutions...
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white/10 text-white/90 whitespace-pre-wrap leading-relaxed">
                  {substitutions}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
