"use client"

import Link from "next/link"
import { ChefHat, Zap, Menu, History, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface HeaderProps {
  onShowHistory?: () => void
  onShowFavorites?: () => void
}

export function Header({ onShowHistory, onShowFavorites }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const NavLinks = () => (
    <>
      {onShowHistory && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onShowHistory()
            setIsOpen(false)
          }}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <History className="w-4 h-4 mr-2" />
          Chat History
        </Button>
      )}
      {onShowFavorites && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onShowFavorites()
            setIsOpen(false)
          }}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <Heart className="w-4 h-4 mr-2" />
          Saved Recipes
        </Button>
      )}
      <Link href="/terms">
        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
          Terms
        </Button>
      </Link>
      <Link href="/privacy">
        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
          Privacy
        </Button>
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-xl">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Chefy.Y
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
            <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              Powered by Groq
            </Badge>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="backdrop-blur-xl bg-purple-900/90 border-white/20">
              <div className="flex flex-col gap-4 mt-8">
                <Badge className="w-fit bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                  <Zap className="w-3 h-3 mr-1" />
                  Powered by Groq
                </Badge>
                <nav className="flex flex-col gap-2">
                  <NavLinks />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
