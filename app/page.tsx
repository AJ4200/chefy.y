"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
  MessageCircle,
  ArrowRightLeft,
  Heart,
  HeartOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingIndicator } from "@/components/loading-indicator"
import { ErrorFallback } from "@/components/error-fallback"
import { ChatInterface } from "@/components/chat-interface"
import { ChatHistoryPanel } from "@/components/chat-history-panel"
import { IngredientSubstitution } from "@/components/ingredient-substitution"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { getSavedRecipes, addRecipe, removeRecipe } from "@/lib/storage"
import type { Recipe, ChatHistory } from "@/lib/types"

export default function ChefyY() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [cookingMethods, setCookingMethods] = useState<string[]>([])
  const [currentMethod, setCurrentMethod] = useState("")
  const [cookingTime, setCookingTime] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Feature states
  const [showChat, setShowChat] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSubstitution, setShowSubstitution] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [selectedChatHistory, setSelectedChatHistory] = useState<ChatHistory | null>(null)
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])

  // Load favorites on mount
  useEffect(() => {
    setFavoriteRecipes(getSavedRecipes())
  }, [])

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
      setCookingMethods([...cookingMethods, currentMethod.trim()])
      setCurrentMethod("")
    }
  }

  const removeCookingMethod = (method: string) => {
    setCookingMethods(cookingMethods.filter((m) => m !== method))
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
      // Add IDs to recipes
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

  const handleSelectHistory = (history: ChatHistory) => {
    setSelectedChatHistory(history)
    setShowHistory(false)
    setShowChat(true)
  }

  const openChatPanel = () => {
    setShowChat(true)
    setShowHistory(false)
    setShowSubstitution(false)
    setShowFavorites(false)
    setSelectedChatHistory(null)
    setSelectedRecipe(null)
    setIsGeneratorOpen(false)
  }

  // Determine what to show in the right panel
  const renderRightPanel = () => {
    if (showHistory) {
      return <ChatHistoryPanel onSelectHistory={handleSelectHistory} onClose={() => setShowHistory(false)} />
    }

    if (showSubstitution) {
      return <IngredientSubstitution recipe={selectedRecipe} onClose={() => setShowSubstitution(false)} />
    }

    if (showChat) {
      return (
        <ChatInterface
          recipe={selectedRecipe}
          onClose={() => {
            setShowChat(false)
            setSelectedChatHistory(null)
          }}
          existingHistory={selectedChatHistory}
        />
      )
    }

    if (showFavorites) {
      return (
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                Saved Recipes
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFavorites(false)}
                className="text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {favoriteRecipes.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto text-foreground/30 mb-3" />
                <p className="text-foreground/50">No saved recipes yet</p>
                <p className="text-foreground/40 text-sm mt-1">Click the heart icon to save recipes</p>
              </div>
            ) : (
              favoriteRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 rounded-lg glass-surface hover:bg-black/10 dark:hover:bg-white/20 cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedRecipe(recipe)
                    setShowFavorites(false)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-foreground font-medium">{recipe.name}</h4>
                      <p className="text-foreground/60 text-sm mt-1">{recipe.description?.slice(0, 80)}...</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-pink-500/80 text-white text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {recipe.cookingTime} min
                        </Badge>
                        <Badge className="bg-purple-500/80 text-white text-xs">{recipe.difficulty}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(recipe)
                      }}
                      className="text-pink-400 hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <HeartOff className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )
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
                  onClick={() => setShowChat(true)}
                  variant="outline"
                  size="sm"
                  className="text-foreground hover:bg-black/5 dark:hover:bg-white/10 border-black/10 dark:border-white/30"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Questions
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
                <h3 className="text-lg font-semibold text-foreground mb-3">Chef's Tips</h3>
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

    // Recipe list view
    return (
      <div className="space-y-4">
        {recipes.length > 0 && <h2 className="text-2xl font-bold text-foreground mb-4">Generated Recipes</h2>}
        {recipes.map((recipe, index) => (
          <Card
            key={recipe.id || index}
            className={cn(
              "glass-panel cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-black/5 dark:hover:bg-white/20",
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
                  className={cn("hover:bg-black/5 dark:hover:bg-white/10", isRecipeFavorite(recipe.id) ? "text-pink-400" : "text-foreground/50")}
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
          <Card className="glass-panel">
            <CardContent className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto text-foreground/50 mb-4" />
              <p className="text-foreground/70 text-lg">Add some ingredients and let's cook up something amazing!</p>
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
          <Card className="glass-panel">
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

  const RecipeGeneratorPanel = () => (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <ChefHat className="w-5 h-5" />
          Recipe Generator
        </CardTitle>
        <CardDescription className="text-foreground/70">Tell me what you have, and I'll create magic!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ingredients */}
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

        {/* Cooking Methods */}
        <div>
          <Label className="text-foreground font-medium">Preferred Cooking Methods</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="e.g., baking, frying..."
              value={currentMethod}
              onChange={(e) => setCurrentMethod(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCookingMethod()}
              className="glass-input"
            />
            <Button onClick={addCookingMethod} size="icon" className="bg-purple-500 hover:bg-purple-600 text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {cookingMethods.map((method) => (
              <Badge
                key={method}
                variant="secondary"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 cursor-pointer"
                onClick={() => removeCookingMethod(method)}
              >
                {method} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>

        {/* Cooking Time */}
        <div>
          <Label className="text-foreground font-medium">Cooking Time (minutes, optional)</Label>
          <Input
            type="number"
            placeholder="30"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            className="glass-input mt-2"
          />
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
              Generate with Groq
            </>
          )}
        </Button>

        {/* Save/Load */}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              setShowSubstitution(true)
              setShowChat(false)
              setShowHistory(false)
              setShowFavorites(false)
            }}
            variant="outline"
            className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Substitutions
          </Button>
          <Button
            onClick={openChatPanel}
            variant="outline"
            className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Chefy
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
      <Header
        onShowHistory={() => {
          setShowHistory(true)
          setShowChat(false)
          setShowSubstitution(false)
          setShowFavorites(false)
          setSelectedRecipe(null)
          setIsGeneratorOpen(false)
        }}
        onShowFavorites={() => {
          setShowFavorites(true)
          setShowHistory(false)
          setShowChat(false)
          setShowSubstitution(false)
          setSelectedRecipe(null)
          setIsGeneratorOpen(false)
        }}
      />

      <main className="flex-1 px-4 pb-10 pt-6">
        <div className="container mx-auto max-w-7xl space-y-8">
          <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/80 shadow-2xl dark:border-white/10 dark:bg-white/10">
            <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-gradient-to-br from-pink-400/40 to-purple-500/40 blur-3xl dark:from-pink-500/20 dark:to-purple-500/20" />
            <div className="absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-amber-300/50 to-indigo-400/40 blur-3xl dark:from-amber-400/15 dark:to-indigo-400/20" />
            <div className="relative grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                  AI Kitchen Companion
                </p>
                <h1 className="mt-4 text-4xl font-extrabold text-foreground md:text-5xl">
                  Cook with confidence, even when the fridge looks empty.
                </h1>
                <p className="mt-4 text-lg text-foreground/70">
                  Drop in what you have, choose your cooking style, and let Chefy.Y build a personalized recipe plan in
                  seconds.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() => setIsGeneratorOpen(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                  >
                    Let&apos;s cook
                  </Button>
                  <Button
                    onClick={openChatPanel}
                    variant="outline"
                    className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                  >
                    Ask Chefy
                  </Button>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-lg dark:border-white/20 dark:bg-white/10">
                  <p className="text-sm font-semibold text-foreground">Smart recipes</p>
                  <p className="mt-2 text-sm text-foreground/70">
                    Tailored to your ingredients, cooking method, and time.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-lg dark:border-white/20 dark:bg-white/10">
                  <p className="text-sm font-semibold text-foreground">Instant guidance</p>
                  <p className="mt-2 text-sm text-foreground/70">
                    Ask Chefy for swaps, tips, or step-by-step help anytime.
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-lg dark:border-white/20 dark:bg-white/10">
                  <p className="text-sm font-semibold text-foreground">Save favorites</p>
                  <p className="mt-2 text-sm text-foreground/70">
                    Keep the recipes you love and export them in one click.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div>{renderRightPanel()}</div>
        </div>
      </main>

      <Sheet open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
        <SheetContent side="bottom" className="glass-panel-strong max-h-[90vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl text-foreground">Recipe Generator</SheetTitle>
            <SheetDescription className="text-foreground/70">
              Tell me what you have, then tap generate to get inspired.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <RecipeGeneratorPanel />
          </div>
        </SheetContent>
      </Sheet>

      <Button
        onClick={() => setIsGeneratorOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl hover:from-pink-600 hover:to-purple-600"
        aria-label="Open recipe generator"
      >
        <ChefHat className="h-6 w-6" />
      </Button>

      <Footer />
      <CookieConsent />
    </div>
  )
}




