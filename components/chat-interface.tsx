"use client"

import { useEffect, useRef, useState } from "react"
import { nanoid } from "nanoid"
import { ChatMessage, type ChatMessage as ChatMessageType } from "./message"
import { ChatInput } from "./chat-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChefHat, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveChatHistory } from "@/lib/storage"
import type { Recipe, ChatHistory } from "@/lib/types"
import { ImageUpload } from "@/components/image-upload"

interface ChatInterfaceProps {
  recipe: Recipe | null
  onClose: () => void
  existingHistory?: ChatHistory | null
}

export function ChatInterface({ recipe, onClose, existingHistory }: ChatInterfaceProps) {
  const [historyId] = useState(() => existingHistory?.id || nanoid())
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    if (existingHistory?.messages) {
      return existingHistory.messages
    }
    return [
      {
        id: nanoid(),
        role: "assistant",
        content: recipe
          ? `Hi there! I'm your cooking assistant for "${recipe.name}". What questions do you have about this recipe?`
          : "Hi there! I'm your cooking assistant. What cooking questions can I help you with today?",
      },
    ]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (messages.length > 1) {
      const history: ChatHistory = {
        id: historyId,
        recipeId: recipe?.id,
        recipeName: recipe?.name,
        messages,
        createdAt: existingHistory?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      saveChatHistory(history)
    }
  }, [messages, historyId, recipe, existingHistory?.createdAt])

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    const userMessage: ChatMessageType = {
      id: nanoid(),
      role: "user",
      content,
      imageUrl,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const apiMessages = messages.concat(userMessage).map(({ role, content }) => ({ role, content }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          recipeContext: recipe,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const assistantMessageId = nanoid()
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "", timestamp: new Date().toISOString() },
      ])

      const decoder = new TextDecoder()
      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: assistantMessage } : msg)),
        )
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          role: "assistant",
          content: "Sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageQuestion = (imageUrl: string, question: string) => {
    handleSendMessage(`[Image uploaded] ${question}`, imageUrl)
  }

  if (showImageUpload) {
    return <ImageUpload onClose={() => setShowImageUpload(false)} onSendWithImage={handleImageQuestion} />
  }

  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl flex flex-col h-[600px]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Cooking Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowImageUpload(true)}
              className="text-white hover:bg-white/10"
              title="Upload food image"
            >
              <Camera className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator className="bg-white/20" />
      <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <div className="p-4 pt-0">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </Card>
  )
}
