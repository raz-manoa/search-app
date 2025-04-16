import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET(request: NextRequest) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0', 10);
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000', 10);
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Filter products based on search criteria
    let filteredProducts = [...products];

    // Apply text search across multiple fields
    if (query) {
      const queryLower = query.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.category.toLowerCase().includes(queryLower) ||
        product.brand.toLowerCase().includes(queryLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(queryLower))
      );
    }

    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply brand filter
    if (brand) {
      filteredProducts = filteredProducts.filter(product => 
        product.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default: // name
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;
    const nextPage = hasMore ? page + 1 : null;

    return NextResponse.json({
      results: paginatedProducts,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasMore,
        nextPage
      },
      filters: {
        categories: Array.from(new Set(products.map(p => p.category))),
        brands: Array.from(new Set(products.map(p => p.brand))),
        priceRange: {
          min: Math.min(...products.map(p => p.price)),
          max: Math.max(...products.map(p => p.price))
        }
      }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 