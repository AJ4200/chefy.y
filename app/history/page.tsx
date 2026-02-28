"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { ChatHistoryPanel } from "@/components/chat-history-panel"
import { ChatInterface } from "@/components/chat-interface"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { ChatHistory } from "@/lib/types"

export default function HistoryPage() {
  const [selectedHistory, setSelectedHistory] = useState<ChatHistory | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const openHistoryChat = (history: ChatHistory) => {
    setSelectedHistory(history)
    setIsChatOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
      <Header />

      <main className="flex-1 px-4 pb-10 pt-6">
        <div className="container mx-auto max-w-5xl space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Chat History</h1>
          <ChatHistoryPanel onSelectHistory={openHistoryChat} />
        </div>
      </main>

      <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
        <SheetContent side="bottom" className="glass-panel-strong max-h-[90vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle className="text-2xl text-foreground">Cooking Assistant</SheetTitle>
            <SheetDescription className="text-foreground/70">
              Review your previous conversation or continue where you left off.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ChatInterface
              recipe={null}
              onClose={() => setIsChatOpen(false)}
              existingHistory={selectedHistory}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Footer />
      <CookieConsent />
    </div>
  )
}
