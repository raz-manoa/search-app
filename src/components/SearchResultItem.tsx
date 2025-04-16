"use client";

import { SearchResult } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface SearchResultItemProps {
  result: SearchResult;
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  const date = new Date(result.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      {result.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={result.imageUrl}
            alt={result.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800">
            {result.category}
          </span>
          <time className="text-xs text-muted-foreground">
            {formattedDate}
          </time>
        </div>
        <CardTitle className="text-xl line-clamp-2">{result.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">{result.description}</CardDescription>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground pt-0">ID: {result.id}</CardFooter>
    </Card>
  );
} 