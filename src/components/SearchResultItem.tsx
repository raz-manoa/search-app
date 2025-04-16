"use client";

import { Product } from '@/data/products';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface SearchResultItemProps {
  result: Product;
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  const date = new Date(result.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(result.price);

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
      {result.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={result.imageUrl}
            alt={result.name}
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
        <CardTitle className="text-xl line-clamp-2">{result.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg">{formattedPrice}</span>
          <div className="flex items-center gap-1">
            <span className="text-amber-500">★</span>
            <span>{result.rating}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-3">{result.description}</CardDescription>
        <div className="mt-3 flex flex-wrap gap-1">
          {result.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs py-0.5 px-1.5 bg-slate-100 rounded-sm text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground pt-0 flex justify-between">
        <span>Brand: {result.brand}</span>
        <span>Stock: {result.stock}</span>
      </CardFooter>
    </Card>
  );
} 