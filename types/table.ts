import type { TRPCRouterOutput } from "@/types/trpc"

// Тип одного корневого элемента
export type TableCategory = TRPCRouterOutput["adminCategory"]["getRootCategories"][number]
export type TableSubcategory = TRPCRouterOutput["adminCategory"]["getSubcategories"][number]
export type TableProduct = TRPCRouterOutput["adminCategory"]["getProductsByCategoryId"][number]

// Универсальный тип для любого элемента таблицы
export type TableItem = TableCategory | TableSubcategory | TableProduct
