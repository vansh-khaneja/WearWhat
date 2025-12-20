import { Button } from "@/components/ui/button"
import { Apple } from "lucide-react"

export function HeroSection() {
  return (
    <div className="max-w-xl pt-8 lg:pt-16">
      <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-tight tracking-tight">
        Your Global Commerce Partner, Engineered for Peak Performance
      </h1>
      <p className="mt-6 text-lg text-gray-600 leading-relaxed">
        Launch your eye-catching online store with ease,
        <br />
        attract and convert more customers than ever before.
      </p>
      <Button className="mt-8 bg-[#0095da] hover:bg-[#0080c0] text-white px-8 py-6 text-lg rounded-lg font-medium">
        Get started
      </Button>
      <div className="mt-6 flex items-center gap-2 text-gray-500">
        <span className="text-sm">Also available on</span>
        <Apple className="w-5 h-5 text-gray-800" />
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path
            fill="#34A853"
            d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 01-.612-1.593V3.407c0-.6.226-1.144.611-1.593z"
          />
          <path
            fill="#FBBC04"
            d="M17.556 8.236L3.609 1.814a2.38 2.38 0 011.618-.14l14.62 8.463-2.29 2.327-2.291-2.327-2.29 2.327 2.29 2.327 2.291-2.327 2.29 2.327-2.29 2.327-14.62 8.463a2.38 2.38 0 01-1.618-.14l13.947-6.422"
          />
          <path
            fill="#4285F4"
            d="M21.743 12L17.556 8.236l-2.291 2.327 2.291 2.327-2.291 2.327 2.291 2.327L21.743 12z"
          />
          <path fill="#EA4335" d="M3.609 1.814l13.947 6.422 2.29-2.327L5.227 1.674a2.38 2.38 0 00-1.618.14z" />
        </svg>
      </div>
    </div>
  )
}
