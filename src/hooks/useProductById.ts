// src/hooks/useProductById.ts
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/productService"; // Import your service function
import { Product } from "@/data/products"; // Import the Product type

// Custom hook to fetch a product by its ID using React Query
export const useProductById = (productId: string | undefined) => {
  return useQuery<Product | null, Error>({
    // Explicitly type query data and error
    // Query key: Unique identifier for this query. Includes the type and the specific ID.
    queryKey: ["product", productId],
    // Query function: Fetches the data if productId exists.
    queryFn: async () => {
      if (!productId) {
        // If no productId, return null immediately, React Query won't fetch.
        // Or throw an error if productId is strictly required for the query to run.
        return null;
      }
      const product = await getProductById(productId);
      return product; // Returns the product or null if not found by the service
    },
    // Options:
    enabled: !!productId, // Only run the query if productId is truthy (not null/undefined/'')
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Data stays in cache for 30 minutes after inactive
    retry: 1, // Retry failed requests once
    // You might add placeholderData or initialData if needed
  });
};
