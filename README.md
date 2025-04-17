# Search Application with Next.js and Pagination

This is a Next.js application that implements a responsive search feature with pagination controls. It demonstrates how to build an effective search interface that updates results as users type and provides a smooth pagination experience.

## Features

- **Live Search:** Results update as you type with debouncing to optimize performance
- **Pagination:** Clear pagination controls with smooth transitions between pages
- **Results Persistence:** Previous results remain visible (with reduced opacity) during page transitions
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
  - `/src/components/SearchResults.tsx` - Results display with pagination
  - `/src/components/SearchResultItem.tsx` - Individual search result item
  - `/src/components/PaginationControls.tsx` - Component for handling pagination navigation
- `/src/hooks` - Custom React hooks
  - `/src/hooks/useSearch.ts` - Hook that manages the search state and API calls
- `/src/lib` - Utility functions and API implementations
  - `/src/lib/api.ts` - Mock API implementation
  - `/src/lib/utils.ts` - General utility functions
- `/src/types` - TypeScript type definitions
- `/src/data` - Mock data

## How It Works

1. The `useSearch` hook manages search state and API calls
2. When a user types in the search input, a debounced query updates the search parameters
3. The search API is called with the new parameters, canceling any previous in-flight requests
4. Results are rendered in a responsive grid
5. When a user navigates between pages using the pagination controls:
   - Previous results remain visible with reduced opacity
   - A loading indicator appears to show that new results are being fetched
   - Once new results are loaded, they replace the previous results
6. Loading states show skeletons for initial searches when no results exist yet

## Pagination Implementation

The pagination implementation includes several key features:

- **Results Persistence:** During page changes, previous results remain visible (with reduced opacity) to provide visual continuity
- **Reference Management:** The `useRef` hook is used to keep track of the last set of valid results
- **Conditional Rendering:** Different UI states are shown based on whether it's an initial search or a page change
- **Loading States:** Appropriate loading indicators are displayed during page transitions
- **Pagination Controls:** Controls are shown at both the top and bottom of the results for easy navigation

## License

This project is licensed under the MIT License.
