import { Clock, Shield, Headphones, Award } from 'lucide-react'

export default function AboutSection() {
  const advantages = [
    {
      icon: Award,
      title: '15 Years of Experience',
      description: 'Proven expertise in industrial refrigeration'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock technical assistance'
    },
    {
      icon: Shield,
      title: 'Up to 5-Year Warranty',
      description: 'Comprehensive coverage for peace of mind'
    },
    {
      icon: Clock,
      title: 'Certified Production',
      description: 'All equipment meets industry standards'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - About text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About IndustrialCool
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                For over 15 years, IndustrialCool has been a leading provider of industrial 
                refrigeration equipment across Europe. We specialize in delivering reliable, 
                energy-efficient cooling solutions for businesses of all sizes.
              </p>
              <p className="text-lg">
                Our commitment to quality, combined with exceptional customer service and 
                technical expertise, has made us the trusted choice for thousands of 
                businesses. From small retail operations to large industrial facilities, 
                we provide the right cooling solutions for your specific needs.
              </p>
            </div>
          </div>

          {/* Right side - Advantages grid */}
          <div className="grid grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <advantage.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
