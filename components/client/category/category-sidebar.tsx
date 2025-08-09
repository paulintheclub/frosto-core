"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BrandFilter from "./brand-filter"
import ProductFilter from "../products/product-filter"
import { Category } from "@/lib/categories-data"

interface CategorySidebarProps {
  category: Category;
  // This will be expanded with actual filter state and handlers
}

export default function CategorySidebar({ category }: CategorySidebarProps) {
  const isProductView = category.products && category.products.length > 0;

  const allBrands = ["CoolTech", "FrostPro", "ArcticSystems", "Bitzer"]; // Placeholder
  const maxPrice = 2000; // Placeholder

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        {isProductView ? (
          <ProductFilter 
            priceRange={[0, maxPrice]}
            onPriceChange={() => {}}
            availability={false}
            onAvailabilityChange={() => {}}
            maxPrice={maxPrice}
          />
        ) : (
          <BrandFilter 
            brands={allBrands}
            selectedBrands={[]}
            onChange={() => {}}
          />
        )}
      </CardContent>
    </Card>
  )
}
