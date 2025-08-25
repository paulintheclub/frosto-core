"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ChevronRight, Expand } from "lucide-react"

interface CategoryModalProps {
  item?: any
  isOpen: boolean
  onClose: () => void
  mode: "add" | "edit"
  parentCategory?: string
}

export function CategoryModal({ item, isOpen, onClose, mode, parentCategory }: CategoryModalProps) {
  const [activeTab, setActiveTab] = useState("basics")
  const [navigationSubTab, setNavigationSubTab] = useState("category")
  const [showBrandSelector, setShowBrandSelector] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState("")
  const [categoryLevel1, setCategoryLevel1] = useState("")
  const [categoryLevel2, setCategoryLevel2] = useState("")

  const [formData, setFormData] = useState({
    name: item?.name || "",
    slug: item?.slug || "",
    description: item?.description || "",
    parentCategory: parentCategory || item?.parentCategory || "none",
    sortOrder: item?.sortOrder || "",
    isActive: item?.isActive ?? true,
  })

  const brands = [
    { id: 1, name: "Apple", logo: "/apple-logo-minimalist.png" },
    { id: 2, name: "Samsung", logo: "/samsung-logo.png" },
    { id: 3, name: "Xiaomi", logo: "/xiaomi-logo.png" },
    { id: 4, name: "Sony", logo: "/sony-logo.png" },
    { id: 5, name: "LG", logo: "/lg-logo-abstract.png" },
    { id: 6, name: "Huawei", logo: "/abstract-petal-design.png" },
  ]

  const categories = {
    "": [],
    electronics: [
      { id: "smartphones", name: "Смартфони" },
      { id: "laptops", name: "Ноутбуки" },
      { id: "tablets", name: "Планшети" },
    ],
    smartphones: [
      { id: "android", name: "Android" },
      { id: "ios", name: "iOS" },
    ],
    laptops: [
      { id: "gaming", name: "Ігрові" },
      { id: "business", name: "Бізнес" },
    ],
  }

  const handleSave = () => {
    console.log("Save category:", formData)
    onClose()
  }

  const title = mode === "add" ? "Додати нову категорію" : "Зміна даних категорії"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "add" ? "Створіть нову категорію для вашого каталогу." : "Оновіть інформацію про категорію."}
          </p>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-muted/30">
              <TabsTrigger value="basics" className="text-sm">
                Основне
              </TabsTrigger>
              <TabsTrigger value="navigation" className="text-sm">
                Навігація
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden mt-4">
              <TabsContent value="basics" className="h-full overflow-y-auto space-y-4 m-0 pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Назва категорії *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Назва категорії"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-sm font-medium">
                      Слаг
                    </Label>
                    <Input
                      id="slug"
                      placeholder="category-slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Опис
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Опис категорії..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-1 min-h-[120px] resize-none"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Зображення категорії</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50/50">
                    <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Натисніть для завантаження або перетягніть</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF до 5МБ</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="navigation" className="h-full overflow-y-auto m-0 pr-2">
                <Tabs value={navigationSubTab} onValueChange={setNavigationSubTab} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/30 mb-4">
                    <TabsTrigger value="category" className="text-sm">
                      Категорія
                    </TabsTrigger>
                    <TabsTrigger value="brand" className="text-sm">
                      Бренд
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="category" className="flex-1 space-y-4 m-0">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Батьківська категорія</Label>
                      <div className="flex items-center space-x-3">
                        <Select value={categoryLevel1} onValueChange={setCategoryLevel1}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Оберіть категорію" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Без батьківської категорії</SelectItem>
                            <SelectItem value="electronics">Електроніка</SelectItem>
                            <SelectItem value="clothing">Одяг</SelectItem>
                            <SelectItem value="accessories">Аксесуари</SelectItem>
                          </SelectContent>
                        </Select>

                        {categoryLevel1 && categoryLevel1 !== "none" && (
                          <>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <Select value={categoryLevel2} onValueChange={setCategoryLevel2}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Підкатегорія" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories[categoryLevel1]?.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sortOrder" className="text-sm font-medium">
                        Порядок сортування
                      </Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        placeholder="0"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: e.target.value }))}
                        className="mt-1 w-48"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="brand" className="flex-1 space-y-4 m-0">
                    <div>
                      <Label className="text-sm font-medium">Пов'язаний бренд</Label>
                      <div className="relative mt-1">
                        <Input
                          placeholder="Пошук бренду..."
                          value={selectedBrand}
                          onChange={(e) => setSelectedBrand(e.target.value)}
                          className="pr-10 w-64"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-7 w-7 p-0"
                          onClick={() => setShowBrandSelector(true)}
                        >
                          <Expand className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
            {mode === "add" ? "Додати" : "Зберегти"} категорію
          </Button>
        </div>
      </DialogContent>

      {showBrandSelector && (
        <Dialog open={showBrandSelector} onOpenChange={setShowBrandSelector}>
          <DialogContent className="max-w-2xl h-[500px]">
            <DialogHeader>
              <DialogTitle>Оберіть бренд</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 p-4">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedBrand(brand.name)
                      setShowBrandSelector(false)
                    }}
                  >
                    <img src={brand.logo || "/placeholder.svg"} alt={brand.name} className="w-12 h-12 mb-2" />
                    <span className="text-sm font-medium">{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
