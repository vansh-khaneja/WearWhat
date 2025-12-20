import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Upload, Tag, Cpu, Sparkles, Cloud, Database, Lightbulb } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Wardrobe",
      description: "Simply take photos of your clothing items and upload them to your digital wardrobe. Our system will automatically organize everything for you.",
      icon: Upload,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02",
      title: "AI-Powered Tagging",
      description: "Our advanced AI analyzes each item to identify categories (tops, bottoms, outerwear), specific types (T-shirt, Jeans, Jacket), and attributes like color, style, and material.",
      icon: Tag,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      title: "Smart Storage",
      description: "Your wardrobe is securely stored in the cloud with detailed tags, making it easy to search and organize your entire collection.",
      icon: Cloud,
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "04",
      title: "Intelligent Matching",
      description: "Our AI considers weather conditions, your calendar events, personal style preferences, and color coordination to suggest perfect outfit combinations.",
      icon: Cpu,
      color: "from-orange-500 to-red-500"
    },
    {
      number: "05",
      title: "Get Outfit Suggestions",
      description: "Receive personalized outfit recommendations in seconds. Mix and match items you already own to create fresh, stylish looks every day.",
      icon: Sparkles,
      color: "from-indigo-500 to-purple-500"
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#f0f9ff'
        }}
      ></div>
      <div className="relative z-10">
        <Header />
        
        <main className="pt-20 pb-16">
          {/* Hero Section */}
          <section className="container mx-auto px-4 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                How WearWhat Works
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Transform your wardrobe into a smart styling assistant. Here&apos;s how our AI-powered platform helps you create perfect outfits effortlessly.
              </p>
            </div>
          </section>

          {/* Steps Section */}
          <section className="container mx-auto px-4 lg:px-8 py-12">
            <div className="max-w-5xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={index}
                    className="mb-16 last:mb-0"
                  >
                    <div className="flex flex-col md:flex-row items-start gap-8">
                      {/* Step Number and Icon */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-xl opacity-30`}></div>
                          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-center mb-4">
                              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                            </div>
                            <div className="text-4xl font-bold text-gray-200 text-center">
                              {step.number}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          {step.title}
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Connector Line (except for last item) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block ml-12 mt-8 mb-8">
                        <div className="w-0.5 h-16 bg-gradient-to-b from-gray-300 to-transparent"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Features Highlight */}
          <section className="container mx-auto px-4 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0095da] to-[#007ab8] mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why It Works So Well
                </h2>
                <p className="text-lg text-gray-600">
                  Our AI understands fashion like a personal stylist
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0095da] mb-2">100+</div>
                  <div className="text-gray-600">Clothing Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0095da] mb-2">50+</div>
                  <div className="text-gray-600">Style Attributes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0095da] mb-2">∞</div>
                  <div className="text-gray-600">Outfit Combinations</div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 lg:px-8 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands who&apos;ve transformed their morning routine with WearWhat
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/"
                  className="px-8 py-4 bg-[#0095da] hover:bg-[#007ab8] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Styling for Free
                </a>
                <a
                  href="/"
                  className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-semibold rounded-lg bg-white hover:bg-gray-50 transition-all"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}

