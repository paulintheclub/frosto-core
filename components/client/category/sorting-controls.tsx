"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SortingControlsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function SortingControls({ sortBy, onSortChange }: SortingControlsProps) {
  return (
    <div className="flex justify-end mb-4">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
          <SelectItem value="reverse-alphabetical">Alphabetical (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
