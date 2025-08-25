"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2, Tag, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {StatCard} from "@/components/admin/reusable-components/stat-card";

// Mock brands-control data
const mockBrands = [
  {
    id: "1",
    name: "Apple",
    logo: "/placeholder.svg?height=60&width=60",
    productsCount: 25,
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Samsung",
    logo: "/placeholder.svg?height=60&width=60",
    productsCount: 18,
    createdDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Nike",
    logo: "/placeholder.svg?height=60&width=60",
    productsCount: 42,
    createdDate: "2024-02-01",
  },
  {
    id: "4",
    name: "Adidas",
    logo: "/placeholder.svg?height=60&width=60",
    productsCount: 35,
    createdDate: "2024-02-10",
  },
  {
    id: "5",
    name: "Sony",
    logo: "/placeholder.svg?height=60&width=60",
    productsCount: 8,
    createdDate: "2024-03-01",
  },
]




export function BrandsSection() {
  const [brands, setBrands] = useState(mockBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [isAddingBrand, setIsAddingBrand] = useState(false)

  const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const handleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([])
    } else {
      setSelectedBrands(filteredBrands.map((brand) => brand.id))
    }
  }

  const handleDeleteBrand = (brandId: string) => {
    setBrands((prev) => prev.filter((brand) => brand.id !== brandId))
  }

  const handleBulkDelete = () => {
    setBrands((prev) => prev.filter((brand) => !selectedBrands.includes(brand.id)))
    setSelectedBrands([])
  }

  const totalBrands = brands.length
  const totalProducts = brands.reduce((sum, brand) => sum + brand.productsCount, 0)

  const stats = [
    {
      label: "Всього брендів",
      value: totalBrands,
      icon: Tag,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Всього продуктів",
      value: totalProducts,
      icon: Tag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Середньо продуктів",
      value: Math.round(totalProducts / totalBrands),
      icon: Tag,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle>Бренди</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Пошук брендів..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button onClick={() => setIsAddingBrand(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Додати бренд
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedBrands.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Обрано {selectedBrands.length} брендів:</span>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Видалити
              </Button>
            </div>
          )}

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={() => handleSelectBrand(brand.id)}
                      />

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={brand.logo || "/placeholder.svg"} />
                        <AvatarFallback>{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{brand.name}</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setEditingBrand(brand)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteBrand(brand.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="bg-muted/50 rounded-md px-2 py-1 inline-block">
                          <span className="text-sm font-medium">{brand.productsCount} продуктів</span>
                        </div>

                        <p className="text-xs text-muted-foreground">Створено: {brand.createdDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground">Немає брендів для відображення</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Brand Modal */}
      <BrandModal
        brand={editingBrand}
        isOpen={!!editingBrand || isAddingBrand}
        onClose={() => {
          setEditingBrand(null)
          setIsAddingBrand(false)
        }}
        onSave={(brandData) => {
          if (editingBrand) {
            setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? { ...b, ...brandData } : b)))
          } else {
            const newBrand = {
              id: Date.now().toString(),
              ...brandData,
              productsCount: 0,
              createdDate: new Date().toISOString().split("T")[0],
            }
            setBrands((prev) => [...prev, newBrand])
          }
          setEditingBrand(null)
          setIsAddingBrand(false)
        }}
      />
    </div>
  )
}

interface BrandModalProps {
  brand: any
  isOpen: boolean
  onClose: () => void
  onSave: (brandData: any) => void
}

function BrandModal({ brand, isOpen, onClose, onSave }: BrandModalProps) {
  const [formData, setFormData] = useState({
    name: brand?.name || "",
    logo: brand?.logo || "",
    logoFile: null as File | null,
  })

  const handleSave = () => {
    onSave(formData)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, logoFile: file }))
      // In a real app, you'd upload the file and get a URL
      const fakeUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, logo: fakeUrl }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{brand ? "Редагувати бренд" : "Додати новий бренд"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Назва бренду</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Введіть назву бренду"
            />
          </div>

          <div>
            <Label htmlFor="logoFile">Завантажити логотип</Label>
            <div className="flex items-center gap-4">
              <Input id="logoFile" type="file" accept="image/*" onChange={handleFileUpload} className="flex-1" />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Обрати файл
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="logo">Або URL логотипу</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Preview */}
          {formData.logo && (
            <div className="flex items-center gap-2">
              <Label>Попередній перегляд:</Label>
              <Avatar className="h-12 w-12">
                <AvatarImage src={formData.logo || "/placeholder.svg"} />
                <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Скасувати
            </Button>
            <Button onClick={handleSave}>Зберегти</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
