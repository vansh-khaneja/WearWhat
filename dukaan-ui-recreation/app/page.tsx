import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ChatButton } from "@/components/chat-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4fc] via-[#f0f4f8] to-[#fce8e6] relative overflow-hidden">
      <Header />
      <main className="container mx-auto px-4 lg:px-8 pt-8 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HeroSection />
          {/* Right side placeholder - populate later */}
          <div className="hidden lg:block" />
        </div>
      </main>
      <ChatButton />
    </div>
  )
}
