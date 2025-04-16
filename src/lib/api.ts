import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { SearchParams, SearchResponse, SearchResult } from '@/types';

// Mock data for search results
const mockData: SearchResult[] = Array(100).fill(null).map((_, index) => ({
  id: `item-${index + 1}`,
  title: `Search Result ${index + 1}`,
  description: `This is a description for search result item ${index + 1}. It contains some more details about the item.`,
  category: ['Technology', 'Business', 'Health', 'Education', 'Entertainment'][Math.floor(Math.random() * 5)],
  imageUrl: `https://picsum.photos/seed/${index + 1}/200/200`,
  createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
}));

// Store active request tokens
const requestTokens: Record<string, CancelTokenSource> = {};

export const cancelPreviousRequests = (key: string = 'search') => {
  if (requestTokens[key]) {
    requestTokens[key].cancel('Operation canceled due to new request');
    delete requestTokens[key];
  }
};

export const search = async (params: SearchParams): Promise<SearchResponse> => {
  // Cancel any previous requests
  cancelPreviousRequests();

  // Create a cancel token for this request
  const source = axios.CancelToken.source();
  requestTokens['search'] = source;

  // Configure the request
  const config: AxiosRequestConfig = {
    cancelToken: source.token,
    // Simulating network delay
    timeout: 3000,
  };

  try {
    // Simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter results based on query
    const query = params.query.toLowerCase();
    const filteredResults = query
      ? mockData.filter(
          item =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        )
      : mockData;

    // Apply pagination
    const { page, limit } = params;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const hasMore = endIndex < filteredResults.length;
    const nextPage = hasMore ? page + 1 : null;

    // Return the response structure
    return {
      results: paginatedResults,
      totalCount: filteredResults.length,
      hasMore,
      nextPage,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      console.error('Error during search:', error);
    }
    throw error;
  } finally {
    // Clean up the token if the request completes
    delete requestTokens['search'];
  }
}; 