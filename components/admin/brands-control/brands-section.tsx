"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Edit, Trash2, Tag, Upload, MoreHorizontal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { StatCard } from "@/components/admin/reusable-components/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { mockBrands } from "@/components/admin/brands-control/mockData"
import {getBrandColumns} from "@/components/admin/brands-control/columns";
import {Brand} from "@/components/admin/brands-control/columns";



export function BrandsSection() {
  const [brands, setBrands] = useState(mockBrands)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingBrand, setEditingBrand] = useState<any>(null)
  const [isAddingBrand, setIsAddingBrand] = useState(false)


  const handleDeleteBrand = (brand: Brand) => {
    setBrands((prev) => prev.filter((b) => b.id !== brand.id))
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
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-end">

            <Button onClick={() => setIsAddingBrand(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Додати бренд
            </Button>
          </div>


          {/* Brands Table */}
          <DataTable
              columns={getBrandColumns(setEditingBrand, handleDeleteBrand)}
              data={brands}
          />

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
