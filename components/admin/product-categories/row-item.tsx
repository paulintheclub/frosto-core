// components/admin/product-categories/row-item.tsx
"use client"

import { useState } from "react"
import { trpc } from "@/utils/trpc"
import type { TableItem } from "@/types/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ChevronDown, ChevronRight, Edit, Trash2, Package, Folder, FolderOpen, Plus, MoreHorizontal,
} from "lucide-react"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/context/language-context"

export interface RowItemProps {
    item: TableItem
    depth: number
    isExpanded: boolean
    expandedItems: Set<string>
    onToggleExpanded: (id: string) => void
    onEdit: (item: TableItem) => void
    onDelete: (item: TableItem) => void
    onAddSubcategory?: (parentId: string) => void
    onAddProduct?: (parentId: string) => void
}

export function RowItem({
                            item,
                            depth,
                            isExpanded,
                            expandedItems,
                            onToggleExpanded,
                            onEdit,
                            onDelete,
                            onAddSubcategory,
                            onAddProduct
                        }: RowItemProps) {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [children, setChildren] = useState<TableItem[]>([])
    const { language } = useLanguage()

    const { refetch: refetchSub } = trpc.adminCategory.getSubcategories.useQuery(
        { parentId: item.id, level: item.level + 1},
        { enabled: false }
    )

    const { refetch: refetchProd } = trpc.adminCategory.getProductsByCategoryId.useQuery(
        { categoryId: item.id, level: item.level + 1},
        { enabled: false }
    )

    const isDeletable =
        item.type === "product" ||
        (item.type === "category" && item.subcategoriesCount === 0 && item.productCount === 0)

    const handleExpand = async () => {
        if (!isExpanded) {
            const [subs, prods] = await Promise.all([refetchSub(), refetchProd()])
            setChildren([...(subs.data ?? []), ...(prods.data ?? [])])
        }
        onToggleExpanded(item.id)
    }

    const hasChildren = item.type === "category"
    const paddingLeft = depth * 24

    const getTranslation = (item: TableItem) => {
        const translation = item.translations.find(t => t.languageCode === language)
            ?? item.translations[0] // fallback, если активного языка нет

        return {
            name: translation?.name ?? "(Без назви)",
            description: translation?.description ?? "",
        }
    }

    const { name, description } = getTranslation(item)




    return (
        <>
            <div className="flex items-center py-3 px-4 border-b border-border hover:bg-muted/50 transition-colors">
                {/* Expand + Icon + Name (с отступом по depth) */}
                <div className="flex-1 min-w-0 px-4">
                    <div className="flex items-center gap-2" style={{ paddingLeft }}>
                        {hasChildren ? (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleExpand}>
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                        ) : (
                            <div className="w-6" />
                        )}
                        {item.type === "category" ? (
                            isExpanded ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />
                        ) : (
                            <Package className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium truncate">{name}</span>

                        {item.type === "category" && (
                            <>
                                {onAddSubcategory && item.productCount === 0 && (
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
                                {onAddProduct && item.isEndCategory && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-green-100 hover:text-green-700 transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onAddProduct(item.id)
                                        }}
                                        title="Додати продукт"
                                    >
                                        <Package className="h-3 w-3" />
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Остальные колонки остаются без сдвига */}
                <div className="flex-1 min-w-0 px-4 hidden md:block">
                    <div className="text-sm text-muted-foreground truncate">{description}</div>
                </div>

                <div className="w-32 px-4 text-center hidden lg:block">
                    <span className="text-sm text-muted-foreground">
                      {item.type === "category" ? item.subcategoriesCount : "0"}
                    </span>
                </div>

                <div className="w-24 px-4 hidden xl:block">
                    {item.brand ? <Badge variant="outline">{item.brand}</Badge> : <span className="text-sm text-muted-foreground">none</span>}
                </div>

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

                <div className="flex gap-1 px-4">
                    <DropdownMenu open={openMenuId === item.id} onOpenChange={(open) => setOpenMenuId(open ? item.id : null)}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setOpenMenuId(null); onEdit(item) }}>
                                <Edit className="h-4 w-4 mr-2" /> Редагувати
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (!isDeletable) return
                                    setOpenMenuId(null)
                                    onDelete(item)
                                }}
                                className={`focus:text-destructive ${!isDeletable ? "opacity-50 pointer-events-none" : "text-destructive"}`}
                            >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeletable ? "Видалити" : "Неможливо видалити"}
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {isExpanded && children.length > 0 && (
                <div>
                    {children.map((child) => (
                        <RowItem
                            key={child.id}
                            item={child}
                            depth={depth + 1}
                            isExpanded={expandedItems.has(child.id)}
                            expandedItems={expandedItems}
                            onToggleExpanded={onToggleExpanded}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onAddSubcategory={onAddSubcategory}
                            onAddProduct={onAddProduct}
                        />
                    ))}
                </div>
            )}
        </>
    )
}
