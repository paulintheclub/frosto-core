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
    { id: 1, name: 'Bitzer', href: '/brands-control/cooltech'},
    { id: 2, name: 'Frascold', href: '/brands-control/frostpro'},
    { id: 3, name: 'Copeland', href: '/brands-control/arcticsystems'},
    { id: 4, name: 'Danfoss', href: '/brands-control/chillmaster'},
    { id: 5, name: 'Bock', href: '/brands-control/iceflow'},
    { id: 6, name: 'CryoTech', href: '/brands-control/cryotech' },
    { id: 7, name: 'FreezePro', href: '/brands-control/freezepro' },
    { id: 8, name: 'ColdChain', href: '/brands-control/coldchain' },
    { id: 9, name: 'ThermalPro', href: '/brands-control/thermalpro' },
    { id: 10, name: 'FrostGuard', href: '/brands-control/frostguard' },
    { id: 11, name: 'ChillCore', href: '/brands-control/chillcore' },
    { id: 12, name: 'IceMaster', href: '/brands-control/icemaster' },
    { id: 13, name: 'CoolFlow', href: '/brands-control/coolflow' },
    { id: 14, name: 'ArcticPro', href: '/brands-control/arcticpro' },
    { id: 15, name: 'FreezeMax', href: '/brands-control/freezemax' },
    { id: 16, name: 'ColdWave', href: '/brands-control/coldwave' },
    { id: 17, name: 'IceTech', href: '/brands-control/icetech' },
    { id: 18, name: 'FrostLine', href: '/brands-control/frostline' },
    { id: 19, name: 'ChillWave', href: '/brands-control/chillwave' },
    { id: 20, name: 'CoolMax', href: '/brands-control/coolmax' },
    { id: 21, name: 'ArcticFlow', href: '/brands-control/arcticflow' },
    { id: 22, name: 'FreezeCore', href: '/brands-control/freezecore' },
    { id: 23, name: 'IceGuard', href: '/brands-control/iceguard' },
    { id: 24, name: 'ColdMax', href: '/brands-control/coldmax' },
    { id: 25, name: 'ThermalFlow', href: '/brands-control/thermalflow' },
    { id: 26, name: 'FrostMax', href: '/brands-control/frostmax' },
    { id: 27, name: 'ChillTech', href: '/brands-control/chilltech' },
    { id: 28, name: 'IceCore', href: '/brands-control/icecore' },
    { id: 29, name: 'CoolGuard', href: '/brands-control/coolguard' },
    { id: 30, name: 'ArcticMax', href: '/brands-control/arcticmax' },
    { id: 31, name: 'FreezeTech', href: '/brands-control/freezetech' },
    { id: 32, name: 'ColdCore', href: '/brands-control/coldcore' },
    { id: 33, name: 'ThermalMax', href: '/brands-control/thermalmax' },
    { id: 34, name: 'IceWave', href: '/brands-control/icewave' },
    { id: 35, name: 'FrostFlow', href: '/brands-control/frostflow' },
    { id: 36, name: 'ChillMax', href: '/brands-control/chillmax' },
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
