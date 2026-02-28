"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendHorizonal } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSend(input)
      setInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        placeholder="Ask a cooking question..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
        className="min-h-[60px] resize-none bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        className="h-[60px] w-[60px] bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        disabled={isLoading || !input.trim()}
      >
        <SendHorizonal className="h-5 w-5" />
      </Button>
    </form>
  )
}
