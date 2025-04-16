import { Product } from '@/data/products';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

export interface SearchResponse {
  results: Product[];
  pagination: Pagination;
  filters: FilterOptions;
}

export interface SearchParams {
  query: string;
  page: number;
  limit: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Pagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: PriceRange;
} 