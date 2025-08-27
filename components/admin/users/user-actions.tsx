import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {MoreHorizontal, Trash, Edit} from "lucide-react"
import { User } from "./columns"

interface Props {
    user: User
    onEdit: (user: User) => void,
    onDelete: (user: User) => void,
}

export function UserActions({ user, onEdit, onDelete }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Edit className="mr-2 h-4 w-4" /> Редагувати
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(user)}>
                    <Trash className="mr-2 h-4 w-4" /> Видалити
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
