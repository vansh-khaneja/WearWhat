export function ScrollingLogos() {
  // Option 1: Stats & Metrics (Social Proof)
  const stats = [
    "Stop Staring at Your Closet",
    "Actually Know What to Wear",
    "Your Style, Your Vibe",
    "No Subscription, Just Style",
    "Built for Real People",
    "Weather Check Included",
    "Mix and Match Like a Pro",
    "Dress Confidently Every Day"
  ]

  // Option 2: Trust Indicators (Alternative - uncomment to use)
  // const trustIndicators = [
  //   "✓ Free to Start",
  //   "✓ No Credit Card",
  //   "✓ Privacy Protected",
  //   "✓ Instant Setup",
  //   "✓ AI-Powered",
  //   "✓ 24/7 Available",
  //   "✓ Easy to Use",
  //   "✓ Smart Recommendations"
  // ]

  // Option 3: Value Propositions (Alternative - uncomment to use)
  // const valueProps = [
  //   "Save Time Every Morning",
  //   "Look Your Best Always",
  //   "Smart Style Decisions",
  //   "Weather-Ready Outfits",
  //   "Personalized Recommendations",
  //   "Maximize Your Wardrobe",
  //   "Confidence in Every Outfit",
  //   "Style That Fits You"
  // ]

  // Duplicate the array for seamless scrolling
  const duplicatedItems = [...stats, ...stats]

  return (
    <div className="w-full py-8 overflow-hidden" style={{ backgroundColor: '#1A181E' }}>
      <div className="flex animate-scroll whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="inline-flex items-center justify-center mx-16 text-xl font-bold"
            style={{ color: '#A1A0A2' }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

