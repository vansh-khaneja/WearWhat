'use client'

import { motion } from 'framer-motion'
import { Check } from "lucide-react"

export function EnterpriseSection() {
  const features = [
    "AI-Powered Outfit Suggestions",
    "Unlimited Wardrobe Items",
    "Advanced Style Analytics",
    "Priority Support",
    "Custom Style Preferences",
    "Multi-Calendar Integration"
  ]

  return (
    <section className="py-12 px-4 lg:px-8 bg-gray-950 relative overflow-hidden">
      {/* Grid pattern overlay with fading edges */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />
      {/* Left fade gradient */}
      <div 
        className="absolute inset-y-0 left-0 w-80 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to right, rgba(3, 7, 18, 1) 0%, rgba(3, 7, 18, 0.7) 40%, transparent 100%)'
        }}
      />
      {/* Right fade gradient */}
      <div 
        className="absolute inset-y-0 right-0 w-80 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to left, rgba(3, 7, 18, 1) 0%, rgba(3, 7, 18, 0.7) 40%, transparent 100%)'
        }}
      />

      <motion.div 
        className="container mx-auto max-w-4xl relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Elevate your style with WearWhat Pro
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock your wardrobe&apos;s full potential with WearWhat&apos;s advanced AI-powered features and personalized style recommendations.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-left"
              >
                <div className="flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-[#FFB84D]" strokeWidth={3} />
                </div>
                <span className="text-gray-200 text-base">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            className="px-8 py-3 text-base font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-gray-950 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn more
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}

