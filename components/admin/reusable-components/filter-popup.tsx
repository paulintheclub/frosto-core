"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Search, Tag, Grid3X3, Settings } from "lucide-react"

interface FilterPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterPopup({ isOpen, onClose }: FilterPopupProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })

  if (!isOpen) return null

  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony"]
  const categories = ["Електроніка", "Одяг", "Взуття", "Аксесуари"]

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-border rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Фільтри</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="brands" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brands" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1">
              <Grid3X3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="specific" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Пошук брендів..." className="pl-10" />
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBrands([...selectedBrands, brand])
                      } else {
                        setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                      }
                    }}
                  />
                  <label htmlFor={brand} className="text-sm font-medium">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-3">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category])
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== category))
                      }
                    }}
                  />
                  <label htmlFor={category} className="text-sm font-medium">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specific" className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ціновий діапазон</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Від"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <Input
                  placeholder="До"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose} className="flex-1 bg-transparent">
            Скасувати
          </Button>
          <Button size="sm" className="flex-1">
            Застосувати
          </Button>
        </div>
      </div>
    </div>
  )
}
