"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Users, ShoppingCart, MessageSquare, Tag, BarChart3, Settings } from "lucide-react"

const navigationItems = [
    { href: "/products-categories", label: "Продукти та категорії", icon: Package },
    { href: "/users", label: "Контроль юзерів", icon: Users },
    { href: "/orders", label: "Замовлення", icon: ShoppingCart },
    { href: "/comments", label: "Коментарі", icon: MessageSquare },
    { href: "/brands-control", label: "Бренди", icon: Tag },
    { href: "/statistics", label: "Статистика", icon: BarChart3 },
    { href: "/settings", label: "Налаштування", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
            <div className="flex flex-col flex-1">
                <div className="flex items-center h-16 px-6 border-b border-border">
                    <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigationItems.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname.startsWith(href)

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{label}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
