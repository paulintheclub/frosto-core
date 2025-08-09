"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface CategorySidebarProps {
  hideBrandFilter?: boolean
}

export default function CategorySidebar({ hideBrandFilter = false }: CategorySidebarProps) {
  const [categorySearch, setCategorySearch] = useState('')
  const [brandSearch, setBrandSearch] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [isBrandFilterOpen, setIsBrandFilterOpen] = useState(true)
  const [isSubcategoryFilterOpen, setIsSubcategoryFilterOpen] = useState(true)

  const categories = [
    { name: 'Refrigeration Units', href: '/categories/refrigeration-units', active: true },
    { name: 'Evaporators', href: '/categories/evaporators', active: false },
    { name: 'Condensers', href: '/categories/condensers', active: false },
    { name: 'Freezer Cabinets', href: '/categories/freezer-cabinets', active: false },
    { name: 'Display Cases', href: '/categories/display-cases', active: false },
    { name: 'Cold Storage Rooms', href: '/categories/cold-storage-rooms', active: false },
    { name: 'Control Panels', href: '/categories/control-panels', active: false },
    { name: 'Compressors', href: '/categories/compressors', active: false },
  ]

  const brands = [
    'CoolTech', 'FrostPro', 'ArcticSystems', 'ChillMaster', 'IceFlow',
    'CryoTech', 'FreezePro', 'ColdChain', 'ThermalPro', 'FrostGuard',
    'ChillCore', 'IceMaster', 'CoolFlow', 'ArcticPro', 'FreezeMax'
  ]

  const subcategories = [
    'Outdoor Units', 'Monoblocks', 'Split Systems', 'Condensing Units',
    'Air-Cooled Units', 'Water-Cooled Units', 'Low Temperature Units',
    'Medium Temperature Units', 'High Temperature Units'
  ]

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const filteredBrands = brands.filter(brand =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  )

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const SidebarContent = () => (
    <div className="w-64 space-y-4">
      {/* Categories Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Categories</h3>
        <nav className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
          {filteredCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`block px-2 py-1.5 rounded text-sm transition-colors ${
                category.active
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Search in Categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-2 text-sm">Search Categories</h4>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="pl-7 text-sm h-8"
          />
        </div>
      </div>

      {/* Brand Filter - conditionally rendered */}
      {!hideBrandFilter && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Collapsible open={isBrandFilterOpen} onOpenChange={setIsBrandFilterOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h4 className="font-medium text-gray-900 text-sm">Filter by Brand</h4>
              {isBrandFilterOpen ? (
                <ChevronUp className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {/* Search in Brands */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="pl-7 text-sm h-8"
                />
              </div>
              
              {/* Brand List */}
              <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
                {filteredBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => handleBrandToggle(brand)}
                      className="h-3 w-3"
                    />
                    <label
                      htmlFor={brand}
                      className="text-xs text-gray-700 cursor-pointer hover:text-blue-600"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {/* Subcategory Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <Collapsible open={isSubcategoryFilterOpen} onOpenChange={setIsSubcategoryFilterOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h4 className="font-medium text-gray-900 text-sm">Subcategories</h4>
            {isSubcategoryFilterOpen ? (
              <ChevronUp className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
              {subcategories.map((subcategory) => (
                <div key={subcategory} className="flex items-center space-x-2">
                  <Checkbox id={subcategory} className="h-3 w-3" />
                  <label
                    htmlFor={subcategory}
                    className="text-xs text-gray-700 cursor-pointer hover:text-blue-600"
                  >
                    {subcategory}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-32 self-start flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Filter className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="p-4 h-full overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
