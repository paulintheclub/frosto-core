// ✨ Расширение ProductModal для выбора конечной категории через дерево категорий
// Позволяет выбирать категорию только если она isEndCategory

"use client"

import { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { trpc } from "@/utils/trpc"
import {useLanguage} from "@/context/language-context";

interface CategoryNode {
    id: string
    name: string
    isEndCategory: boolean
    children: CategoryNode[]
}

interface Props {
    categoryId: string | null
    onChange: (val: string | null) => void
    disabled?: boolean
}

export function ProductCategorySelector({
                                            categoryId,
                                            onChange,
                                            disabled
                                        }: Props) {

    const { language } = useLanguage()

    const { data: allCategories = [] } =
        trpc.adminCategory.getAllFlatCategoriesForProduct.useQuery({ lang: language })

    const [categoryPath, setCategoryPath] = useState<string[]>([])

    useEffect(() => {
        if (categoryId && allCategories.length > 0) {
            const path = findPathToParent(categoryId, allCategories)
            setCategoryPath(path)
        }
    }, [categoryId, allCategories])

    function findPathToParent(
        parentId: string,
        categories: { id: string; parentId: string | null }[]
    ): string[] {
        const map = new Map<string, string | null>()
        categories.forEach((cat) => {
            map.set(cat.id, cat.parentId)
        })

        const path: string[] = []
        let current: string | null = parentId
        while (current) {
            path.unshift(current)
            current = map.get(current) ?? null
        }

        return path
    }

    const buildTree = () => {
        const map = new Map<string, CategoryNode>()
        const roots: CategoryNode[] = []

        for (const cat of allCategories) {
            map.set(cat.id, {
                id: cat.id,
                name: cat.name,
                isEndCategory: cat.isEndCategory,
                children: [],
            })
        }

        for (const cat of allCategories) {
            const node = map.get(cat.id)!
            if (cat.parentId) {
                const parent = map.get(cat.parentId)
                parent?.children.push(node)
            } else {
                roots.push(node)
            }
        }

        return roots
    }

    const handleCategoryChange = (level: number, newId: string | null) => {
        if (newId === null) {
            setCategoryPath(categoryPath.slice(0, level))
            onChange(null)
        } else {
            const updatedPath = [...categoryPath.slice(0, level), newId]
            setCategoryPath(updatedPath)

            const isEnd = allCategories.find((c) => c.id === newId)?.isEndCategory
            if (isEnd) onChange(newId)
            else onChange(null)
        }
    }

    const renderCategorySelectors = () => {
        const tree = buildTree()
        const selectors = []
        let currentLevel = tree

        for (let level = 0; ; level++) {
            const selectedId = categoryPath[level] || null
            selectors.push(
                <Select
                    key={level}
                    value={selectedId ?? "none"}
                    onValueChange={(val) =>
                        handleCategoryChange(level, val === "none" ? null : val)
                    }
                    disabled={disabled}
                >
                    <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Оберіть категорію" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">—</SelectItem>
                        {currentLevel.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name} {cat.isEndCategory ? "(кінцева)" : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )

            const selectedNode = currentLevel.find((cat) => cat.id === selectedId)
            if (!selectedNode || selectedNode.children.length === 0) break
            currentLevel = selectedNode.children
        }

        return selectors
    }

    return (
        <div className="mt-4">
            <Label>Категорія</Label>
            <span className="text-red-500 ml-1">*</span>
            {renderCategorySelectors()}
        </div>
    )
}
