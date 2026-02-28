"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorFallbackProps {
  error: string
  onRetry: () => void
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
      <CardContent className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Oops! Something went wrong</h3>
        <p className="text-white/70 mb-4">{error}</p>
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}
