import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { OrderActions } from "./order-actions"
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react"

export type Order = {
    id: string
    customerName: string
    customerEmail: string
    date: string
    status: string
    total: number
    items: number
}

export const getOrderColumns = (
    onStatusChange: (id: string, newStatus: string) => void,
    onView: (order: Order) => void
): ColumnDef<Order>[] => [
    {
        accessorKey: "id",
        header: "Замовлення",
        enableGlobalFilter: true,
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    },
    {
        accessorKey: "customerName",
        header: "Клієнт",
        enableGlobalFilter: true,
        cell: ({ row }) => (
            <div>
                <div className="font-medium">{row.original.customerName}</div>
                <div className="text-sm text-muted-foreground">{row.original.customerEmail}</div>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: "Дата",
        enableGlobalFilter: true,
        cell: ({ row }) => row.original.date,
    },
    {
        accessorKey: "status",
        header: "Статус",
        cell: ({ row }) => {
            const status = row.original.status as keyof typeof iconMap
            const iconMap = {
                pending: <Clock className="w-4 h-4 text-yellow-600" />,
                processing: <Package className="w-4 h-4 text-blue-600" />,
                shipped: <Truck className="w-4 h-4 text-purple-600" />,
                delivered: <CheckCircle className="w-4 h-4 text-green-600" />,
                cancelled: <XCircle className="w-4 h-4 text-red-600" />,
            }
            const labelMap = {
                pending: "Очікує",
                processing: "Обробляється",
                shipped: "Відправлено",
                delivered: "Доставлено",
                cancelled: "Скасовано",
            }
            return (
                <div className="flex items-center gap-2">
                    {iconMap[status]}
                    <Badge variant="outline">{labelMap[status]}</Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "items",
        header: "К-сть товарів",
        cell: ({ row }) => row.original.items,
    },
    {
        accessorKey: "total",
        header: "Сума",
        cell: ({ row }) => <span className="font-medium text-sm">₴{row.original.total.toLocaleString()}</span>,
    },
    {
        id: "actions",
        cell: ({ row }) => <OrderActions order={row.original} onStatusChange={onStatusChange} onView={onView} />,
    },
]
