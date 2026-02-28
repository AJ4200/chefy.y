"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeOption = "light" | "dark" | "system"

const options: { value: ThemeOption; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-white/70 p-1 text-sm shadow-sm backdrop-blur-md dark:border-white/20 dark:bg-white/10",
        className,
      )}
      role="group"
      aria-label="Theme"
    >
      {options.map((option) => {
        const isActive = theme === option.value
        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTheme(option.value)}
            className={cn(
              "h-8 rounded-full px-3 text-xs font-semibold transition",
              "text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10",
              isActive && "bg-black/10 text-foreground dark:bg-white/20",
            )}
            aria-pressed={isActive}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
