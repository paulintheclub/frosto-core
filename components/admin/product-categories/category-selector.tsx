"use client"

import { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/utils/trpc"

interface CategoryNode {
    id: string
    name: string
    children: CategoryNode[]
}

interface Props {
    categoryPath: string[]
    onChange: (path: string[]) => void
    disabled?: boolean
}

export function CategorySelector({ categoryPath, onChange, disabled }: Props) {
    const { data: allCategories = [] } =
        trpc.adminCategory.getAllFlatCategories.useQuery({ lang: "uk" })

    const buildTree = () => {
        const map = new Map<string, CategoryNode>()
        const roots: CategoryNode[] = []

        for (const cat of allCategories) {
            map.set(cat.id, { id: cat.id, name: cat.name, children: [] })
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
            onChange(categoryPath.slice(0, level))
        } else {
            const updatedPath = [...categoryPath.slice(0, level), newId]
            onChange(updatedPath)
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
                                {cat.name}
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

    return <div>{renderCategorySelectors()}</div>
}
