# Live Search with Next.js and Infinite Scroll

This is a Next.js application that implements a live search feature with infinite scroll pagination. It demonstrates how to build a responsive search interface that updates results as users type and loads more content as they scroll.

## Features

- **Live Search:** Results update as you type with debouncing to optimize performance
- **Infinite Scroll:** Pagination through scrolling instead of traditional pagination controls
- **Request Cancellation:** Automatically cancels in-flight requests when a new search is initiated
- **Responsive Design:** Fully responsive grid layout for all screen sizes
- **Mock API:** Includes a mock API service that simulates network requests with configurable delay

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind
- [Axios](https://axios-http.com/) - Promise-based HTTP client
- [use-debounce](https://www.npmjs.com/package/use-debounce) - Hooks for debouncing function calls

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone <repository-url>
cd search-app
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js app router files
- `/src/components` - React components
  - `/src/components/ui` - shadcn UI components
  - `/src/components/SearchPage.tsx` - Main search page component
  - `/src/components/SearchInput.tsx` - Search input component with debounce
  - `/src/components/SearchResults.tsx` - Results display with infinite scroll
  - `/src/components/SearchResultItem.tsx` - Individual search result item
  - `/src/components/InfiniteScroll.tsx` - Component that detects scroll and loads more content
- `/src/hooks` - Custom React hooks
  - `/src/hooks/useSearch.ts` - Hook that manages the search state and API calls
- `/src/lib` - Utility functions and API implementations
  - `/src/lib/api.ts` - Mock API implementation
  - `/src/lib/utils.ts` - General utility functions
- `/src/types` - TypeScript type definitions

## How It Works

1. The `useSearch` hook manages search state and API calls
2. When a user types in the search input, a debounced query updates the search parameters
3. The search API is called with the new parameters, canceling any previous in-flight requests
4. Results are rendered in a responsive grid
5. As the user scrolls to the bottom of the page, the `InfiniteScroll` component detects this and loads the next page of results
6. Loading states show skeletons while data is being fetched

## License

This project is licensed under the MIT License.
