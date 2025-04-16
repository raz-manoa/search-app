"use client";

import { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  children: React.ReactNode;
}

export function InfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  threshold = 300,
  children,
}: InfiniteScrollProps) {
  // Reference to the container
  const containerRef = useRef<HTMLDivElement>(null);
  // Track whether we're currently loading more content
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      if (!hasMore || loading || isLoadingMore) return;

      const containerRect = container.getBoundingClientRect();
      const bottomVisible = window.innerHeight - containerRect.bottom > -threshold;

      if (bottomVisible) {
        setIsLoadingMore(true);
        onLoadMore();
      }
    };

    // Reset loading more state when loading completes
    if (isLoadingMore && !loading) {
      setIsLoadingMore(false);
    }

    // Add scroll event listener
    window.addEventListener('scroll', checkScroll);

    // Initial check in case content isn't enough to trigger scroll
    checkScroll();

    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, [hasMore, loading, onLoadMore, isLoadingMore, threshold]);

  return <div ref={containerRef}>{children}</div>;
} 