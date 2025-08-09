"use client"

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import ListItem from "./list-item"
import Link from "next/link"

const categories = [
    {
        id: 1,
        title: 'Компрессори',
        link: '/categories/refrigeration-units'
    },
    {
        id: 2,
        title: 'Агрегати',
        link: '/categories/refrigeration-units'
    },
    {
        id: 3,
        title: 'Повітроохолоджувачі',
        link: '/categories/refrigeration-units'
    },
    {
        id: 4,
        title: 'Конденсатори',
        link: '/categories/refrigeration-units'
    },
    {
        id: 5,
        title: 'Теплообмінники',
        link: '/categories/refrigeration-units'
    },
    {
        id: 6,
        title: 'Комплектуючі',
        link: '/categories/refrigeration-units'
    },
    {
        id: 7,
        title: 'Інструмент',
        link: '/categories/components'
    },
    {
        id: 8,
        title: 'Кондиціонери',
        link: '/categories/refrigeration-units'
    }
]

export default function CategoriesDropdown() {
  return (
    <NavigationMenuItem>
      <Link href="/categories" legacyBehavior passHref>
        <NavigationMenuLink asChild>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
        </NavigationMenuLink>
      </Link>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
          {categories.map((category) => (
            <ListItem
              key={category.id}
              title={category.title}
              href={category.link}
            >
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
