"use client";

import { useEffect, useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SearchFiltersProps {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  selectedCategory: string;
  selectedBrand: string;
  currentPriceRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  onReset: () => void;
}

export function SearchFilters({
  categories,
  brands,
  priceRange,
  selectedCategory,
  selectedBrand,
  currentPriceRange,
  sortBy,
  sortOrder,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSortChange,
  onReset
}: SearchFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(currentPriceRange);
  
  // Update local price range when props change
  useEffect(() => {
    setLocalPriceRange(currentPriceRange);
  }, [currentPriceRange]);

  // Handle price slider change
  const handlePriceChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalPriceRange(newRange);
  };

  // Apply price range when slider stops
  const handlePriceChangeCommitted = () => {
    onPriceChange(localPriceRange);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-md p-4 border mb-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <Label htmlFor="category-select" className="block text-sm font-medium mb-1">
              Category
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={onCategoryChange}
            >
              <SelectTrigger id="category-select" className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand Filter */}
          <div>
            <Label htmlFor="brand-select" className="block text-sm font-medium mb-1">
              Brand
            </Label>
            <Select
              value={selectedBrand}
              onValueChange={onBrandChange}
            >
              <SelectTrigger id="brand-select" className="w-full">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div>
            <Label className="block text-sm font-medium mb-3">
              Price Range: {formatPrice(localPriceRange[0])} - {formatPrice(localPriceRange[1])}
            </Label>
            
            <Slider
              defaultValue={[priceRange.min, priceRange.max]}
              max={priceRange.max}
              min={priceRange.min}
              step={10}
              value={[localPriceRange[0], localPriceRange[1]]}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceChangeCommitted}
              className="my-6"
            />
          </div>

          {/* Sort Options */}
          <div>
            <Label htmlFor="sort-select" className="block text-sm font-medium mb-1">
              Sort By
            </Label>
            <div className="flex gap-2">
              <Select
                value={sortBy}
                onValueChange={(value: string) => onSortChange(value, sortOrder)}
              >
                <SelectTrigger id="sort-select" className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h4"/><path d="M11 8h7"/><path d="M11 12h10"/></svg>
                )}
              </Button>
            </div>
          </div>

          {/* Reset Filters */}
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full mt-2"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
} 