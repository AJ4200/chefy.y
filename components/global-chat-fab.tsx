"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ChatInterface } from "@/components/chat-interface"

export function GlobalChatFab() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="bottom" className="glass-panel-strong max-h-[90vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl text-foreground">Cooking Assistant</SheetTitle>
            <SheetDescription className="text-foreground/70">
              Ask Chefy anything about ingredients, techniques, or recipes.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ChatInterface recipe={null} onClose={() => setIsChatOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Button
        onClick={() => setIsChatOpen(true)}
        size="icon"
        className="animate-gentle-bob fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-600"
        aria-label="Open cooking assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  )
}

