import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="backdrop-blur-lg bg-white/20 border-white/30 shadow-xl">
          <CardHeader className="text-center border-b border-white/20">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-white">Privacy Policy</CardTitle>
            <p className="text-white/70">Last updated: December 3, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none p-8">
            <div className="space-y-8 text-white/90">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                <p className="leading-relaxed mb-3">We collect the following types of information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Ingredients and Preferences:</strong> The ingredients, cooking methods, and preferences you
                    provide to generate recipes
                  </li>
                  <li>
                    <strong>Chat History:</strong> Conversations with our AI cooking assistant (stored locally)
                  </li>
                  <li>
                    <strong>Saved Recipes:</strong> Recipes you choose to save (stored locally in your browser)
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Basic analytics about how you interact with the Service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Generate personalized recipes based on your inputs</li>
                  <li>Provide AI cooking assistance</li>
                  <li>Save your preferences and recipe history locally</li>
                  <li>Improve our Service and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage</h2>
                <p className="leading-relaxed">
                  Most of your data is stored locally in your browser using localStorage. This means your recipes and
                  chat history remain on your device and are not transmitted to our servers except when actively
                  generating recipes or chatting with the AI assistant.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
                <p className="leading-relaxed">
                  We use Groq AI to power our recipe generation and chat features. When you generate recipes or chat,
                  your inputs are processed by Groq's AI models. Please review Groq's privacy policy for information
                  about their data practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
                <p className="leading-relaxed">
                  We use cookies and local storage to remember your preferences and provide a better experience. You can
                  manage your cookie preferences through our cookie consent banner or your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access your stored data through the export feature</li>
                  <li>Delete your local data by clearing browser storage</li>
                  <li>Opt out of non-essential cookies</li>
                  <li>Request information about data we process</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your information. However, no method of
                  transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us through our website.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
