"use client"

import { Button } from '@/components/ui/button'

export default function BrandsSection() {
  const brands = [
    { id: 1, name: 'Bitzer', logo: 'CT', href: '/brands/cooltech', logoUrl: '/img.png' },
    { id: 2, name: 'Frascold', logo: 'FP', href: '/brands/frostpro', logoUrl: '/img_1.png' },
    { id: 3, name: 'Copeland', logo: 'AS', href: '/brands/arcticsystems', logoUrl: '/img_2.png' },
    { id: 4, name: 'Danfoss', logo: 'CM', href: '/brands/chillmaster', logoUrl: '/img_3.png' },
    { id: 5, name: 'Bock', logo: 'IF', href: '/brands/iceflow', logoUrl: '/img_4.png' },
    { id: 6, name: 'CryoTech', logo: 'CR', href: '/brands/cryotech' },
    { id: 7, name: 'FreezePro', logo: 'FZ', href: '/brands/freezepro' },
    { id: 8, name: 'ColdChain', logo: 'CC', href: '/brands/coldchain' },
    { id: 9, name: 'ThermalPro', logo: 'TP', href: '/brands/thermalpro' },
    { id: 10, name: 'FrostGuard', logo: 'FG', href: '/brands/frostguard' },
    { id: 11, name: 'ChillCore', logo: 'CC', href: '/brands/chillcore' },
    { id: 12, name: 'IceMaster', logo: 'IM', href: '/brands/icemaster' },
    { id: 13, name: 'CoolFlow', logo: 'CF', href: '/brands/coolflow' },
    { id: 14, name: 'ArcticPro', logo: 'AP', href: '/brands/arcticpro' },
    { id: 15, name: 'FreezeMax', logo: 'FM', href: '/brands/freezemax' },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Brands We Work With
          </h2>
          <p className="text-lg text-gray-600">
            Trusted partnerships with leading refrigeration equipment manufacturers
          </p>
        </div>

        {/* Brand grid - 5 columns, 3 rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {brands.map((brand, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              {brand.logoUrl ? (
                  <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="w-16 h-16 mx-auto mb-4 object-contain"
                  />
              ) : (
                  <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                      <span className="text-white font-bold text-xl">
                        {brand.logo}
                      </span>
                  </div>
              )}
              <h3 className="font-semibold text-gray-900 text-sm">{brand.name}</h3>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Brands
          </Button>
        </div>
      </div>
    </section>
  )
}
