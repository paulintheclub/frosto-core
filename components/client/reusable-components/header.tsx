"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Search, Phone, Mail, User, ShoppingCart, Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import CategoriesDropdown from '../dropdown-menu/categories-dropdown'
import BrandsDropdown from '../dropdown-menu/brands-dropdown'
import InformationDropdown from '../dropdown-menu/information-dropdown'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState('РУС')

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/brands', label: 'Brands' },
    { href: '/contacts', label: 'Contacts' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar with contact info - hidden on mobile */}
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IC</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">IndustrialCool</h1>
              <p className="text-xs text-gray-500">Refrigeration Equipment</p>
            </div>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Contact info dropdown - mobile */}
            <div className="lg:hidden">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    +1 (555) 123-4567
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    info@industrialcool.com
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User account */}
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Login</span>
            </Button>

            {/* Shopping cart */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
            
            {/* Language switcher */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  {language}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('РУС')}>
                  РУС
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('УКР')}>
                  УКР
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Mobile search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Navigation links */}
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="#"
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Information
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Desktop navigation with contact info */}
        <nav className="hidden lg:flex mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <CategoriesDropdown />
                  <BrandsDropdown />
                  <InformationDropdown />
                  <NavigationMenuItem>
                    <Link href="/contacts" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Contacts
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            {/* Contact info in navigation */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@industrialcool.com</span>
              </div>
              <div className="text-sm">
                Mon-Fri: 8:00-18:00
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

