export interface Recipe {
  id?: string
  name: string
  description: string
  cookingTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  ingredients: Array<{
    name: string
    amount: string
    preparation?: string
  }>
  instructions: string[]
  cookingMethod: string
  tips: string[]
  presentation: string
  createdAt?: string
  isFavorite?: boolean
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
  imageUrl?: string
}

export interface ChatHistory {
  id: string
  recipeId?: string
  recipeName?: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface Substitution {
  original: string
  substitute: string
  ratio: string
  notes: string
}

export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  preferences: boolean
  acceptedAt?: string
}

export interface UserPreferences {
  savedRecipes: Recipe[]
  chatHistories: ChatHistory[]
  cookieConsent: CookieConsent | null
  lastVisit: string
}
