"use client";

import { SearchInput } from "@/components/SearchInput";
import { SearchResults } from "@/components/SearchResults";
import { SearchFilters } from "@/components/SearchFilters";
import { useSearch } from "@/hooks/useSearch";

export function SearchPage() {
  const {
    query,
    results,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    filters,
    selectedCategory,
    selectedBrand,
    priceRange,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleCategoryChange,
    handleBrandChange,
    handlePriceChange,
    handleSortChange,
    handlePageChange,
    setQuery,
  } = useSearch();

  // Reset all filters
  const handleResetFilters = () => {
    handleCategoryChange("all");
    handleBrandChange("all");
    handlePriceChange([filters.priceRange.min, filters.priceRange.max]);
    handleSortChange("name", "asc");
  };

  console.log("loading", loading);
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="container px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Product Search
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search our catalog of products. Results will update as you type.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mb-8">
          <SearchInput
            value={query}
            onChange={handleSearchChange}
            placeholder="Search for products..."
            className="w-full"
          />
        </div>

        {error && (
          <div className="w-full text-center p-4 mb-8 bg-red-50 text-red-600 rounded-md">
            {error.message || "An unexpected error occurred. Please try again."}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <div className="md:col-span-1">
            <SearchFilters
              className="sticky top-20"
              categories={filters.categories}
              brands={filters.brands}
              priceRange={filters.priceRange}
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              currentPriceRange={priceRange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onCategoryChange={handleCategoryChange}
              onBrandChange={handleBrandChange}
              onPriceChange={handlePriceChange}
              onSortChange={handleSortChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Search results */}
          <div className="md:col-span-3">
            <SearchResults
              results={results}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              query={query}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
