"use client";

import { Product } from '@/data/products';
import { SearchResultItem } from '@/components/SearchResultItem';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationControls } from '@/components/PaginationControls';

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
  const hasResults = results.length > 0;
  const isSearching = loading && query && !hasResults;
  const noResultsFound = query && !loading && !hasResults;

  return (
    <div className="w-full">
      {/* Results Stats */}
      {hasResults && (
        <div className="mb-4 text-sm text-muted-foreground">
          Found {totalCount} results{' '}
          {query ? (
            <span>
              for <span className="font-medium text-foreground">"{query}"</span>
            </span>
          ) : null}
        </div>
      )}

      {/* No Results Message */}
      {noResultsFound && (
        <div className="py-8 text-center">
          <p className="text-xl font-medium">No results found</p>
          <p className="text-muted-foreground mt-2">
            We couldn't find anything matching "{query}". Try a different search term.
          </p>
        </div>
      )}

      {/* Initial Loading State */}
      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
        </div>
      )}

      {/* Search Results */}
      {hasResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <SearchResultItem key={result.id} result={result} />
            ))}
            
            {/* Loading state while changing pages */}
            {loading && hasResults && (
              <>
                {Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <LoadingSkeleton key={`loading-more-${index}`} />
                  ))}
              </>
            )}
          </div>
          
          {/* Pagination Controls */}
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
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