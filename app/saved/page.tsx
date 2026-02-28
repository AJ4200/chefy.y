"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HeartOff, Clock, Utensils, Heart } from "lucide-react"
import { getSavedRecipes, removeRecipe } from "@/lib/storage"
import type { Recipe } from "@/lib/types"

export default function SavedRecipesPage() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    setSavedRecipes(getSavedRecipes())
  }, [])

  const handleRemove = (recipeId?: string) => {
    if (!recipeId) return
    removeRecipe(recipeId)
    const updated = savedRecipes.filter((r) => r.id !== recipeId)
    setSavedRecipes(updated)
    if (selectedRecipe?.id === recipeId) {
      setSelectedRecipe(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
      <Header />

      <main className="flex-1 px-4 pb-10 pt-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Saved Recipes</h1>
            <span className="text-sm text-foreground/60">{savedRecipes.length} saved</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {savedRecipes.length === 0 && (
                <Card className="glass-panel">
                  <CardContent className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto text-foreground/30 mb-3" />
                    <p className="text-foreground/50">No saved recipes yet</p>
                    <p className="text-foreground/40 text-sm mt-1">Save recipes from the generator to see them here.</p>
                  </CardContent>
                </Card>
              )}
              {savedRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="glass-panel cursor-pointer hover:bg-black/5 dark:hover:bg-white/20 transition-all"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-foreground">{recipe.name}</CardTitle>
                        <CardDescription className="text-foreground/70">{recipe.description}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-pink-400 hover:bg-black/5 dark:hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(recipe.id)
                        }}
                      >
                        <HeartOff className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-pink-500/80 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {recipe.cookingTime} min
                      </Badge>
                      <Badge className="bg-purple-500/80 text-white">{recipe.cookingMethod}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              {!selectedRecipe ? (
                <Card className="glass-panel">
                  <CardContent className="text-center py-12">
                    <p className="text-foreground/60">Select a recipe to see the details.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground mb-2">{selectedRecipe.name}</CardTitle>
                    <CardDescription className="text-foreground/80 text-base">
                      {selectedRecipe.description}
                    </CardDescription>
                    <div className="flex gap-4 mt-4">
                      <Badge className="bg-pink-500/80 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedRecipe.cookingTime} min
                      </Badge>
                      <Badge className="bg-purple-500/80 text-white">
                        <Utensils className="w-3 h-3 mr-1" />
                        {selectedRecipe.servings} servings
                      </Badge>
                      <Badge className="bg-indigo-500/80 text-white">{selectedRecipe.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Ingredients</h3>
                      <div className="grid gap-2">
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded-lg glass-surface">
                            <span className="text-foreground">{ingredient.name}</span>
                            <span className="text-foreground/80">{ingredient.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-black/10 dark:bg-white/20" />

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
                      <div className="space-y-3">
                        {selectedRecipe.instructions.map((instruction, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <p className="text-foreground/90 leading-relaxed">{instruction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CookieConsent />
    </div>
  )
}
