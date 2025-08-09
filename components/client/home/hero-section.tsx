import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white pt-32 lg:pt-40 pb-20">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url('/hero-background.png')"
        }}
      />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 bg-blue-600 text-white hover:bg-blue-700">
            New in 2025 • Shipping Across Europe
          </Badge>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Reliable Industrial Refrigeration Equipment for Businesses
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
            Professional cooling solutions with up to 5-year warranty. 
            Trusted by businesses across Europe for over 15 years.
          </p>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              Browse Catalog
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-black hover:bg-gray-200 ">
              Request Quote
            </Button>
          </div>
          
          {/* Key features */}
          <div className="flex flex-wrap gap-6 mt-12 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>24/7 Technical Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Professional Installation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Certified Equipment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
