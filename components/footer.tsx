"use client"

import Link from "next/link"
import { ChefHat, Github, Twitter, Heart, Zap } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-xl bg-white/80 dark:bg-white/10 border-t border-black/10 dark:border-white/20 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-xl">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Chefy.Y
              </span>
            </Link>
            <p className="text-foreground/70 text-sm leading-relaxed max-w-md">
              Your AI-powered culinary companion. Transform your available ingredients into delicious recipes with the
              magic of artificial intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-foreground/70 hover:text-foreground text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/70 hover:text-foreground text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground/70 hover:text-foreground text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors dark:bg-white/10 dark:hover:bg-white/20"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-foreground/70" />
              </a>
              <a
                href="https://github.com/aj4200"
                className="p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-colors dark:bg-white/10 dark:hover:bg-white/20"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-foreground/70" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/10 dark:border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/60 text-sm">(c) {currentYear} Chefy.Y. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/60">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> by{" "}
              <a href="https://github.com/aj4200" className="font-semibold text-foreground hover:underline">
                aj4200
              </a>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
              <Zap className="w-3 h-3" />
              Powered by Groq
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
