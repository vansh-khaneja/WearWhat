import Image from "next/image"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ScrollingLogos } from "@/components/scrolling-logos"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { EnterpriseSection } from "@/components/enterprise-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { AuthRedirect } from "@/components/AuthRedirect"

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Client-side auth check: redirects to dashboard if cookie session exists */}
      <AuthRedirect />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 16% 38%, rgba(255, 183, 77, 0.18) 0%, transparent 55%),
            radial-gradient(circle at 30% 55%, rgba(255, 167, 38, 0.14) 0%, transparent 60%),
            radial-gradient(circle at 18% 25%, rgba(232, 244, 252, 0.9) 0%, transparent 45%),
            radial-gradient(circle at 75% 20%, rgba(248, 236, 234, 0.85) 0%, transparent 50%),
            radial-gradient(circle at 20% 75%, rgba(248, 236, 234, 0.7) 0%, transparent 45%),
            radial-gradient(circle at 82% 65%, rgba(232, 244, 252, 0.75) 0%, transparent 45%),
            radial-gradient(circle at 88% 48%, rgba(255, 152, 0, 0.1) 0%, transparent 40%),
            linear-gradient(180deg, #e8f4fc 0%, #eef5f9 30%, #f5f0f2 65%, #fce8e6 100%)
          `,
        }}
      ></div>
      <div className="relative z-10">
      <Header />
      <main className="min-h-screen overflow-x-hidden w-full pt-20">
        <div className="flex min-h-[calc(100vh-80px)] w-full">
          <div className="w-1/2 flex items-center justify-start px-8 lg:px-16">
            <HeroSection />
          </div>
          <div className="w-1/2 hidden lg:flex items-center justify-end px-8 lg:px-16 overflow-visible">
            <img
              src="/very basic chabtot flow running.png"
              alt="Dashboard preview"
              className="rounded-l-2xl shadow-2xl"
              style={{ 
                height: '70vh', 
                width: 'auto',
                objectFit: 'contain',
                maxWidth: 'none',
                transform: 'translateX(40%)'
              }}
            />
          </div>
        </div>
      </main>
      <ScrollingLogos />
      <FeaturesSection />
      <TestimonialsSection />
      <EnterpriseSection />
      <CTASection />
      <Footer />
      </div>
    </div>
  );
}
