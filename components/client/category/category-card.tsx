"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Category } from "@/lib/categories-data"

interface CategoryCardProps {
  category: Category;
  basePath: string;
}

export default function CategoryCard({ category, basePath }: CategoryCardProps) {
  const productCount = category.products?.length || 0;
  
  return (
    <Link href={`${basePath}/${category.slug}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
            <img
              src={category.imageUrl || "/placeholder.svg"}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-900">
                {category.name}
              </h3>
              {productCount > 0 && (
                <span className="text-xs text-blue-600 font-medium">
                  {productCount} {productCount === 1 ? 'product' : 'products'}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {category.description}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
            >
              View {category.subcategories ? 'Subcategories' : 'Products'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
