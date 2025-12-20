"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="WearWhat Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="text-2xl font-bold text-gray-900">
              WearWhat
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
              Features
              <ChevronDown className="w-4 h-4" />
            </button>
            <a href="/how-it-works" className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
              How it Works
            </a>
            <button className="text-gray-700 hover:text-gray-900 font-medium">Pricing</button>
            <button className="text-gray-700 hover:text-gray-900 font-medium">About</button>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <a href="/login" className="hidden sm:block text-gray-700 hover:text-gray-900 font-medium">Sign in</a>
          <a href="/signup">
            <Button className="bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:shadow-md focus:ring-[#0095da] active:scale-[0.98]">
              Start free
            </Button>
          </a>
        </div>
      </nav>
      </div>
    </header>
  )
}

