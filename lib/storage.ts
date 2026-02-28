import type { Recipe, ChatHistory, CookieConsent, UserPreferences } from "./types"

const STORAGE_KEYS = {
  RECIPES: "chefy-y-recipes",
  CHAT_HISTORIES: "chefy-y-chat-histories",
  COOKIE_CONSENT: "chefy-y-cookie-consent",
  PREFERENCES: "chefy-y-preferences",
} as const

// Safe localStorage access
function getItem(key: string): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function setItem(key: string, value: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    console.error("Failed to save to localStorage:", e)
  }
}

// Recipe Storage
export function getSavedRecipes(): Recipe[] {
  const data = getItem(STORAGE_KEYS.RECIPES)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveRecipes(recipes: Recipe[]): void {
  setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes))
}

export function addRecipe(recipe: Recipe): void {
  const recipes = getSavedRecipes()
  const newRecipe = {
    ...recipe,
    id: recipe.id || crypto.randomUUID(),
    createdAt: recipe.createdAt || new Date().toISOString(),
  }
  recipes.push(newRecipe)
  saveRecipes(recipes)
}

export function removeRecipe(recipeId: string): void {
  const recipes = getSavedRecipes()
  saveRecipes(recipes.filter((r) => r.id !== recipeId))
}

// Chat History Storage
export function getChatHistories(): ChatHistory[] {
  const data = getItem(STORAGE_KEYS.CHAT_HISTORIES)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveChatHistory(history: ChatHistory): void {
  const histories = getChatHistories()
  const existingIndex = histories.findIndex((h) => h.id === history.id)
  if (existingIndex >= 0) {
    histories[existingIndex] = { ...history, updatedAt: new Date().toISOString() }
  } else {
    histories.push(history)
  }
  // Keep only last 50 chat histories
  const trimmed = histories.slice(-50)
  setItem(STORAGE_KEYS.CHAT_HISTORIES, JSON.stringify(trimmed))
}

export function getChatHistoryById(id: string): ChatHistory | null {
  const histories = getChatHistories()
  return histories.find((h) => h.id === id) || null
}

export function deleteChatHistory(id: string): void {
  const histories = getChatHistories()
  setItem(STORAGE_KEYS.CHAT_HISTORIES, JSON.stringify(histories.filter((h) => h.id !== id)))
}

export function clearAllChatHistories(): void {
  setItem(STORAGE_KEYS.CHAT_HISTORIES, JSON.stringify([]))
}

// Cookie Consent
export function getCookieConsent(): CookieConsent | null {
  const data = getItem(STORAGE_KEYS.COOKIE_CONSENT)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function setCookieConsent(consent: CookieConsent): void {
  setItem(
    STORAGE_KEYS.COOKIE_CONSENT,
    JSON.stringify({
      ...consent,
      acceptedAt: new Date().toISOString(),
    }),
  )
}

// Export all data
export function exportAllData(): UserPreferences {
  return {
    savedRecipes: getSavedRecipes(),
    chatHistories: getChatHistories(),
    cookieConsent: getCookieConsent(),
    lastVisit: new Date().toISOString(),
  }
}

// Import data
export function importData(data: Partial<UserPreferences>): void {
  if (data.savedRecipes) saveRecipes(data.savedRecipes)
  if (data.chatHistories) setItem(STORAGE_KEYS.CHAT_HISTORIES, JSON.stringify(data.chatHistories))
  if (data.cookieConsent) setCookieConsent(data.cookieConsent)
}
