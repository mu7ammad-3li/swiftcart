// src/hooks/useBlogPosts.ts
import { useQuery } from "@tanstack/react-query";
import { getAllPublishedBlogs } from "@/services/blogService"; // Use the updated service
import { UnifiedBlogPost } from "@/data/blog"; // Import the unified type

// No need to redefine BlogPost here.

const fetchPublishedBlogPosts = async (): Promise<UnifiedBlogPost[]> => {
  return getAllPublishedBlogs(); // Service now returns UnifiedBlogPost[]
};

export const useBlogPosts = () => {
  return useQuery<UnifiedBlogPost[], Error>({
    queryKey: ["blogPosts", "published"],
    queryFn: fetchPublishedBlogPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      if (error.message.includes("indexes?create_composite")) {
        return false;
      }
      return failureCount < 2;
    },
  });
};
