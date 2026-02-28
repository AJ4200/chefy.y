import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalChatFab } from "@/components/global-chat-fab"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chefy.Y - AI Recipe Generator",
  description:
    "Transform your ingredients into delicious recipes with Chefy.Y, your AI-powered culinary companion. Generate personalized recipes, get cooking tips, and explore ingredient substitutions.",
  keywords: ["recipe generator", "AI cooking", "meal planning", "ingredient substitution", "cooking assistant"],
  authors: [{ name: "Chefy.Y" }],
  creator: "Chefy.Y",
  publisher: "Chefy.Y",
  openGraph: {
    title: "Chefy.Y - AI Recipe Generator",
    description: "Transform your ingredients into delicious recipes with AI-powered culinary magic",
    type: "website",
    locale: "en_US",
    siteName: "Chefy.Y",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chefy.Y - AI Recipe Generator",
    description: "Transform your ingredients into delicious recipes with AI-powered culinary magic",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#a855f7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <GlobalChatFab />
        </ThemeProvider>
      </body>
    </html>
  )
}
