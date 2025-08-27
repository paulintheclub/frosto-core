"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Tag,
  Calendar,
  DollarSign
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Category, Product, HierarchicalItem, LocalizedCategory, LocalizedProduct } from './types'
import { getLocalizedName, getLocalizedDescription } from './types'

interface HierarchyTableProps {
  categories: Category[]
  products: Product[]
  searchTerm: string
  expandedItems: Set<string>
  onToggleExpanded: (id: string) => void
  onEdit: (id: string, type: 'category' | 'product') => void
  onDelete: (id: string, type: 'category' | 'product') => void
  onAddSubcategory?: (parentId: string) => void
  currentLanguage?: string
}

// Функция для получения локализованных данных
const getLocalizedCategory = (category: Category, languageCode = 'uk'): LocalizedCategory => {
  return {
    ...category,
    name: getLocalizedName(category.translations, languageCode),
    description: getLocalizedDescription(category.translations, languageCode),
    originalTranslations: category.translations
  }
}

const getLocalizedProduct = (product: Product, languageCode = 'uk'): LocalizedProduct => {
  return {
    ...product,
    name: getLocalizedName(product.translations, languageCode),
    description: getLocalizedDescription(product.translations, languageCode),
    originalTranslations: product.translations
  }
}

// Функция для построения иерархической структуры
const buildHierarchy = (
  categories: Category[], 
  products: Product[], 
  languageCode = 'uk'
): HierarchicalItem[] => {
  const result: HierarchicalItem[] = []
  
  // Находим корневые категории (без parentId)
  const rootCategories = categories.filter(cat => !cat.parentId)
  
  const addCategoryToHierarchy = (category: Category, level: number): HierarchicalItem => {
    const children = categories.filter(cat => cat.parentId === category.id)
    const categoryProducts = products.filter(prod => prod.categoryId === category.id)
    
    return {
      type: 'category',
      level,
      hasChildren: children.length > 0 || categoryProducts.length > 0,
      data: category
    }
  }
  
  const addProductToHierarchy = (product: Product, level: number): HierarchicalItem => {
    return {
      type: 'product',
      level,
      hasChildren: false,
      data: product
    }
  }
  
  // Рекурсивная функция для добавления детей
  const addChildrenToHierarchy = (parentCategoryId: string, level: number): HierarchicalItem[] => {
    const children: HierarchicalItem[] = []
    
    // Добавляем дочерние категории
    const childCategories = categories.filter(cat => cat.parentId === parentCategoryId)
    childCategories.forEach(childCategory => {
      children.push(addCategoryToHierarchy(childCategory, level))
      // Рекурсивно добавляем детей дочерней категории
      children.push(...addChildrenToHierarchy(childCategory.id, level + 1))
    })
    
    // Добавляем продукты в категорию
    const categoryProducts = products.filter(prod => prod.categoryId === parentCategoryId)
    categoryProducts.forEach(product => {
      children.push(addProductToHierarchy(product, level))
    })
    
    return children
  }
  
  // Строим иерархию начиная с корневых категорий
  rootCategories.forEach(rootCategory => {
    result.push(addCategoryToHierarchy(rootCategory, 0))
    result.push(...addChildrenToHierarchy(rootCategory.id, 1))
  })
  
  return result
}

export function HierarchyTable({
  categories,
  products,
  searchTerm,
  expandedItems,
  onToggleExpanded,
  onEdit,
  onDelete,
  onAddSubcategory,
  currentLanguage = 'uk'
}: HierarchyTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Строим иерархию
  const hierarchyItems = buildHierarchy(categories, products, currentLanguage)
  
  // Фильтрация данных
  const filterItems = (items: HierarchicalItem[]): HierarchicalItem[] => {
    if (!searchTerm) return items
    
    return items.filter(item => {
      const searchLower = searchTerm.toLowerCase()
      const isCategory = item.type === 'category'
      
      // Получаем локализованные данные для поиска
      const localizedData = isCategory 
        ? getLocalizedCategory(item.data as Category, currentLanguage)
        : getLocalizedProduct(item.data as Product, currentLanguage)
      
      return (
        localizedData.name.toLowerCase().includes(searchLower) ||
        localizedData.description?.toLowerCase().includes(searchLower) ||
        (item.type === 'product' && (item.data as Product).sku.toLowerCase().includes(searchLower)) ||
        (item.type === 'category' && (item.data as Category).brand?.name.toLowerCase().includes(searchLower))
      )
    })
  }
  
  // Функция для отображения значения наличия
  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'IN_STOCK':
        return <Badge className="bg-green-100 text-green-800">В наявності</Badge>
      case 'ON_ORDER':
        return <Badge className="bg-yellow-100 text-yellow-800">Під замовлення</Badge>
      default:
        return <Badge variant="outline">{availability}</Badge>
    }
  }
  
  // Функция для отображения цены
  const formatPrice = (price: number, isDiscounted: boolean, discountPrice?: number | null) => {
    if (isDiscounted && discountPrice) {
      return (
        <div className="flex flex-col">
          <span className="text-sm line-through text-muted-foreground">₴{price}</span>
          <span className="text-sm font-semibold text-red-600">₴{discountPrice}</span>
        </div>
      )
    }
    return <span className="text-sm font-semibold">₴{price}</span>
  }
  
  const renderRow = (item: HierarchicalItem) => {
    const isCategory = item.type === 'category'
    const isExpanded = expandedItems.has(item.data.id)
    const paddingLeft = item.level * 24
    
    // Получаем локализованные данные
    const localizedData = isCategory 
      ? getLocalizedCategory(item.data as Category, currentLanguage)
      : getLocalizedProduct(item.data as Product, currentLanguage)
    
    return (
      <div key={item.data.id}>
        <div className="flex items-center py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors">
          {/* Expand/Collapse + Icon */}
          <div className="flex items-center gap-2 min-w-0" style={{ paddingLeft }}>
            {item.hasChildren ? (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onToggleExpanded(item.data.id)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            ) : (
              <div className="w-6" />
            )}
            
            {isCategory ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )
            ) : (
              <Package className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          {/* Name & SKU */}
          <div className="flex-1 min-w-0 px-4">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{localizedData.name}</span>
              {!isCategory && (
                <Badge variant="outline" className="text-xs">
                  {(localizedData as LocalizedProduct).sku}
                </Badge>
              )}
              {isCategory && onAddSubcategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-teal-100 hover:text-teal-700 transition-all"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddSubcategory(item.data.id)
                  }}
                  title="Додати підкатегорію"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
            {localizedData.description && (
              <div className="text-sm text-muted-foreground truncate">{localizedData.description}</div>
            )}
          </div>
          
          {/* Price (только для продуктов) */}
          <div className="w-32 px-4 hidden md:block">
            {!isCategory ? (
              formatPrice(
                (localizedData as LocalizedProduct).price,
                (localizedData as LocalizedProduct).isDiscounted,
                (localizedData as LocalizedProduct).discountPrice
              )
            ) : (
              <span className="text-sm text-muted-foreground">
                {(item.data as Category)._count?.products || 0} товарів
              </span>
            )}
          </div>
          
          {/* Brand */}
          <div className="w-32 px-4 hidden lg:block">
            {isCategory ? (
              (item.data as Category).brand ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={(item.data as Category).brand!.logo} />
                    <AvatarFallback className="text-xs">
                      {(item.data as Category).brand!.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{(item.data as Category).brand!.name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Без бренду</span>
              )
            ) : (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={(item.data as Product).category.brand?.logo} />
                  <AvatarFallback className="text-xs">
                    {(item.data as Product).category.brand?.name.substring(0, 2).toUpperCase() || 'N/A'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">
                  {(item.data as Product).category.brand?.name || 'Без бренду'}
                </span>
              </div>
            )}
          </div>
          
          {/* Status/Availability */}
          <div className="w-32 px-4 hidden xl:block">
            {isCategory ? (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Tag className="h-3 w-3 mr-1" />
                Категорія
              </Badge>
            ) : (
              getAvailabilityBadge((item.data as Product).availability)
            )}
          </div>
          
          {/* Date */}
          <div className="w-32 px-4 hidden xl:block">
            {!isCategory && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date((item.data as Product).createdAt).toLocaleDateString('uk-UA')}
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-1 px-4">
            <DropdownMenu open={openMenuId === item.data.id} onOpenChange={(open) => setOpenMenuId(open ? item.data.id : null)}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setOpenMenuId(null)
                    onEdit(item.data.id, isCategory ? 'category' : 'product')
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редагувати
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setOpenMenuId(null)
                    onDelete(item.data.id, isCategory ? 'category' : 'product')
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    )
  }
  
  const filteredItems = filterItems(hierarchyItems)
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted/50 border-b border-border">
        <div className="flex items-center py-3 px-4 font-medium text-sm">
          <div className="flex-1 min-w-0 px-4">Назва / SKU</div>
          <div className="w-32 px-4 hidden md:block">Ціна / Кількість</div>
          <div className="w-32 px-4 hidden lg:block">Бренд</div>
          <div className="w-32 px-4 hidden xl:block">Статус</div>
          <div className="w-32 px-4 hidden xl:block">Дата</div>
          <div className="w-20 px-4 text-center">Дії</div>
        </div>
      </div>
      
      {/* Table Body */}
      <div className="max-h-96 overflow-y-auto">
        <div className="group">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => renderRow(item))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Немає результатів для відображення
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
