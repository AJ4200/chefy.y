"use client"

import { useEffect, useState } from "react"

export function LoadingIndicator() {
  const [dots, setDots] = useState("")
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)

    const timerInterval = setInterval(() => {
      setElapsed((prev) => prev + 0.1)
    }, 100)

    return () => {
      clearInterval(dotInterval)
      clearInterval(timerInterval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-lg font-medium text-white mb-2">Generating with Groq{dots}</div>
      <div className="text-sm text-white/70">{elapsed.toFixed(1)}s elapsed</div>
    </div>
  )
}
