"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Plus, X, ChevronRight, Expand } from "lucide-react"

interface ProductModalProps {
  item?: any
  isOpen: boolean
  onClose: () => void
  mode: "add" | "edit"
  type: "product" | "category"
}

export function ProductModal({ item, isOpen, onClose, mode, type }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState("basics")
  const [relationsSubTab, setRelationsSubTab] = useState("related-products")
  const [showBrandSelector, setShowBrandSelector] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState("")
  const [categoryLevel1, setCategoryLevel1] = useState("")
  const [categoryLevel2, setCategoryLevel2] = useState("")
  const [categoryLevel3, setCategoryLevel3] = useState("")

  const [formData, setFormData] = useState({
    name: item?.name || "",
    slug: item?.slug || "",
    sku: item?.sku || "",
    price: item?.price || "",
    availability: item?.availability || "В наявності",
    brand: item?.brand || "",
    description: item?.description || "",
    accessories: item?.accessories || "",
    relatedProducts: item?.relatedProducts || [],
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

  const [relatedProducts] = useState([
    { id: 1, name: "Бездротова миша", sku: "WM-001" },
    { id: 2, name: "USB-C хаб", sku: "UCH-002" },
  ])

  const handleSave = () => {
    console.log("Save:", formData)
    onClose()
  }

  const title =
    mode === "add"
      ? type === "product"
        ? "Додати новий продукт"
        : "Додати нову категорію"
      : type === "product"
        ? "Зміна даних продукту"
        : "Зміна даних категорії"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[700px] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {mode === "add" ? "Створіть новий продукт для вашого каталогу." : "Оновіть інформацію про продукт."}
          </p>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5 bg-muted/30">
              <TabsTrigger value="basics" className="text-xs">
                Основне
              </TabsTrigger>
              <TabsTrigger value="categories" className="text-xs">
                Категорії
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs">
                Медіа
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs">
                Контент
              </TabsTrigger>
              <TabsTrigger value="relations" className="text-xs">
                Зв'язки
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden mt-4">
              <TabsContent value="basics" className="h-full overflow-y-auto space-y-4 m-0 pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Назва *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Назва продукту"
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
                      placeholder="product-slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku" className="text-sm font-medium">
                      Артикул
                    </Label>
                    <Input
                      id="sku"
                      placeholder="SKU-001"
                      value={formData.sku}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">
                      Ціна
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="availability" className="text-sm font-medium">
                      Наявність
                    </Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="В наявності">В наявності</SelectItem>
                        <SelectItem value="Немає в наявності">Немає в наявності</SelectItem>
                        <SelectItem value="Попереднє замовлення">Попереднє замовлення</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Бренд</Label>
                    <div className="relative mt-1">
                      <Input
                        placeholder="Пошук бренду..."
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="pr-10"
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
                </div>
              </TabsContent>

              <TabsContent value="categories" className="h-full overflow-y-auto space-y-4 m-0 pr-2">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Ієрархія категорій</Label>
                  <div className="flex items-center space-x-3">
                    <Select value={categoryLevel1} onValueChange={setCategoryLevel1}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Оберіть категорію" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Електроніка</SelectItem>
                        <SelectItem value="clothing">Одяг</SelectItem>
                        <SelectItem value="accessories">Аксесуари</SelectItem>
                      </SelectContent>
                    </Select>

                    {categoryLevel1 && (
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

                    {categoryLevel2 && categories[categoryLevel2]?.length > 0 && (
                      <>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <Select value={categoryLevel3} onValueChange={setCategoryLevel3}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Підкатегорія" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories[categoryLevel2]?.map((cat) => (
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
              </TabsContent>

              <TabsContent value="media" className="h-full overflow-y-auto space-y-6 m-0 pr-2">
                <div>
                  <Label className="text-sm font-medium">Основне зображення</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50/50">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Натисніть для завантаження або перетягніть</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF до 10МБ</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Галерея зображень</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50/50">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Завантажте кілька зображень</p>
                    <p className="text-xs text-gray-500">Перетягніть для зміни порядку</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Зображення специфікацій</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50/50">
                      <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600">Специфікації</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Зображення комплектації</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50/50">
                      <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600">Що входить в комплект</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="h-full overflow-y-auto space-y-4 m-0 pr-2">
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Опис
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Опис продукту..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="mt-1 min-h-[120px] resize-none"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Аксесуари</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center bg-gray-50/50">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Завантажте фото аксесуарів</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF до 10МБ</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="relations" className="h-full overflow-y-auto m-0 pr-2">
                <Tabs value={relationsSubTab} onValueChange={setRelationsSubTab} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 bg-muted/30 mb-4">
                    <TabsTrigger value="related-products" className="text-xs">
                      Пов'язані продукти
                    </TabsTrigger>
                    <TabsTrigger value="catalogs" className="text-xs">
                      Каталоги
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="related-products" className="flex-1 space-y-4 m-0">
                    <div>
                      <h4 className="text-lg font-medium text-teal-700">Пов'язані продукти</h4>
                      <p className="text-sm text-gray-600">Продукти, які доповнюють цей товар</p>

                      <div className="relative mt-3">
                        <Input placeholder="Пошук за назвою або артикулом..." className="pr-10" />
                        <Button size="sm" className="absolute right-1 top-1 h-7 w-7 p-0 bg-teal-600 hover:bg-teal-700">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 mt-4">
                        {relatedProducts.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.sku}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="catalogs" className="flex-1 space-y-4 m-0">
                    <div>
                      <h4 className="text-lg font-medium text-teal-700">Каталоги</h4>
                      <p className="text-sm text-gray-600">Каталоги, в яких відображається цей продукт</p>

                      <div className="mt-4 p-8 text-center text-gray-500">
                        <p>Функціонал каталогів буде додано пізніше</p>
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
            {mode === "add" ? "Додати" : "Зберегти"} {type === "product" ? "продукт" : "категорію"}
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
