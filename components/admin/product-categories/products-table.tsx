"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Package,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TableItem {
  id: string
  type: "category" | "product"
  name: string
  description: string
  subcategoriesCount: number
  brand: string
  isEndCategory: boolean
  level: number
  children: TableItem[]
}

interface ProductsTableProps {
  data: TableItem[]
  searchTerm: string
  expandedItems: Set<string>
  onToggleExpanded: (id: string) => void
  onEdit: (item: TableItem) => void
  onDelete: (id: string) => void
  onAddSubcategory?: (parentId: string) => void
}

export function ProductsTable({
  data,
  searchTerm,
  expandedItems,
  onToggleExpanded,
  onEdit,
  onDelete,
  onAddSubcategory,
}: ProductsTableProps) {
  const filterData = (items: TableItem[]): TableItem[] => {
    if (!searchTerm) return items

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const renderRow = (item: TableItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const paddingLeft = depth * 24

    return (
      <div key={item.id}>
        <div className="flex items-center py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors">
          {/* Expand/Collapse + Icon */}
          <div className="flex items-center gap-2 min-w-0" style={{ paddingLeft }}>
            {hasChildren ? (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onToggleExpanded(item.id)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : (
              <div className="w-6" />
            )}

            {item.type === "category" ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )
            ) : (
              <Package className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0 px-4">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{item.name}</span>
              {item.type === "category" && onAddSubcategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-teal-100 hover:text-teal-700 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddSubcategory(item.id)
                  }}
                  title="Додати підкатегорію"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 min-w-0 px-4 hidden md:block">
            <div className="text-sm text-muted-foreground truncate">{item.description}</div>
          </div>

          {/* Subcategories Count */}
          <div className="w-32 px-4 text-center hidden lg:block">
            <span className="text-sm text-muted-foreground">
              {item.type === "category" ? item.subcategoriesCount : "0"}
            </span>
          </div>

          {/* Brand */}
          <div className="w-24 px-4 hidden xl:block">
            {item.brand ? (
              <Badge variant="outline">{item.brand}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">none</span>
            )}
          </div>

          {/* Type */}
          <div className="w-32 px-4 hidden lg:block">
            <Badge
              variant="outline"
              className={
                item.isEndCategory
                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }
            >
              {item.isEndCategory ? "Кінцева" : "Некінцева"}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-1 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && <div>{item.children.map((child) => renderRow(child, depth + 1))}</div>}
      </div>
    )
  }

  const filteredData = filterData(data)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted/50 border-b border-border">
        <div className="flex items-center py-3 px-4 font-medium text-sm">
          <div className="flex-1 min-w-0 px-4">Назва</div>
          <div className="flex-1 min-w-0 px-4 hidden md:block">Опис</div>
          <div className="w-32 px-4 text-center hidden lg:block">Кількість підкатегорій</div>
          <div className="w-24 px-4 hidden xl:block">Бренд</div>
          <div className="w-32 px-4 hidden lg:block">Тип</div>
          <div className="w-20 px-4 text-center">Дії</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="max-h-96 overflow-y-auto">
        <div className="group">
          {filteredData.length > 0 ? (
            filteredData.map((item) => renderRow(item))
          ) : (
            <div className="py-8 text-center text-muted-foreground">Немає результатів для відображення</div>
          )}
        </div>
      </div>
    </div>
  )
}
