"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, Search, Plus, Package, Folder, Tag, TrendingUp } from "lucide-react"
import { ProductsTable } from "./products-table"
import { FilterPopup } from "../reusable-components/filter-popup"
import { ProductModal } from "./product-modal"
import {StatCard} from "@/components/admin/reusable-components/stat-card";

// Mock data structure
const mockData = [
  {
    id: "1",
    type: "category",
    name: "Електроніка",
    description: "Електронні товари та пристрої",
    subcategoriesCount: 3,
    brand: "",
    isEndCategory: false,
    level: 1,
    children: [
      {
        id: "1-1",
        type: "category",
        name: "Смартфони",
        description: "Мобільні телефони та аксесуари",
        subcategoriesCount: 0,
        brand: "",
        isEndCategory: true,
        level: 2,
        children: [
          {
            id: "1-1-1",
            type: "product",
            name: "iPhone 15 Pro",
            description: "Новий iPhone з титановим корпусом",
            subcategoriesCount: 0,
            brand: "Apple",
            isEndCategory: true,
            level: 3,
            children: [],
          },
        ],
      },
      {
        id: "1-2",
        type: "category",
        name: "Ноутбуки",
        description: "Портативні комп'ютери",
        subcategoriesCount: 0,
        brand: "",
        isEndCategory: true,
        level: 2,
        children: [],
      },
    ],
  },
  {
    id: "2",
    type: "category",
    name: "Одяг",
    description: "Чоловічий та жіночий одяг",
    subcategoriesCount: 2,
    brand: "",
    isEndCategory: false,
    level: 1,
    children: [
      {
        id: "2-1",
        type: "category",
        name: "Чоловічий одяг",
        description: "Одяг для чоловіків",
        subcategoriesCount: 0,
        brand: "",
        isEndCategory: true,
        level: 2,
        children: [],
      },
    ],
  },
]

const stats = [
  {
    label: "Всього категорій",
    value: 45,
    hint: "+2 цього місяця",
    icon: Folder,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Всього продуктів",
    value: "1,234",
    hint: "+142 цього місяця",
    icon: Package,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Підкатегорій",
    value: 156,
    hint: "+8 цього місяця",
    icon: Tag,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    label: "Активних брендів",
    value: 28,
    hint: "+5 цього місяця",
    icon: TrendingUp,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
]

export function ProductsCategoriesSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [data, setData] = useState(mockData)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const expandAll = () => {
    const allIds = new Set<string>()
    const collectIds = (items: any[]) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          allIds.add(item.id)
          collectIds(item.children)
        }
      })
    }
    collectIds(data)
    setExpandedItems(allIds)
  }

  const collapseAll = () => {
    setExpandedItems(new Set())
  }

  const handleEdit = (item: any) => {
    setEditItem(item)
    setModalMode("edit")
    if (item.type === "product") {
      setIsProductModalOpen(true)
    } else {
      setIsCategoryModalOpen(true)
    }
  }

  const handleAddProduct = () => {
    setEditItem(null)
    setModalMode("add")
    setIsProductModalOpen(true)
  }

  const handleAddCategory = () => {
    setEditItem(null)
    setModalMode("add")
    setIsCategoryModalOpen(true)
  }

  const handleDelete = (id: string) => {
    // Implementation for delete functionality
    console.log("Delete item:", id)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Продукти та категорії</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddProduct} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Додати продукт
          </Button>
          <Button onClick={handleAddCategory} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Додати категорію
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-border">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Пошук продуктів та категорій..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Button variant="outline" onClick={() => setIsFilterPopupOpen(!isFilterPopupOpen)}>
              <Filter className="h-4 w-4" />
            </Button>
            <FilterPopup isOpen={isFilterPopupOpen} onClose={() => setIsFilterPopupOpen(false)} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Розгорнути все
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Згорнути все
          </Button>
        </div>
      </div>

      {/* Table */}
      <ProductsTable
        data={data}
        searchTerm={searchTerm}
        expandedItems={expandedItems}
        onToggleExpanded={toggleExpanded}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isProductModalOpen && (
        <ProductModal
          item={editItem}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          mode={modalMode}
          type="product"
        />
      )}

      {isCategoryModalOpen && (
        <ProductModal
          item={editItem}
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          mode={modalMode}
          type="category"
        />
      )}
    </div>
  )
}
