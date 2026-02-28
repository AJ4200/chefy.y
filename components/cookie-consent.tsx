"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cookie, Settings, Check } from "lucide-react"
import { getCookieConsent, setCookieConsent } from "@/lib/storage"
import type { CookieConsent as CookieConsentType } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsentType>({
    necessary: true,
    analytics: false,
    preferences: true,
  })

  useEffect(() => {
    const existingConsent = getCookieConsent()
    if (!existingConsent) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    const fullConsent: CookieConsentType = {
      necessary: true,
      analytics: true,
      preferences: true,
    }
    setCookieConsent(fullConsent)
    setShowBanner(false)
  }

  const acceptSelected = () => {
    setCookieConsent(consent)
    setShowBanner(false)
    setShowSettings(false)
  }

  const rejectNonEssential = () => {
    const minimalConsent: CookieConsentType = {
      necessary: true,
      analytics: false,
      preferences: false,
    }
    setCookieConsent(minimalConsent)
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 cookie-banner">
        <Card className="container mx-auto max-w-4xl backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-black/10 dark:border-white/20 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                  <Cookie className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground font-semibold">Cookie Preferences</h3>
                  <p className="text-foreground/70 text-sm mt-1">
                    We use cookies to enhance your experience, save your recipes, and remember your preferences.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rejectNonEssential}
                  className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10 bg-transparent"
                >
                  Essential Only
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 border-black/10 dark:border-white/20 text-foreground">
        <DialogHeader>
          <DialogTitle>Cookie Settings</DialogTitle>
          <DialogDescription className="text-foreground/70">Manage your cookie preferences below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-foreground font-medium">Necessary Cookies</Label>
              <p className="text-foreground/60 text-sm">Required for basic site functionality.</p>
            </div>
            <Switch checked={true} disabled className="opacity-50" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-foreground font-medium">Preference Cookies</Label>
              <p className="text-foreground/60 text-sm">Save your recipes and chat history.</p>
            </div>
            <Switch
              checked={consent.preferences}
              onCheckedChange={(checked) => setConsent({ ...consent, preferences: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-foreground font-medium">Analytics Cookies</Label>
              <p className="text-foreground/60 text-sm">Help us improve the app experience.</p>
            </div>
            <Switch
              checked={consent.analytics}
              onCheckedChange={(checked) => setConsent({ ...consent, analytics: checked })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowSettings(false)}
            className="border-black/10 dark:border-white/30 text-foreground hover:bg-black/5 dark:hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={acceptSelected}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
          >
            Save Preferences
          </Button>
        </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
