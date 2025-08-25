"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronRight } from "lucide-react"

interface EditModalProps {
  item: any
  isOpen: boolean
  onClose: () => void
}

export function EditModal({ item, isOpen, onClose }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    sku: "",
    price: "",
    deliveryTime: "",
    stockCount: "",
    tags: "",
    availability: true,
    brand: item?.brand || "",
    category: "",
    subcategory: "",
    subsubcategory: "",
  })

  const isProduct = item?.type === "product"

  const handleSave = () => {
    // Implementation for save functionality
    console.log("Save item:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isProduct ? "Редагувати продукт" : "Редагувати категорію"}: {item?.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Загальна інформація</TabsTrigger>
            <TabsTrigger value="categories">Категорії</TabsTrigger>
            {isProduct && <TabsTrigger value="accessories">Аксесуари</TabsTrigger>}
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-96">
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Назва</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {isProduct && (
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <Label htmlFor="description">Опис</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                {isProduct && (
                  <>
                    <div>
                      <Label htmlFor="price">Ціна</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="deliveryTime">Час доставки (днів)</Label>
                      <Input
                        id="deliveryTime"
                        type="number"
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="stockCount">Кількість на складі</Label>
                      <Input
                        id="stockCount"
                        type="number"
                        value={formData.stockCount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, stockCount: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="brand">Бренд</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть бренд" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apple">Apple</SelectItem>
                          <SelectItem value="Samsung">Samsung</SelectItem>
                          <SelectItem value="Nike">Nike</SelectItem>
                          <SelectItem value="Adidas">Adidas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="tags">Теги (через кому)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                        placeholder="тег1, тег2, тег3"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="availability"
                        checked={formData.availability}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, availability: checked }))}
                      />
                      <Label htmlFor="availability">Доступний для продажу</Label>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Каскадний вибір категорій</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Категорія" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Електроніка</SelectItem>
                        <SelectItem value="clothing">Одяг</SelectItem>
                        <SelectItem value="shoes">Взуття</SelectItem>
                      </SelectContent>
                    </Select>

                    {formData.category && (
                      <>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <Select
                          value={formData.subcategory}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Підкатегорія" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="smartphones">Смартфони</SelectItem>
                            <SelectItem value="laptops">Ноутбуки</SelectItem>
                            <SelectItem value="tablets">Планшети</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}

                    {formData.subcategory && (
                      <>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <Select
                          value={formData.subsubcategory}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, subsubcategory: value }))}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Під-підкатегорія" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="android">Android</SelectItem>
                            <SelectItem value="ios">iOS</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Поточна ієрархія:</h4>
                  <div className="text-sm text-muted-foreground">
                    {formData.category && (
                      <span>
                        {formData.category}
                        {formData.subcategory && ` → ${formData.subcategory}`}
                        {formData.subsubcategory && ` → ${formData.subsubcategory}`}
                      </span>
                    )}
                    {!formData.category && "Категорія не обрана"}
                  </div>
                </div>
              </div>
            </TabsContent>

            {isProduct && (
              <TabsContent value="accessories" className="space-y-4">
                <div>
                  <Label>Зображення аксесуарів</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">Перетягніть зображення сюди або натисніть для вибору</p>
                    <Button variant="outline" className="mt-2 bg-transparent">
                      Вибрати файли
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button onClick={handleSave}>Зберегти зміни</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
