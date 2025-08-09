"use client"

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import ListItem from "./list-item"

const informationLinks = [
  { title: "Про компанию", href: "/info/about" },
  { title: "Оплата та доставка", href: "/info/payment-delivery" },
  { title: "Гарантія", href: "/info/warranty" },
  { title: "Корисна інформація", href: "/info/useful-info" },
  { title: "Монтаж", href: "/info/installation" },
  { title: "Продаж", href: "/info/sales" },
  { title: "Проектування", href: "/info/design" },
  { title: "Сервіс", href: "/info/service" },
]

export default function InformationDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Information</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {informationLinks.map((link) => (
            <ListItem
              key={link.title}
              title={link.title}
              href={link.href}
            />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
