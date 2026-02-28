"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { ChatInterface } from "@/components/chat-interface"
import { ChefHat, Sparkles } from "lucide-react"

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-50 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col">
      <Header />

      <main className="flex-1 px-4 pb-10 pt-6">
        <div className="container mx-auto max-w-7xl space-y-8">
          <section className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/80 shadow-2xl transition-all duration-500 dark:border-white/10 dark:bg-white/10">
            <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-gradient-to-br from-pink-400/40 to-purple-500/40 blur-3xl dark:from-pink-500/20 dark:to-purple-500/20" />
            <div className="absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-amber-300/50 to-indigo-400/40 blur-3xl dark:from-amber-400/15 dark:to-indigo-400/20" />
            <div className="relative grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
              <div className="animate-rise">
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
                    asChild
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Link href="/recipes">
                      <ChefHat className="w-4 h-4" />
                      Let&apos;s cook
                    </Link>
                  </Button>
                  <Button
                    onClick={() => setIsChatOpen(true)}
                    variant="outline"
                    className="border-black/10 text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/5 dark:border-white/30 dark:hover:bg-white/10"
                  >
                    <Sparkles className="w-4 h-4" />
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
                  <p className="text-sm font-semibold text-foreground">Cooking assistant</p>
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
        </div>
      </main>

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

      <Footer />
      <CookieConsent />
    </div>
  )
}
