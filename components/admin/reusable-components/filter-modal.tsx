"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchBrands, setSearchBrands] = useState("")
  const [searchCategories, setSearchCategories] = useState("")

  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG"]
  const categories = ["Електроніка", "Одяг", "Взуття", "Аксесуари", "Дім і сад"]

  const filteredBrands = brands.filter((brand) => brand.toLowerCase().includes(searchBrands.toLowerCase()))

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchCategories.toLowerCase()),
  )

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCategories([])
    setSearchBrands("")
    setSearchCategories("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Фільтри</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="brands" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brands">Бренди</TabsTrigger>
            <TabsTrigger value="categories">Категорії</TabsTrigger>
            <TabsTrigger value="specific">Специфічні фільтри</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-96">
            <TabsContent value="brands" className="space-y-4">
              <div>
                <Label htmlFor="brand-search">Пошук брендів</Label>
                <Input
                  id="brand-search"
                  placeholder="Введіть назву бренду..."
                  value={searchBrands}
                  onChange={(e) => setSearchBrands(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                  </div>
                ))}
              </div>

              {selectedBrands.length > 0 && (
                <div className="space-y-2">
                  <Label>Обрані бренди:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedBrands.map((brand) => (
                      <Badge key={brand} variant="secondary" className="gap-1">
                        {brand}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleBrand(brand)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div>
                <Label htmlFor="category-search">Пошук категорій</Label>
                <Input
                  id="category-search"
                  placeholder="Введіть назву категорії..."
                  value={searchCategories}
                  onChange={(e) => setSearchCategories(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                {filteredCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Обрані категорії:</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary" className="gap-1">
                        {category}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(category)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specific" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Тип категорії</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="end-category" />
                      <Label htmlFor="end-category">Кінцева категорія</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="non-end-category" />
                      <Label htmlFor="non-end-category">Некінцева категорія</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Рівень вкладеності</Label>
                  <div className="space-y-2 mt-2">
                    {[1, 2, 3].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={`level-${level}`} />
                        <Label htmlFor={`level-${level}`}>Рівень {level}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={clearFilters}>
            Очистити фільтри
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Скасувати
            </Button>
            <Button onClick={onClose}>Застосувати фільтри</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
