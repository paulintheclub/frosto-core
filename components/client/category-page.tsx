"use client"

import { useState, useMemo } from "react"
import { Category } from "@/lib/categories-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import CategoryCard from "./category/category-card"
import ProductCard from "./products/product-card"
import CategorySidebar from "./category/category-sidebar"
import SortingControls from "./category/sorting-controls"

interface CategoryPageProps {
  category: Category;
  breadcrumbs: { name: string; href: string }[];
}

export default function CategoryPage({ category, breadcrumbs }: CategoryPageProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [availability, setAvailability] = useState(false);
  const [sortBy, setSortBy] = useState('alphabetical');

  const isProductView = category.products && category.products.length > 0;
  
  const filteredAndSortedItems = useMemo(() => {
    let items = isProductView ? category.products : category.subcategories;

    if (!items) return [];

    // Filtering logic here if needed, for now we sort
    
    // Sorting
    const sorted = [...items].sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'reverse-alphabetical') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return sorted;
  }, [category, sortBy, selectedBrands, priceRange, availability]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.slice(0, -1).map((crumb, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </div>
          ))}
           <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{breadcrumbs[breadcrumbs.length - 1].name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <CategorySidebar category={category} />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{category.name}</h1>
            <SortingControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map(item => (
              isProductView 
                ? <ProductCard key={item.id} product={item as any} />
                : <CategoryCard key={item.id} category={item as any} basePath={`/categories/${breadcrumbs.map(b => b.href.split('/').pop()).join('/')}`} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
