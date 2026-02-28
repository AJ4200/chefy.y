import { cn } from "@/lib/utils"
import { ChefHat, User } from "lucide-react"

export type MessageRole = "user" | "assistant"

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp?: string
  imageUrl?: string
}

interface ChatMessageProps {
  message: ChatMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn("flex w-full items-start gap-3 py-3", message.role === "user" ? "justify-end" : "justify-start")}
    >
      {message.role === "assistant" && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <ChefHat className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          message.role === "user"
            ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            : "glass-surface text-foreground",
        )}
      >
        {message.imageUrl && (
          <img
            src={message.imageUrl || "/placeholder.svg"}
            alt="Uploaded food"
            className="max-w-full max-h-48 rounded-lg mb-2 object-contain"
          />
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {message.role === "user" && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
