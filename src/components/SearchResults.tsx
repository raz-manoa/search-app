"use client";

import { Product } from "@/data/products";
import { SearchResultItem } from "@/components/SearchResultItem";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationControls } from "@/components/PaginationControls";
import { useRef, useEffect } from "react";

interface SearchResultsProps {
  results: Product[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  query: string;
}

export function SearchResults({
  results,
  loading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  query,
}: SearchResultsProps) {
  // Keep reference to the last non-empty results to display during page changes
  const lastResultsRef = useRef<Product[]>([]);

  // Update the last results reference when we have non-empty results and not loading
  useEffect(() => {
    if (results.length > 0 && !loading) {
      lastResultsRef.current = results;
    }
  }, [results, loading]);

  // Display items are either current results or last results during page change
  const displayResults =
    results.length > 0 ? results : loading ? lastResultsRef.current : results;

  const hasResults = results.length > 0;
  const hasDisplayResults = displayResults.length > 0;
  const isInitialSearching = loading && (!hasDisplayResults || !query);
  const isPageChanging = loading && (totalCount > 0 || hasDisplayResults);
  const noResultsFound = query && !loading && !hasResults;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        {/* Results Stats - don't show during any loading */}
        {(hasDisplayResults || (totalPages > 1 && totalCount > 0)) && (
          <div className="flex-1 text-sm text-muted-foreground">
            Found {totalCount} results{" "}
            {query ? (
              <span>
                for{" "}
                <span className="font-medium text-foreground">"{query}"</span>
              </span>
            ) : null}
          </div>
        )}
        {(hasDisplayResults || (totalPages > 1 && totalCount > 0)) && (
          <div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              className="justify-end my-0"
            />
          </div>
        )}
      </div>

      {/* No Results Message */}
      {noResultsFound && (
        <div className="py-8 text-center">
          <p className="text-xl font-medium">No results found</p>
          <p className="text-muted-foreground mt-2">
            We couldn't find anything matching "{query}". Try a different search
            term.
          </p>
        </div>
      )}

      {/* Initial Loading State - when no results yet */}
      {isInitialSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
        </div>
      )}

      {/* Page Change Loading State - show loading indicator with previous results */}
      {isPageChanging && (
        <div>
          <div className="mb-4 text-sm text-muted-foreground animate-pulse">
            Loading results...
          </div>

          {hasDisplayResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
              {displayResults.map((result) => (
                <SearchResultItem key={result.id} result={result} />
              ))}
            </div>
          )}

          {!hasDisplayResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <LoadingSkeleton key={`page-change-${index}`} />
                ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results - only show when not loading */}
      {hasResults && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <SearchResultItem key={result.id} result={result} />
          ))}
        </div>
      )}

      {/* Pagination Controls - always show if we have results, even during loading */}
      {(hasDisplayResults || (totalPages > 1 && totalCount > 0)) && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="overflow-hidden h-full flex flex-col border rounded-lg">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-full mb-4" />
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex gap-1 mt-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
}
