"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Camera, X, Loader2, Send, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onClose: () => void
  onSendWithImage: (imageUrl: string, question: string) => void
}

export function ImageUpload({ onClose, onSendWithImage }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(null)
  const [question, setQuestion] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | null) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSubmit = async () => {
    if (!image || !question.trim()) return
    setIsLoading(true)

    try {
      onSendWithImage(image, question)
      onClose()
    } catch (error) {
      console.error("Error sending image:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    "What dish is this and how can I make it?",
    "What ingredients do you see here?",
    "How can I improve this dish's presentation?",
    "Is this cooked properly?",
  ]

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3 border-b border-black/10 dark:border-white/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload Food Image
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-foreground hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Upload Zone */}
        <div
          className={`image-upload-zone rounded-xl p-8 text-center transition-all ${
            isDragging ? "drag-active" : ""
          } ${image ? "border-solid border-green-400/50" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />

          {image ? (
            <div className="space-y-4">
              <img
                src={image || "/placeholder.svg"}
                alt="Uploaded food"
                className="max-h-48 mx-auto rounded-lg shadow-lg object-contain"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setImage(null)
                }}
                className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto w-16 h-16 rounded-full glass-surface flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-foreground/50" />
              </div>
              <div>
                <p className="text-foreground font-medium">Drop an image here or click to upload</p>
                <p className="text-foreground/50 text-sm mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Question Input */}
        <div>
          <p className="text-foreground font-medium mb-2">Ask about this image</p>
          <Textarea
            placeholder="What would you like to know about this food?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[80px] glass-input"
          />
        </div>

        {/* Suggested Questions */}
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <Button
              key={q}
              variant="outline"
              size="sm"
              onClick={() => setQuestion(q)}
              className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10 text-xs"
            >
              {q}
            </Button>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!image || !question.trim() || isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Ask About Image
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
