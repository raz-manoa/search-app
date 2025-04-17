import axios, { CancelTokenSource } from 'axios';
import { SearchParams, SearchResponse } from '@/types';

// Store active request tokens
const requestTokens: Record<string, CancelTokenSource> = {};

export const cancelPreviousRequests = (key: string = 'search') => {
  if (requestTokens[key]) {
    requestTokens[key].cancel('Operation canceled due to new request');
    delete requestTokens[key];
  }
};

export const search = async (
  params: SearchParams, 
  signal?: AbortSignal
): Promise<SearchResponse> => {
  // Cancel any previous requests with the same key
  cancelPreviousRequests();

  // Create a cancel token for this request
  const source = axios.CancelToken.source();
  requestTokens['search'] = source;

  // Handle abort signal (if provided)
  if (signal) {
    signal.addEventListener('abort', () => {
      source.cancel('Request aborted');
    });
  }

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    // Make the API request to the Next.js API route
    const response = await axios.get<SearchResponse>(`/api/search?${queryParams.toString()}`, {
      cancelToken: source.token,
      signal, // Pass the abort signal to axios
    });

    return response.data;
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