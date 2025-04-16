'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';

export default function SearchTest() {
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  
  // Test React Query
  const { data, isLoading } = useQuery({
    queryKey: ['test', q],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return `Search results for: ${q}`;
    },
  });
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className="border p-2 rounded"
        />
        <button 
          onClick={() => setQ('')}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
      
      <div className="mt-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <p>{data}</p>
        )}
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold">Current URL State:</h2>
        <p>Query: {q ? `"${q}"` : "<empty>"}</p>
      </div>
    </div>
  );
} 