"use client";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryState, parseAsString, parseAsInteger, createParser } from 'nuqs';
import { search } from '@/lib/api';
import { SearchParams, SearchResponse } from '@/types';
import { useEffect, useRef } from 'react';

// Default values for search parameters
const DEFAULT_LIMIT = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_PRICE_RANGE: [number, number] = [0, 1000];
const DEBOUNCE_MS = 300; // Debounce delay in milliseconds

// Custom parser for sort order
const sortOrderParser = createParser({
  parse: (v: string | null) => v === 'desc' ? 'desc' : 'asc',
  serialize: (v: 'asc' | 'desc') => v,
});

export function useSearch() {
  // URL search params with NUQS
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(DEFAULT_PAGE));
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault('all'));
  const [brand, setBrand] = useQueryState('brand', parseAsString.withDefault('all'));
  const [minPrice, setMinPrice] = useQueryState('minPrice', parseAsInteger.withDefault(DEFAULT_PRICE_RANGE[0]));
  const [maxPrice, setMaxPrice] = useQueryState('maxPrice', parseAsInteger.withDefault(DEFAULT_PRICE_RANGE[1]));
  const [sortBy, setSortBy] = useQueryState('sortBy', parseAsString.withDefault('name'));
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', sortOrderParser.withDefault('asc'));

  // For tracking query changes
  const queryClient = useQueryClient();
  
  // Prepare search parameters for the API
  const searchParams: SearchParams = {
    query: q ?? '',
    page: page ?? DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    category: category === 'all' ? '' : (category ?? ''),
    brand: brand === 'all' ? '' : (brand ?? ''),
    minPrice: minPrice ?? DEFAULT_PRICE_RANGE[0],
    maxPrice: maxPrice ?? DEFAULT_PRICE_RANGE[1],
    sortBy: sortBy ?? 'name',
    sortOrder: sortOrder ?? 'asc',
  };

  // Set up debounced query
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // React Query for data fetching with cancellation and debouncing
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery<SearchResponse>({
    queryKey: ['search', searchParams],
    queryFn: async ({ signal }) => {
      // Pass AbortSignal to the search function for cancellation
      return search(searchParams, signal);
    },
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    refetchOnWindowFocus: false,
    // Important: Disable auto-fetching to control timing with our debounce
    enabled: false,
  });

  // Use effect to trigger debounced fetch when query parameters change
  useEffect(() => {
    // Cancel any previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer to delay the actual API request
    debounceTimerRef.current = setTimeout(() => {
      // Clear previous requests to avoid race conditions
      queryClient.cancelQueries({ queryKey: ['search'] });
      
      // Execute the request after the debounce period
      refetch();
    }, DEBOUNCE_MS);
    
    // Cleanup on unmount or when dependencies change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    q, 
    page, 
    category, 
    brand, 
    minPrice, 
    maxPrice, 
    sortBy, 
    sortOrder, 
    queryClient, 
    refetch
  ]);

  // Cancel previous requests when component unmounts
  useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: ['search'] });
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [queryClient]);

  // Handlers for updating search parameters
  const handleSearchChange = (value: string) => {
    setQ(value);
    // Reset page on search change
    if (page !== DEFAULT_PAGE) {
      setPage(DEFAULT_PAGE);
    }
  };

  const handleCategoryChange = (category: string) => {
    setCategory(category);
    setPage(DEFAULT_PAGE);
  };

  const handleBrandChange = (brand: string) => {
    setBrand(brand);
    setPage(DEFAULT_PAGE);
  };

  const handlePriceChange = (range: [number, number]) => {
    setMinPrice(range[0]);
    setMaxPrice(range[1]);
    setPage(DEFAULT_PAGE);
  };

  const handleSortChange = (sortBy: string, order: 'asc' | 'desc') => {
    setSortBy(sortBy);
    setSortOrder(order);
    setPage(DEFAULT_PAGE);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Calculate total pages based on total count and limit
  const totalPages = data?.pagination 
    ? Math.ceil(data.pagination.totalCount / DEFAULT_LIMIT) 
    : 1;

  return {
    query: q ?? '',
    results: data?.results ?? [],
    loading: isLoading,
    error,
    currentPage: page ?? DEFAULT_PAGE,
    totalPages,
    totalCount: data?.pagination.totalCount ?? 0,
    filters: data?.filters ?? {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 0 },
    },
    selectedCategory: category ?? 'all',
    selectedBrand: brand ?? 'all',
    priceRange: [minPrice ?? DEFAULT_PRICE_RANGE[0], maxPrice ?? DEFAULT_PRICE_RANGE[1]] as [number, number],
    sortBy: sortBy ?? 'name',
    sortOrder: sortOrder ?? 'asc',
    handleSearchChange,
    handleCategoryChange,
    handleBrandChange,
    handlePriceChange,
    handleSortChange,
    handlePageChange,
    setQuery: setQ,
  };
} 