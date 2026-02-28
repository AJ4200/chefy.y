"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Trash2, MessageCircle, X, ChefHat } from "lucide-react"
import { getChatHistories, deleteChatHistory, clearAllChatHistories } from "@/lib/storage"
import type { ChatHistory } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ChatHistoryPanelProps {
  onSelectHistory: (history: ChatHistory) => void
  onClose: () => void
}

export function ChatHistoryPanel({ onSelectHistory, onClose }: ChatHistoryPanelProps) {
  const [histories, setHistories] = useState<ChatHistory[]>([])

  useEffect(() => {
    setHistories(getChatHistories().reverse()) // Most recent first
  }, [])

  const handleDelete = (id: string) => {
    deleteChatHistory(id)
    setHistories(histories.filter((h) => h.id !== id))
  }

  const handleClearAll = () => {
    clearAllChatHistories()
    setHistories([])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b border-white/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <History className="w-5 h-5" />
            Chat History
          </CardTitle>
          <div className="flex items-center gap-2">
            {histories.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-300 hover:text-red-200 hover:bg-red-500/20">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="backdrop-blur-xl bg-purple-900/95 border-white/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Clear All Chat History?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/70">
                      This will permanently delete all your saved chat conversations. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-white/30 text-white hover:bg-white/10">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600 text-white">
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {histories.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto text-white/30 mb-3" />
                <p className="text-white/50">No chat history yet</p>
                <p className="text-white/40 text-sm mt-1">Start a conversation with the cooking assistant</p>
              </div>
            ) : (
              histories.map((history) => (
                <div
                  key={history.id}
                  className="group p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  onClick={() => onSelectHistory(history)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <ChefHat className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <span className="text-white font-medium truncate">{history.recipeName || "General Chat"}</span>
                      </div>
                      <p className="text-white/60 text-sm truncate">
                        {history.messages[history.messages.length - 1]?.content.slice(0, 60)}...
                      </p>
                      <p className="text-white/40 text-xs mt-2">
                        {formatDate(history.updatedAt)} · {history.messages.length} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-200 hover:bg-red-500/20 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(history.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
