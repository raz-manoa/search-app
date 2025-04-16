"use client";

import { SearchInput } from '@/components/SearchInput';
import { SearchResults } from '@/components/SearchResults';
import { useSearch } from '@/hooks/useSearch';

export function SearchPage() {
  const {
    query,
    results,
    loading,
    error,
    hasMore,
    totalCount,
    handleSearchChange,
    loadMore,
  } = useSearch({
    debounceTime: 400,
    limit: 12,
  });

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="container px-4 py-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Search Our Content
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start typing to search our extensive library of content. Results will update as you type.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto mb-8">
          <SearchInput
            value={query}
            onChange={handleSearchChange}
            placeholder="Search for anything..."
            className="w-full"
          />
        </div>

        {error && (
          <div className="w-full text-center p-4 mb-8 bg-red-50 text-red-600 rounded-md">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </div>
        )}

        <SearchResults
          results={results}
          loading={loading}
          hasMore={hasMore}
          totalCount={totalCount}
          onLoadMore={loadMore}
          query={query}
        />
      </div>
    </div>
  );
} 