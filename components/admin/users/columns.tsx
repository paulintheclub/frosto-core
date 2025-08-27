import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { UserActions } from "./user-actions"

export type User = {
    id: string
    name: string
    email: string
    role: string
    registrationDate: string
    lastLogin: string
    ordersCount: number
}

export const getUserColumns = (
    onEdit: (user: User) => void,
    onDelete: (user: User) => void
): ColumnDef<User>[] => [
    {
        accessorKey: "name",
        header: "Користувач",
        enableGlobalFilter: true,
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.name}</div>
                <div className="text-sm text-muted-foreground">{row.original.email}</div>
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: "Роль",
        enableGlobalFilter: true,
        cell: ({ row }) => {
            const role = row.original.role as keyof typeof iconMap
            const iconMap = {
                admin: <Badge className="text-blue-600 bg-blue-100">Адміністратор</Badge>,
                moderator: <Badge className="text-yellow-600 bg-yellow-100">Модератор</Badge>,
                customer: <Badge className="text-green-600 bg-green-100">Клієнт</Badge>,
            }
            return (
                <div className="flex items-center gap-2">
                    {iconMap[role]}
                </div>
            )
        },
    },
    {
        accessorKey: "ordersCount",
        header: "Замовлення",
        enableGlobalFilter: true,
        cell: ({ row }) => row.original.ordersCount,
    },
    {
        accessorKey: "lastLogin",
        header: "Останній вхід",
        cell: ({ row }) => row.original.lastLogin,
    },
    {
        accessorKey: "registrationDate",
        header: "Реєстрація",
        cell: ({ row }) => row.original.registrationDate,
    },
    {
        id: "actions",
        cell: ({ row }) => <UserActions user={row.original} onEdit={onEdit} onDelete={onDelete} />,
    },
]
