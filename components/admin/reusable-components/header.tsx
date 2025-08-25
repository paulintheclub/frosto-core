"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Settings, User, LogOut } from "lucide-react"

const pageTitles: Record<string, string> = {
    "/admin/products": "Продукти та категорії",
    "/admin/users": "Контроль юзерів",
    "/admin/orders": "Замовлення",
    "/admin/comments": "Коментарі",
    "/admin/brands": "Бренди",
    "/admin/statistics": "Статистика",
    "/admin/settings": "Налаштування",
}

export function Header() {
    const pathname = usePathname()
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    return (
        <header className="bg-card border-b border-border sticky top-0 z-40">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="lg:hidden">
                        <Button variant="outline" size="icon" onClick={() => setMobileSidebarOpen(true)}>
                            <Menu className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="hidden lg:block">
                        <h2 className="text-xl font-semibold text-foreground">
                            {pageTitles[pathname] || "Admin Panel"}
                        </h2>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Адміністратор</p>
                                    <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Профіль</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Налаштування</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Вийти</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
