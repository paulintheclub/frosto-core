"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function BrandsListing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('alphabetical')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const brands = [
    { id: 1, name: 'Bitzer', logo: 'CT', href: '/brands-control/cooltech', logoUrl: '/img.png' },
    { id: 2, name: 'Frascold', logo: 'FP', href: '/brands-control/frostpro', logoUrl: '/img_1.png' },
    { id: 3, name: 'Copeland', logo: 'AS', href: '/brands-control/arcticsystems', logoUrl: '/img_2.png' },
    { id: 4, name: 'Danfoss', logo: 'CM', href: '/brands-control/chillmaster', logoUrl: '/img_3.png' },
    { id: 5, name: 'Bock', logo: 'IF', href: '/brands-control/iceflow', logoUrl: '/img_4.png' },
    { id: 6, name: 'CryoTech', logo: 'CR', href: '/brands-control/cryotech' },
    { id: 7, name: 'FreezePro', logo: 'FZ', href: '/brands-control/freezepro' },
    { id: 8, name: 'ColdChain', logo: 'CC', href: '/brands-control/coldchain' },
    { id: 9, name: 'ThermalPro', logo: 'TP', href: '/brands-control/thermalpro' },
    { id: 10, name: 'FrostGuard', logo: 'FG', href: '/brands-control/frostguard' },
    { id: 11, name: 'ChillCore', logo: 'CC', href: '/brands-control/chillcore' },
    { id: 12, name: 'IceMaster', logo: 'IM', href: '/brands-control/icemaster' },
    { id: 13, name: 'CoolFlow', logo: 'CF', href: '/brands-control/coolflow' },
    { id: 14, name: 'ArcticPro', logo: 'AP', href: '/brands-control/arcticpro' },
    { id: 15, name: 'FreezeMax', logo: 'FM', href: '/brands-control/freezemax' },
    { id: 16, name: 'ColdWave', logo: 'CW', href: '/brands-control/coldwave' },
    { id: 17, name: 'IceTech', logo: 'IT', href: '/brands-control/icetech' },
    { id: 18, name: 'FrostLine', logo: 'FL', href: '/brands-control/frostline' },
    { id: 19, name: 'ChillWave', logo: 'CW', href: '/brands-control/chillwave' },
    { id: 20, name: 'CoolMax', logo: 'CM', href: '/brands-control/coolmax' },
    { id: 21, name: 'ArcticFlow', logo: 'AF', href: '/brands-control/arcticflow' },
    { id: 22, name: 'FreezeCore', logo: 'FC', href: '/brands-control/freezecore' },
    { id: 23, name: 'IceGuard', logo: 'IG', href: '/brands-control/iceguard' },
    { id: 24, name: 'ColdMax', logo: 'CM', href: '/brands-control/coldmax' },
    { id: 25, name: 'ThermalFlow', logo: 'TF', href: '/brands-control/thermalflow' },
    { id: 26, name: 'FrostMax', logo: 'FM', href: '/brands-control/frostmax' },
    { id: 27, name: 'ChillTech', logo: 'CT', href: '/brands-control/chilltech' },
    { id: 28, name: 'IceCore', logo: 'IC', href: '/brands-control/icecore' },
    { id: 29, name: 'CoolGuard', logo: 'CG', href: '/brands-control/coolguard' },
    { id: 30, name: 'ArcticMax', logo: 'AM', href: '/brands-control/arcticmax' },
    { id: 31, name: 'FreezeTech', logo: 'FT', href: '/brands-control/freezetech' },
    { id: 32, name: 'ColdCore', logo: 'CC', href: '/brands-control/coldcore' },
    { id: 33, name: 'ThermalMax', logo: 'TM', href: '/brands-control/thermalmax' },
    { id: 34, name: 'IceWave', logo: 'IW', href: '/brands-control/icewave' },
    { id: 35, name: 'FrostFlow', logo: 'FF', href: '/brands-control/frostflow' },
    { id: 36, name: 'ChillMax', logo: 'CM', href: '/brands-control/chillmax' },
  ]

  // Filter brands-control based on search term
  const filteredBrands = useMemo(() => {
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  // Sort brands-control
  const sortedBrands = useMemo(() => {
    const sorted = [...filteredBrands]
    switch (sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'reverse-alphabetical':
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return sorted
    }
  }, [filteredBrands, sortBy])

  // Pagination
  const totalPages = Math.ceil(sortedBrands.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBrands = sortedBrands.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Brands We Work With
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our trusted partners in industrial refrigeration equipment. 
          Each brand represents quality, reliability, and innovation in cooling solutions.
        </p>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for a brand..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page when searching
            }}
            className="pl-10 w-full"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">A-Z</SelectItem>
              <SelectItem value="reverse-alphabetical">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        {searchTerm ? (
          <p>
            Found {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} 
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        ) : (
          <p>Showing {sortedBrands.length} brands</p>
        )}
      </div>

      {/* Brands Grid */}
      {paginatedBrands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {paginatedBrands.map((brand) => (
            <Link key={brand.id} href={brand.href}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  {/* Brand Logo */}
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="w-16 h-16 mx-auto mb-4 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-colors">
                      <span className="text-white font-bold text-xl">
                        {brand.logo}
                      </span>
                    </div>
                  )}

                  
                  {/* Brand Name */}
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {brand.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* No Results */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No brands found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search term or browse all available brands.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber
              if (totalPages <= 5) {
                pageNumber = i + 1
              } else if (currentPage <= 3) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i
              } else {
                pageNumber = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
