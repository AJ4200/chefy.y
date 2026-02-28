"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChefHat,
  Clock,
  Utensils,
  Sparkles,
  Download,
  Upload,
  X,
  Plus,
  Zap,
  ArrowRightLeft,
  Heart,
  Timer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingIndicator } from "@/components/loading-indicator"
import { ErrorFallback } from "@/components/error-fallback"
import { IngredientSubstitution } from "@/components/ingredient-substitution"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { getSavedRecipes, addRecipe, removeRecipe } from "@/lib/storage"
import type { Recipe } from "@/lib/types"

export default function RecipesPage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [cookingMethods, setCookingMethods] = useState<string[]>([])
  const [customMethods, setCustomMethods] = useState<string[]>([])
  const [currentMethod, setCurrentMethod] = useState("")
  const [cookingTime, setCookingTime] = useState("")
  const [isCustomMethodOpen, setIsCustomMethodOpen] = useState(false)
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSubstitution, setShowSubstitution] = useState(false)
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    setFavoriteRecipes(getSavedRecipes())
  }, [])

  const methodTemplates = [
    { label: "Stir-fry", icon: Zap },
    { label: "Bake", icon: ChefHat },
    { label: "Boil", icon: Utensils },
    { label: "Steam", icon: Sparkles },
    { label: "Grill", icon: Clock },
  ]

  const timeTemplates = [
    { value: "15", label: "15 min", icon: Timer },
    { value: "30", label: "30 min", icon: Clock },
    { value: "45", label: "45 min", icon: Clock },
    { value: "60", label: "60 min", icon: Clock },
  ]

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()])
      setCurrentIngredient("")
    }
  }

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  const addCookingMethod = () => {
    if (currentMethod.trim() && !cookingMethods.includes(currentMethod.trim())) {
      const method = currentMethod.trim()
      setCookingMethods([...cookingMethods, method])
      if (!customMethods.includes(method)) {
        setCustomMethods([...customMethods, method])
      }
      setCurrentMethod("")
    }
  }

  const removeCookingMethod = (method: string) => {
    setCookingMethods(cookingMethods.filter((m) => m !== method))
  }

  const toggleCookingMethod = (method: string) => {
    if (cookingMethods.includes(method)) {
      removeCookingMethod(method)
      return
    }
    setCookingMethods([...cookingMethods, method])
  }

  const toggleCookingTimeTemplate = (time: string) => {
    setIsCustomTimeOpen(false)
    setCookingTime(cookingTime === time ? "" : time)
  }

  const generateRecipes = async () => {
    if (ingredients.length === 0) return

    setIsGenerating(true)
    setError(null)
    try {
      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          cookingMethods,
          cookingTime: cookingTime ? Number.parseInt(cookingTime) : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate recipes")
      }

      const data = await response.json()
      const recipesWithIds = data.recipes.map((r: Recipe) => ({
        ...r,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }))
      setRecipes(recipesWithIds)
    } catch (error) {
      console.error("Error generating recipes:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleFavorite = (recipe: Recipe) => {
    const isFavorite = favoriteRecipes.some((r) => r.id === recipe.id)
    if (isFavorite) {
      removeRecipe(recipe.id!)
      setFavoriteRecipes(favoriteRecipes.filter((r) => r.id !== recipe.id))
    } else {
      addRecipe(recipe)
      setFavoriteRecipes([...favoriteRecipes, recipe])
    }
  }

  const isRecipeFavorite = (recipeId?: string) => {
    return recipeId ? favoriteRecipes.some((r) => r.id === recipeId) : false
  }

  const exportRecipes = () => {
    const dataStr = JSON.stringify(recipes, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", "chefy-y-recipes.json")
    linkElement.click()
  }

  const loadRecipes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const loadedRecipes = JSON.parse(e.target?.result as string)
          setRecipes(loadedRecipes)
        } catch (error) {
          console.error("Error loading recipes:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const renderRightPanel = () => {
    if (showSubstitution) {
      return <IngredientSubstitution recipe={selectedRecipe} onClose={() => setShowSubstitution(false)} />
    }

    if (selectedRecipe) {
      return (
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-foreground mb-2">{selectedRecipe.name}</CardTitle>
                <CardDescription className="text-foreground/80 text-base">{selectedRecipe.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => toggleFavorite(selectedRecipe)}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "border-black/10 dark:border-white/30 hover:bg-black/5 dark:hover:bg-white/10",
                    isRecipeFavorite(selectedRecipe.id) ? "text-pink-400" : "text-foreground",
                  )}
                >
                  <Heart className={cn("w-5 h-5", isRecipeFavorite(selectedRecipe.id) && "fill-current")} />
                </Button>
                <Button
                  onClick={() => setShowSubstitution(true)}
                  variant="outline"
                  size="sm"
                  className="text-foreground hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/30"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Substitute
                </Button>
                <Button
                  onClick={() => setSelectedRecipe(null)}
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
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

            <Separator className="bg-black/10 dark:bg-white/20" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Chef&apos;s Tips</h3>
                <ul className="space-y-2">
                  {selectedRecipe.tips.map((tip, index) => (
                    <li key={index} className="text-foreground/80 text-sm">
                      - {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Presentation</h3>
                <p className="text-foreground/80 text-sm leading-relaxed">{selectedRecipe.presentation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {recipes.length > 0 && <h2 className="text-2xl font-bold text-foreground mb-4">Generated Recipes</h2>}
        {recipes.map((recipe, index) => (
          <Card
            key={recipe.id || index}
            className={cn(
              "glass-panel animate-rise cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-black/5 dark:hover:bg-white/20",
              "transform hover:shadow-2xl",
            )}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-foreground">{recipe.name}</CardTitle>
                  <CardDescription className="text-foreground/70">{recipe.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(recipe)
                  }}
                  className={cn(
                    "hover:bg-black/5 dark:hover:bg-white/10",
                    isRecipeFavorite(recipe.id) ? "text-pink-400" : "text-foreground/50",
                  )}
                >
                  <Heart className={cn("w-5 h-5", isRecipeFavorite(recipe.id) && "fill-current")} />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-pink-500/80 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {recipe.cookingTime} min
                </Badge>
                <Badge className="bg-purple-500/80 text-white">{recipe.cookingMethod}</Badge>
                <Badge className="bg-indigo-500/80 text-white">{recipe.difficulty}</Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
        {recipes.length === 0 && !isGenerating && !error && (
          <Card className="glass-panel animate-rise">
            <CardContent className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto text-foreground/50 mb-4" />
              <p className="text-foreground/70 text-lg">Add some ingredients and let&apos;s cook up something amazing!</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <ErrorFallback
            error={error}
            onRetry={() => {
              setError(null)
              generateRecipes()
            }}
          />
        )}
        {recipes.length === 0 && isGenerating && (
          <Card className="glass-panel animate-rise">
            <CardContent className="text-center py-12">
              <div className="animate-pulse">
                <Zap className="w-16 h-16 mx-auto text-green-400 mb-4" />
              </div>
              <LoadingIndicator />
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
      <Header />

      <main className="flex-1 px-4 pb-10 pt-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ChefHat className="w-5 h-5" />
                    Recipe Generator
                  </CardTitle>
                  <CardDescription className="text-foreground/70">
                    Tell me what you have, and I&apos;ll create magic!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-foreground font-medium">Available Ingredients</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add ingredient..."
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                        className="glass-input"
                      />
                      <Button onClick={addIngredient} size="icon" className="bg-pink-500 hover:bg-pink-600 text-white">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ingredients.map((ingredient) => (
                        <Badge
                          key={ingredient}
                          variant="secondary"
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 cursor-pointer"
                          onClick={() => removeIngredient(ingredient)}
                        >
                          {ingredient} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">Preferred Cooking Methods</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {methodTemplates.map(({ label, icon: Icon }) => (
                        <Button
                          key={label}
                          type="button"
                          variant="ghost"
                          onClick={() => toggleCookingMethod(label)}
                          className={cn(
                            "h-auto min-h-20 flex-col gap-2 rounded-xl border p-3 text-center transition-all duration-300",
                            cookingMethods.includes(label)
                              ? "border-transparent bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg"
                              : "border-black/10 bg-white/60 text-foreground dark:border-white/30 dark:bg-white/5 hover:-translate-y-0.5 hover:bg-black/5 dark:hover:bg-white/10",
                          )}
                        >
                          <Icon className="h-7 w-7" />
                          <span className="text-[11px] font-semibold tracking-wide">{label}</span>
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsCustomMethodOpen((prev) => !prev)}
                        className={cn(
                          "h-auto min-h-20 flex-col gap-2 rounded-xl border border-dashed border-black/15 bg-white/60 p-3 text-center transition-all duration-300 dark:border-white/30 dark:bg-white/5 hover:-translate-y-0.5 hover:bg-black/5 dark:hover:bg-white/10",
                          isCustomMethodOpen && "border-pink-500/50 bg-pink-500/10",
                        )}
                      >
                        <Plus className="h-7 w-7" />
                        <span className="text-[11px] font-semibold tracking-wide">Custom</span>
                      </Button>
                    </div>
                    {isCustomMethodOpen && (
                      <div className="mt-3 flex gap-2 animate-rise">
                        <Input
                          placeholder="Add custom method..."
                          value={currentMethod}
                          onChange={(e) => setCurrentMethod(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCookingMethod()}
                          className="glass-input"
                        />
                        <Button onClick={addCookingMethod} size="icon" className="bg-purple-500 hover:bg-purple-600 text-white">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customMethods.map((method) => (
                        <Badge
                          key={method}
                          variant="secondary"
                          className={cn(
                            "cursor-pointer transition-all duration-300",
                            cookingMethods.includes(method)
                              ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
                              : "bg-black/10 text-foreground/80 dark:bg-white/20",
                          )}
                          onClick={() => toggleCookingMethod(method)}
                        >
                          {method} {cookingMethods.includes(method) ? <X className="w-3 h-3 ml-1" /> : null}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-foreground font-medium">Cooking Time</Label>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {timeTemplates.map(({ value, label, icon: Icon }) => (
                        <Button
                          key={value}
                          type="button"
                          variant="ghost"
                          onClick={() => toggleCookingTimeTemplate(value)}
                          className={cn(
                            "h-auto min-h-20 flex-col gap-2 rounded-xl border p-3 text-center transition-all duration-300",
                            cookingTime === value
                              ? "border-transparent bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-lg"
                              : "border-black/10 bg-white/60 text-foreground dark:border-white/30 dark:bg-white/5 hover:-translate-y-0.5 hover:bg-black/5 dark:hover:bg-white/10",
                          )}
                        >
                          <Icon className="h-7 w-7" />
                          <span className="text-[11px] font-semibold tracking-wide">{label}</span>
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsCustomTimeOpen((prev) => !prev)
                          if (!isCustomTimeOpen) setCookingTime("")
                        }}
                        className={cn(
                          "h-auto min-h-20 flex-col gap-2 rounded-xl border border-dashed border-black/15 bg-white/60 p-3 text-center transition-all duration-300 dark:border-white/30 dark:bg-white/5 hover:-translate-y-0.5 hover:bg-black/5 dark:hover:bg-white/10",
                          isCustomTimeOpen && "border-pink-500/50 bg-pink-500/10",
                        )}
                      >
                        <Plus className="h-7 w-7" />
                        <span className="text-[11px] font-semibold tracking-wide">Custom</span>
                      </Button>
                    </div>
                    {isCustomTimeOpen && (
                      <Input
                        type="number"
                        placeholder="Custom minutes..."
                        value={cookingTime}
                        onChange={(e) => setCookingTime(e.target.value)}
                        className="glass-input mt-3 animate-rise"
                      />
                    )}
                  </div>

                  <Button
                    onClick={generateRecipes}
                    disabled={ingredients.length === 0 || isGenerating}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate and Cook
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={exportRecipes}
                      disabled={recipes.length === 0}
                      variant="outline"
                      className="flex-1 border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <div className="flex-1">
                      <input type="file" accept=".json" onChange={loadRecipes} className="hidden" id="load-recipes" />
                      <Button
                        onClick={() => document.getElementById("load-recipes")?.click()}
                        variant="outline"
                        className="w-full border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      onClick={() => setShowSubstitution(true)}
                      variant="outline"
                      className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Substitutions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">{renderRightPanel()}</div>
          </div>
        </div>
      </main>

      <Footer />
      <CookieConsent />
    </div>
  )
}
