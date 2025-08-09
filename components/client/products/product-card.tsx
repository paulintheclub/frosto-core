"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/lib/categories-data"
import Link from "next/link"

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group h-full">
      <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm relative h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-white">
            <img
              src={product.imageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-4 bg-white flex flex-col flex-grow">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-xs text-gray-600 mb-3">
              {product.brand.name}
            </p>
            
            <div className="flex items-center justify-between mb-3 mt-auto">
              <span className="text-lg font-bold text-gray-900">
                {product.price}
              </span>
              <Badge variant={product.availability === 'In Stock' ? 'default' : 'secondary'} className="text-xs w-fit">
                {product.availability}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1 text-xs" asChild>
                <div className="w-full">Details</div>
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                Request Info
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
