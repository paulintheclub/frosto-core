"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Filter,
  Search,
  Plus,
  Package,
  Folder,
  Tag,
  TrendingUp,
} from "lucide-react"
import { HierarchyTable } from "./hierarchy-table"
import { FilterPopup } from "./filter-popup"
import { ProductModal } from "./product-modal"
import { StatCard } from "@/components/admin/reusable-components/stat-card"
import { CategoryModal } from "@/components/admin/product-categories/category-modal"
import { trpc } from "@/utils/trpc"
import { TableItem } from "@/types/table"
import {useLanguage} from "@/context/language-context";
import {ConfirmDeleteModal} from "@/components/admin/product-categories/confirm-delete-modal";

interface StatItem {
  label: string
  value: string | number
  hint: string
  icon: any
  iconBg: string
  iconColor: string
}


export function ProductsCategoriesSection() {

  const [categotyToUpdate, setCategotyToUpdate] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")

  const [categoryDefaultParentId, setCategoryDefaultParentId] = useState<string | null>(null)
  const [categoryDefaultBrandId, setCategoryDefaultBrandId] = useState<string | null>(null)
  const [categoryDefaultCategoryId, setCategoryDefaultCategoryId] = useState<string | undefined>()
  const [productDefaultProductId, setProductDefaultProductId] = useState<string | undefined>()

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: string } | null>(null)

  const utils = trpc.useUtils()

  const { language } = useLanguage()

  const { data: rootCategories, refetch } = trpc.adminCategory.getRootCategories.useQuery()
  

  const deleteProductMutation = trpc.adminProduct.deleteProduct.useMutation({
    onSuccess: async (data) => {
      await utils.adminCategory.getRootCategories.invalidate()

      if (data?.parentId) {
        setCategotyToUpdate(data.parentId)
        setTimeout(() => setCategotyToUpdate(""), 300)
      }

      setDeleteModalOpen(false)
      setItemToDelete(null)
    },
  })

  const deleteCategoryMutation = trpc.adminCategory.deleteCategory.useMutation({
    onSuccess: async (data) => {
      await utils.adminCategory.getRootCategories.invalidate()

      if (data?.parentId) {
        setCategotyToUpdate(data.parentId)
        setTimeout(() => setCategotyToUpdate(""), 300)
      }

      setDeleteModalOpen(false)
      setItemToDelete(null)
    },
  })

  const handleDelete = (item: TableItem) => {
    setItemToDelete({ id: item.id, type: item.type })
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    if (itemToDelete.type === "product") {
      deleteProductMutation.mutate({ productId: itemToDelete.id })
    } else {
      deleteCategoryMutation.mutate({ categoryId: itemToDelete.id })
    }
  }


  const stats: StatItem[] = [
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

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id)
    setExpandedItems(newExpanded)
  }

  const handleEdit = (item: TableItem) => {
    setModalMode("edit")
    item.type === "product" ? setProductDefaultProductId(item.id) : setCategoryDefaultCategoryId(item.id)
    item.type === "product" ? setIsProductModalOpen(true) : setIsCategoryModalOpen(true)
  }

  const handleAddProduct = (parentId?: string | null) => {
    setModalMode("add")
    setCategoryDefaultParentId(parentId || null)

    setIsProductModalOpen(true)


  }

  const handleAddCategory = (parentId?: string | null) => {
    setModalMode("add")
    setCategoryDefaultParentId(parentId || null)
    setCategoryDefaultBrandId(null)
    setCategoryDefaultCategoryId(undefined)
    setIsCategoryModalOpen(true)
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
            <Button onClick={() => handleAddProduct(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Додати продукт
            </Button>
            <Button onClick={() => handleAddCategory(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Додати категорію
            </Button>
          </div>
        </div>

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

        </div>

        <HierarchyTable
            rootCategories={rootCategories}
            searchTerm={searchTerm}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddSubcategory={handleAddCategory}
            onAddProduct={handleAddProduct}
            categoryToUpdate={categotyToUpdate}
        />

        {isProductModalOpen && (
            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                mode={modalMode}
                defaultProductId={productDefaultProductId}
                defaultParentId={categoryDefaultParentId}
                onSuccess={async (parentId) => {
                  await refetch()

                  if (parentId) {
                    setCategotyToUpdate(parentId)

                    setTimeout(() => {
                      setCategotyToUpdate("")
                    }, 300)
                  }

                  setIsProductModalOpen(false)
                }}
            />

        )}

        {isCategoryModalOpen && (
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                mode={modalMode}
                defaultParentId={categoryDefaultParentId}
                defaultBrandId={categoryDefaultBrandId ?? ""}
                defaultCategoryId={categoryDefaultCategoryId}
                onSuccess={async (parentId) => {
                  await refetch()

                  if (parentId) {
                    setCategotyToUpdate(parentId)

                    setTimeout(() => {
                      setCategotyToUpdate("")
                    }, 300)
                  }

                  setIsCategoryModalOpen(false)
                }}
            />
        )}

        <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            itemName={itemToDelete?.type === "category" ? "категорію" : "продукт"}
        />

      </div>
  )
}
