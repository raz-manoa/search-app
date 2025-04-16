"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { search, cancelPreviousRequests } from '@/lib/api';
import { SearchParams, SearchResponse, SearchResult } from '@/types';

interface UseSearchProps {
  initialQuery?: string;
  debounceTime?: number;
  limit?: number;
}

export function useSearch({
  initialQuery = '',
  debounceTime = 300,
  limit = 10,
}: UseSearchProps = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Keep track of the mounted state to prevent state updates after unmount
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // Cancel any active requests when the component unmounts
      cancelPreviousRequests();
    };
  }, []);

  // Reset search state when query changes
  useEffect(() => {
    setPage(1);
    setResults([]);
    setHasMore(true);
  }, [query]);

  // Create debounced search function
  const debouncedSearch = useDebouncedCallback(async (searchParams: SearchParams) => {
    if (!mounted.current) return;

    setLoading(true);
    setError(null);

    try {
      const response = await search(searchParams);
      
      if (!mounted.current) return;

      // If this is the first page, replace results; otherwise append
      setResults(prevResults => 
        searchParams.page === 1 
          ? response.results 
          : [...prevResults, ...response.results]
      );
      
      setHasMore(response.hasMore);
      setTotalCount(response.totalCount);
    } catch (err) {
      if (!mounted.current) return;
      
      if (err instanceof Error && err.message !== 'Operation canceled due to new request') {
        setError(err);
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, debounceTime);

  // Function to trigger search
  const performSearch = useCallback(() => {
    const searchParams: SearchParams = {
      query,
      page,
      limit,
    };
    debouncedSearch(searchParams);
  }, [query, page, limit, debouncedSearch]);

  // Search when query or page changes
  useEffect(() => {
    performSearch();
  }, [query, page, performSearch]);

  // Function to load more results
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    hasMore,
    totalCount,
    handleSearchChange,
    loadMore,
    setQuery,
  };
} 