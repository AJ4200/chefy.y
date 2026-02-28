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
        <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                Saved Recipes
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFavorites(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {favoriteRecipes.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto text-white/30 mb-3" />
                <p className="text-white/50">No saved recipes yet</p>
                <p className="text-white/40 text-sm mt-1">Click the heart icon to save recipes</p>
              </div>
            ) : (
              favoriteRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-4 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedRecipe(recipe)
                    setShowFavorites(false)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-medium">{recipe.name}</h4>
                      <p className="text-white/60 text-sm mt-1">{recipe.description?.slice(0, 80)}...</p>
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
                      className="text-pink-400 hover:bg-white/10"
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
        <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white mb-2">{selectedRecipe.name}</CardTitle>
                <CardDescription className="text-white/80 text-base">{selectedRecipe.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => toggleFavorite(selectedRecipe)}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "border-white/30 hover:bg-white/10",
                    isRecipeFavorite(selectedRecipe.id) ? "text-pink-400" : "text-white",
                  )}
                >
                  <Heart className={cn("w-5 h-5", isRecipeFavorite(selectedRecipe.id) && "fill-current")} />
                </Button>
                <Button
                  onClick={() => setShowSubstitution(true)}
                  variant="outline"
                  size="sm"
                  className="text-white hover:bg-white/10 border-white/30"
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Substitute
                </Button>
                <Button
                  onClick={() => setShowChat(true)}
                  variant="outline"
                  size="sm"
                  className="text-white hover:bg-white/10 border-white/30"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Questions
                </Button>
                <Button
                  onClick={() => setSelectedRecipe(null)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
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
              <h3 className="text-lg font-semibold text-white mb-3">Ingredients</h3>
              <div className="grid gap-2">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white/10">
                    <span className="text-white">{ingredient.name}</span>
                    <span className="text-white/80">{ingredient.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/20" />

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
              <div className="space-y-3">
                {selectedRecipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-white/90 leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/20" />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Chef's Tips</h3>
                <ul className="space-y-2">
                  {selectedRecipe.tips.map((tip, index) => (
                    <li key={index} className="text-white/80 text-sm">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Presentation</h3>
                <p className="text-white/80 text-sm leading-relaxed">{selectedRecipe.presentation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Recipe list view
    return (
      <div className="space-y-4">
        {recipes.length > 0 && <h2 className="text-2xl font-bold text-white mb-4">Generated Recipes</h2>}
        {recipes.map((recipe, index) => (
          <Card
            key={recipe.id || index}
            className={cn(
              "backdrop-blur-lg bg-white/20 border-white/30 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/30",
              "transform hover:shadow-2xl",
            )}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{recipe.name}</CardTitle>
                  <CardDescription className="text-white/70">{recipe.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(recipe)
                  }}
                  className={cn("hover:bg-white/10", isRecipeFavorite(recipe.id) ? "text-pink-400" : "text-white/50")}
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
          <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
            <CardContent className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto text-white/50 mb-4" />
              <p className="text-white/70 text-lg">Add some ingredients and let's cook up something amazing!</p>
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
          <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
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
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 flex flex-col">
      <Header
        onShowHistory={() => {
          setShowHistory(true)
          setShowChat(false)
          setShowSubstitution(false)
          setShowFavorites(false)
          setSelectedRecipe(null)
        }}
        onShowFavorites={() => {
          setShowFavorites(true)
          setShowHistory(false)
          setShowChat(false)
          setShowSubstitution(false)
          setSelectedRecipe(null)
        }}
      />

      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ChefHat className="w-5 h-5" />
                    Recipe Generator
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Tell me what you have, and I'll create magic!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ingredients */}
                  <div>
                    <Label className="text-white font-medium">Available Ingredients</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add ingredient..."
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                        className="backdrop-blur-sm bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                      <Button onClick={addIngredient} size="icon" className="bg-pink-500 hover:bg-pink-600">
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
                    <Label className="text-white font-medium">Preferred Cooking Methods</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="e.g., baking, frying..."
                        value={currentMethod}
                        onChange={(e) => setCurrentMethod(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addCookingMethod()}
                        className="backdrop-blur-sm bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      />
                      <Button onClick={addCookingMethod} size="icon" className="bg-purple-500 hover:bg-purple-600">
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
                    <Label className="text-white font-medium">Cooking Time (minutes, optional)</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      value={cookingTime}
                      onChange={(e) => setCookingTime(e.target.value)}
                      className="backdrop-blur-sm bg-white/20 border-white/30 text-white placeholder:text-white/50 mt-2"
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
                      className="flex-1 border-white/30 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <div className="flex-1">
                      <input type="file" accept=".json" onChange={loadRecipes} className="hidden" id="load-recipes" />
                      <Button
                        onClick={() => document.getElementById("load-recipes")?.click()}
                        variant="outline"
                        className="w-full border-white/30 text-white hover:bg-white/10"
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
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Substitutions
                    </Button>
                    <Button
                      onClick={() => {
                        setShowChat(true)
                        setShowHistory(false)
                        setShowSubstitution(false)
                        setShowFavorites(false)
                        setSelectedChatHistory(null)
                      }}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ask Chef
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">{renderRightPanel()}</div>
          </div>
        </div>
      </main>

      <Footer />
      <CookieConsent />
    </div>
  )
}
