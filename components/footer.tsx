"use client"

import Link from "next/link"
import { ChefHat, Github, Twitter, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-xl bg-white/10 border-t border-white/20 mt-auto">
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
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              Your AI-powered culinary companion. Transform your available ingredients into delicious recipes with the
              magic of artificial intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white/70" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-white/70" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">© {currentYear} Chefy.Y. All rights reserved.</p>
          <p className="text-white/50 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> using Groq AI
          </p>
        </div>
      </div>
    </footer>
  )
}
