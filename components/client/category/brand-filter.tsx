"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from '@/components/ui/label';

interface BrandFilterProps {
  brands: string[];
  selectedBrands: string[];
  onChange: (selected: string[]) => void;
}

export default function BrandFilter({ brands, selectedBrands, onChange }: BrandFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrandChange = (brand: string) => {
    const newSelection = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    onChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Search brands..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {filteredBrands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox 
                id={brand} 
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandChange(brand)}
              />
              <Label htmlFor={brand} className="font-normal">{brand}</Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
