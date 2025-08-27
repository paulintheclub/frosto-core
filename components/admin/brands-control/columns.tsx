import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { BrandActions } from "./brand-actions"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import type React from "react";

export type Brand = {
    id: string
    name: string
    logo: string
    productsCount: string
    createdDate: string
}

export const getBrandColumns = (
    onEdit: (user: Brand) => void,
    onDelete: (user: Brand) => void
): ColumnDef<Brand>[] => [
    {
        accessorKey: "name",
        header: "Бренд",
        enableGlobalFilter: true,
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.logo || "/placeholder.svg"} />
                    <AvatarFallback>{row.original.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="font-medium truncate">{row.original.name}</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "productsCount",
        header: "Кількість продуктів",
        enableGlobalFilter: true,
        cell: ({ row }) => row.original.productsCount,
    },
    {
        accessorKey: "createdDate",
        header: "Дата створення",
        enableGlobalFilter: true,
        cell: ({ row }) => row.original.createdDate,
    },
    {
        id: "actions",
        cell: ({ row }) => <BrandActions brand={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
]
