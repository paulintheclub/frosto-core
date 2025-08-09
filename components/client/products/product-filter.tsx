"use client"

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProductFilterProps {
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
  availability: boolean;
  onAvailabilityChange: (value: boolean) => void;
  maxPrice: number;
}

export default function ProductFilter({ 
  priceRange, 
  onPriceChange, 
  availability, 
  onAvailabilityChange,
  maxPrice 
}: ProductFilterProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Price Range</Label>
        <Slider 
          defaultValue={priceRange} 
          max={maxPrice} 
          step={10} 
          onValueCommit={onPriceChange} 
        />
        <div className="flex justify-between text-sm mt-2">
          <span>€{priceRange[0]}</span>
          <span>€{priceRange[1]}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="availability">Available only</Label>
        <Switch 
          id="availability"
          checked={availability}
          onCheckedChange={onAvailabilityChange}
        />
      </div>
    </div>
  );
}
