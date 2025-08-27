import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { Order } from "./columns"

interface Props {
    order: Order
    onStatusChange: (id: string, newStatus: string) => void
    onView: (order: Order) => void
}

export function OrderActions({ order, onStatusChange, onView }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(order)}>
                    <Eye className="mr-2 h-4 w-4" /> Переглянути
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(order.id, "processing")}> <Package className="mr-2 h-4 w-4" /> В обробку </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(order.id, "shipped")}> <Truck className="mr-2 h-4 w-4" /> Відправити </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(order.id, "delivered")}> <CheckCircle className="mr-2 h-4 w-4" /> Доставлено </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(order.id, "cancelled")}> <XCircle className="mr-2 h-4 w-4" /> Скасувати </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
