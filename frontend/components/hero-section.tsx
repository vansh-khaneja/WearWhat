'use client'

import { Button } from "@/components/ui/button"
import ThermostatIcon from '@mui/icons-material/Thermostat'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

export function HeroSection() {
  return (
    <div className="max-w-xl flex flex-col">
      <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-tight tracking-tight">
        Never Wonder What to Wear Again
      </h1>
      <p className="mt-3 text-base font-medium text-[#0095da]">
        Your Personalized Style Assistant
      </p>
      <p className="mt-4 text-base md:text-lg text-gray-600 leading-relaxed">
        Make the most of the wardrobe you already own. WearWhat builds confident, put‑together outfits
        <br />
        from your pieces in seconds, tuned to the weather, your plans, and your personal style.
      </p>
      
      {/* Feature highlights */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ThermostatIcon className="w-4 h-4 text-[#0095da]" />
          <span>Weather‑ready outfits</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AutoAwesomeIcon className="w-4 h-4 text-[#0095da]" />
          <span>AI‑powered suggestions</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Button className="bg-[#0095da] hover:bg-[#007ab8] text-white px-8 py-3.5 text-base rounded-lg font-semibold shadow-md hover:shadow-lg focus:ring-[#0095da] active:scale-[0.98]">
          Start styling for free
        </Button>
        <Button className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-8 py-3.5 text-base rounded-lg font-semibold shadow-sm hover:shadow-md focus:ring-gray-300 active:scale-[0.98]">
          See how it works
        </Button>
      </div>
    </div>
  )
}

