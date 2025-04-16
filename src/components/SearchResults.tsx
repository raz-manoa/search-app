"use client";

import { SearchResult } from '@/types';
import { SearchResultItem } from '@/components/SearchResultItem';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  hasMore: boolean;
  totalCount: number;
  onLoadMore: () => void;
  query: string;
}

export function SearchResults({
  results,
  loading,
  hasMore,
  totalCount,
  onLoadMore,
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
        <InfiniteScroll hasMore={hasMore} loading={loading} onLoadMore={onLoadMore}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <SearchResultItem key={result.id} result={result} />
            ))}
            
            {/* Loading more skeletons */}
            {loading && hasResults && hasMore && (
              <>
                {Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <LoadingSkeleton key={`loading-more-${index}`} />
                  ))}
              </>
            )}
          </div>
        </InfiniteScroll>
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
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
} 