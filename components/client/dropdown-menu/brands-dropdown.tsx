"use client"

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import ListItem from "./list-item"
import Link from "next/link"

const brands = [
    { id: 1, name: 'Bitzer', href: '/brands/cooltech'},
    { id: 2, name: 'Frascold', href: '/brands/frostpro'},
    { id: 3, name: 'Copeland', href: '/brands/arcticsystems'},
    { id: 4, name: 'Danfoss', href: '/brands/chillmaster'},
    { id: 5, name: 'Bock', href: '/brands/iceflow'},
    { id: 6, name: 'CryoTech', href: '/brands/cryotech' },
    { id: 7, name: 'FreezePro', href: '/brands/freezepro' },
    { id: 8, name: 'ColdChain', href: '/brands/coldchain' },
    { id: 9, name: 'ThermalPro', href: '/brands/thermalpro' },
    { id: 10, name: 'FrostGuard', href: '/brands/frostguard' },
    { id: 11, name: 'ChillCore', href: '/brands/chillcore' },
    { id: 12, name: 'IceMaster', href: '/brands/icemaster' },
    { id: 13, name: 'CoolFlow', href: '/brands/coolflow' },
    { id: 14, name: 'ArcticPro', href: '/brands/arcticpro' },
    { id: 15, name: 'FreezeMax', href: '/brands/freezemax' },
    { id: 16, name: 'ColdWave', href: '/brands/coldwave' },
    { id: 17, name: 'IceTech', href: '/brands/icetech' },
    { id: 18, name: 'FrostLine', href: '/brands/frostline' },
    { id: 19, name: 'ChillWave', href: '/brands/chillwave' },
    { id: 20, name: 'CoolMax', href: '/brands/coolmax' },
    { id: 21, name: 'ArcticFlow', href: '/brands/arcticflow' },
    { id: 22, name: 'FreezeCore', href: '/brands/freezecore' },
    { id: 23, name: 'IceGuard', href: '/brands/iceguard' },
    { id: 24, name: 'ColdMax', href: '/brands/coldmax' },
    { id: 25, name: 'ThermalFlow', href: '/brands/thermalflow' },
    { id: 26, name: 'FrostMax', href: '/brands/frostmax' },
    { id: 27, name: 'ChillTech', href: '/brands/chilltech' },
    { id: 28, name: 'IceCore', href: '/brands/icecore' },
    { id: 29, name: 'CoolGuard', href: '/brands/coolguard' },
    { id: 30, name: 'ArcticMax', href: '/brands/arcticmax' },
    { id: 31, name: 'FreezeTech', href: '/brands/freezetech' },
    { id: 32, name: 'ColdCore', href: '/brands/coldcore' },
    { id: 33, name: 'ThermalMax', href: '/brands/thermalmax' },
    { id: 34, name: 'IceWave', href: '/brands/icewave' },
    { id: 35, name: 'FrostFlow', href: '/brands/frostflow' },
    { id: 36, name: 'ChillMax', href: '/brands/chillmax' },
]

export default function BrandsDropdown() {
  return (
    <NavigationMenuItem>
      <Link href="/brands" legacyBehavior passHref>
        <NavigationMenuLink asChild>
          <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
        </NavigationMenuLink>
      </Link>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-5 lg:w-[900px] ">
          {brands.map((brand) => (
            <ListItem
              key={brand.id}
              title={brand.name}
              href={brand.href}
            >
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
