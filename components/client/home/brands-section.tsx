"use client"

import { trpc } from "@/utils/trpc"
import { Button } from '@/components/ui/button'
import { BrandsSkeleton } from '@/components/ui/loading-skeleton'
import { InlineError } from '@/components/ui/error-boundary'
import Link from 'next/link'

interface BrandsSectionProps {
  lang?: string
}

export default function BrandsSection({ lang = "uk" }: BrandsSectionProps) {
  // Используем новый client namespace
  const { data: brands, isLoading, error, refetch } = trpc.client.brand.getAllBrands.useQuery({
    lang,
  })

  if (error) {
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
          <InlineError 
            error={error} 
            reset={() => refetch()} 
            className="py-8"
          />
        </div>
      </section>
    )
  }

  if (isLoading) {
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
          <BrandsSkeleton />
        </div>
      </section>
    )
  }

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

        {/* Brand grid - responsive columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {brands?.map((brand) => (
            // Генерируем href на фронтенде из slug
            <Link key={brand.id} href={`/brands/${brand.slug}`} className="group">
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow group-hover:bg-gray-100">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const fallback = document.createElement('div')
                      fallback.className = 'w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors'
                      fallback.innerHTML = `<span class="text-white font-bold text-lg">${brand.name.slice(0, 2).toUpperCase()}</span>`
                      parent.insertBefore(fallback, target)
                    }
                  }}
                />
                <h3 className="font-semibold text-gray-900 text-sm">{brand.name}</h3>
                {brand.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {brand.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/brands">View All Brands</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}