import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {MoreHorizontal, Trash, Edit} from "lucide-react"
import { Brand } from "./columns"

interface Props {
    brand: Brand
    onEdit: (brand: Brand) => void,
    onDelete: (brand: Brand) => void,
}

export function BrandActions({ brand, onEdit, onDelete }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(brand)}>
                    <Edit className="mr-2 h-4 w-4" /> Редагувати
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(brand)}>
                    <Trash className="mr-2 h-4 w-4" /> Видалити
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
