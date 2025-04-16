export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  hasMore: boolean;
  nextPage: number | null;
}

export interface SearchParams {
  query: string;
  page: number;
  limit: number;
} 