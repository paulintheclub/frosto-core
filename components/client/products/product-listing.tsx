"use client"

import { trpc } from "@/utils/trpc"
import ProductCard from "./product-card"
import { CategoryListSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorBoundary } from "@/components/ui/error-boundary"

interface ProductListingProps {
  categoryId?: string
  limit?: number
  featured?: boolean
  lang?: string
  className?: string
}

export default function ProductListing({ 
  categoryId, 
  limit = 12, 
  featured = false,
  lang = "uk",
  className = ""
}: ProductListingProps) {
  const { data: products, isLoading, error, refetch } = trpc.client.product.getProducts.useQuery({
    categoryId,
    limit,
    featured,
    lang,
  })

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        reset={() => refetch()} 
        title="Failed to load products"
        description="We couldn't load the products. Please try again."
      />
    )
  }

  if (isLoading) {
    return <CategoryListSkeleton />
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    )
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price ? `$${product.price.toFixed(2)}` : undefined,
            availability: product.availability === 'IN_STOCK' ? 'In Stock' : 'On Order',
            brand: product.brand,
          }} 
        />
      ))}
    </div>
  )
}

// Featured Products component for homepage
export function FeaturedProducts({ 
  limit = 8, 
  lang = "uk",
  className = ""
}: { 
  limit?: number
  lang?: string
  className?: string 
}) {
  const { data: products, isLoading, error, refetch } = trpc.client.product.getFeaturedProducts.useQuery({
    limit,
    lang,
  })

  if (error) {
    return (
      <ErrorBoundary 
        error={error} 
        reset={() => refetch()} 
        title="Failed to load featured products"
        description="We couldn't load the featured products. Please try again."
      />
    )
  }

  if (isLoading) {
    return <CategoryListSkeleton />
  }

  if (!products || products.length === 0) {
    return null // Don't show anything if no featured products
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price ? `$${product.price.toFixed(2)}` : undefined,
            availability: product.availability === 'IN_STOCK' ? 'In Stock' : 'On Order',
            brand: product.brand,
          }} 
        />
      ))}
    </div>
  )
}
