// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/productService"; // Import your service function
import { Product } from "@/data/products"; // Import the Product type

// Custom hook to fetch all products using React Query
export const useProducts = () => {
  return useQuery<Product[], Error>({
    // Data is an array of Products
    // Query key: A unique identifier for this query.
    // Since it's a list of all products, a simple key like ["products"] is common.
    queryKey: ["products"],
    // Query function: The async function that fetches the data.
    queryFn: getProducts, // Directly use your existing service function
    // Options:
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes.
    // During this time, components using this hook will get cached data
    // without re-fetching.
    cacheTime: 1000 * 60 * 30, // Data stays in cache for 30 minutes after it's no longer used
    // (i.e., no active observers/components using the query).
    // If a component remounts within this time and the data is stale,
    // it will be served from cache while a background refetch might occur.
    // refetchOnWindowFocus: false, // Optional: uncomment if you don't want to refetch when window gains focus
    // refetchOnMount: true, // Default is true. Set to false if you only want to fetch once and rely on staleTime.
    // For product lists that don't change extremely rapidly, `true` with a good `staleTime` is often fine.
  });
};
