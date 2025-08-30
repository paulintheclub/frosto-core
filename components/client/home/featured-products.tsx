"use client"

import { FeaturedProducts } from "../products/product-listing"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeaturedProductsSectionProps {
  lang?: string
}

export default function FeaturedProductsSection({ lang = "uk" }: FeaturedProductsSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular refrigeration equipment, trusted by businesses worldwide 
            for their reliability and performance.
          </p>
        </div>

        <FeaturedProducts lang={lang} limit={8} />

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/products">
              Browse All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
