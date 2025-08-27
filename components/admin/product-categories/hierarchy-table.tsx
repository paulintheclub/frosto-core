// components/admin/product-categories/hierarchy-table.tsx
"use client"

import { useState } from "react"
import type { TableItem } from "@/types/table"
import { RowItem } from "./row-item"

interface ProductsTableProps {
    rootCategories: TableItem[] | undefined
    searchTerm: string
    expandedItems: Set<string>
    onToggleExpanded: (id: string) => void
    onEdit: (item: TableItem) => void
    onDelete: (id: string) => void
    onAddSubcategory?: (parentId: string) => void
    onAddProduct?: (parentId: string) => void
}

export function HierarchyTable({
                                   rootCategories,
                                   searchTerm,
                                   expandedItems,
                                   onToggleExpanded,
                                   onEdit,
                                   onDelete,
                                   onAddSubcategory,
                                   onAddProduct
                               }: ProductsTableProps) {
    const filterData = (items: TableItem[]): TableItem[] => {
        if (!searchTerm) return items
        return items.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.brand.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }

    const filteredData = rootCategories ? filterData(rootCategories) : []

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            {/* Header */}
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

            {/* Body */}
            <div className="max-h-96 overflow-y-auto">
                <div className="group">
                    {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <RowItem
                                key={item.id}
                                item={item}
                                depth={0}
                                isExpanded={expandedItems.has(item.id)}
                                expandedItems={expandedItems}
                                onToggleExpanded={onToggleExpanded}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onAddSubcategory={onAddSubcategory}
                                onAddProduct={onAddProduct}
                            />
                        ))
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
