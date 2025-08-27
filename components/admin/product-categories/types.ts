/**
 * TypeScript типы для продуктов и категорий
 * Соответствуют схеме Prisma Database
 */

import { Availability } from '@prisma/client'

// Базовые типы из Prisma
export type ProductAvailability = Availability

// Тип для переводов категорий
export interface CategoryTranslation {
  id: string
  categoryId: string
  languageCode: string
  type: string        // Название категории на определенном языке
  description?: string
}

// Тип для переводов продуктов
export interface ProductTranslation {
  id: string
  productId: string
  languageCode: string
  name: string
  description?: string
}

// Тип для бренда
export interface Brand {
  id: string
  slug: string
  logo: string
  name: string
}

// Тип для категории с необходимыми полями
export interface Category {
  id: string
  slug: string
  parentId?: string | null
  brandId?: string | null
  
  // Связанные данные
  brand?: Brand | null
  parent?: Category | null
  children?: Category[]
  translations: CategoryTranslation[]
  
  // Вычисляемые поля для UI
  _count?: {
    children: number
    products: number
  }
}

// Тип для продукта с необходимыми полями
export interface Product {
  id: string
  sku: string
  slug: string
  mainImage: string
  gallery: string[]
  price: number
  isDiscounted: boolean
  discountPrice?: number | null
  availability: ProductAvailability
  mainChar?: string | null
  techCharImage?: string | null
  expCharImage?: string | null
  sizeConnectionsImage?: string | null
  accessoriesImage?: string | null
  createdAt: Date
  updatedAt: Date
  categoryId: string
  
  // Связанные данные
  category: Category
  translations: ProductTranslation[]
}

// Тип для элемента в иерархической таблице
export interface HierarchicalItem {
  type: 'category' | 'product'
  level: number  // Уровень вложенности (0, 1, 2, ...)
  isExpanded?: boolean
  hasChildren: boolean
  data: Category | Product
}

// Утилитарные типы для получения переводов
export interface LocalizedCategory extends Omit<Category, 'translations'> {
  name: string
  description?: string
  originalTranslations: CategoryTranslation[]
}

export interface LocalizedProduct extends Omit<Product, 'translations'> {
  name: string
  description?: string
  originalTranslations: ProductTranslation[]
}

// Тип для фильтров таблицы
export interface TableFilters {
  searchTerm: string
  brandId?: string
  availability?: ProductAvailability
  categoryId?: string
  showOnlyParentCategories?: boolean
}

// Тип для статистики
export interface ProductCategoryStats {
  totalCategories: number
  totalProducts: number
  totalSubcategories: number
  activeBrands: number
}

// Типы для модальных окон
export type ModalMode = 'add' | 'edit'
export type ItemType = 'category' | 'product'

// Помощники для работы с переводами
export const getTranslation = (
  translations: (CategoryTranslation | ProductTranslation)[],
  languageCode: string = 'uk'
) => {
  return translations.find(t => t.languageCode === languageCode) || translations[0]
}

// Помощник для получения имени из переводов
export const getLocalizedName = (
  translations: CategoryTranslation[] | ProductTranslation[],
  languageCode: string = 'uk'
): string => {
  const translation = getTranslation(translations, languageCode)
  if (!translation) return 'Unnamed'
  
  // Для категорий используем поле 'type', для продуктов - 'name'
  return 'type' in translation ? translation.type : translation.name
}

// Помощник для получения описания из переводов
export const getLocalizedDescription = (
  translations: CategoryTranslation[] | ProductTranslation[],
  languageCode: string = 'uk'
): string => {
  const translation = getTranslation(translations, languageCode)
  return translation?.description || ''
}
