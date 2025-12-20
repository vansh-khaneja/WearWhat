import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="container mx-auto px-4 lg:px-8 py-4">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0095da] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="3">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              dukaan<sup className="text-xs">®</sup>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
              Products
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
              Company
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
              Resources
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="text-gray-700 hover:text-gray-900 font-medium">Pricing</button>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-gray-700 hover:text-gray-900 font-medium">Sign in</button>
          <Button className="bg-[#0095da] hover:bg-[#0080c0] text-white px-6 py-2 rounded-lg font-medium">
            Start free
          </Button>
        </div>
      </nav>
    </header>
  )
}
