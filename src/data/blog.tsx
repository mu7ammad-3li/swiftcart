// src/data/blog.ts
import { Timestamp } from "firebase/firestore";

export type BlogPostStatus = "published" | "draft";

export interface UnifiedBlogPost {
  id: string; // Unique identifier (Firestore ID or static ID)
  slug: string; // URL-friendly identifier
  title: string;
  content: string; // Markdown content
  excerpt: string; // Short summary
  imageUrl?: string;
  publishedAt: Date; // JavaScript Date object
  updatedAt?: Date; // Optional: JavaScript Date object for last modification
  author?: string;
  relatedProducts?: string[]; // Array of product IDs/slugs
  Priority: number; // Lower numbers typically mean higher priority
  status: BlogPostStatus;
  isStatic: boolean; // True if the post is from staticBlogs.ts, false if from Firestore
  // Add any other common fields like metaDescription, tags, etc. if needed in the future
  // metaDescription?: string;
  // tags?: string[];
}

// Helper function to convert Firestore data to UnifiedBlogPost
// This can be used in services or hooks where Firestore data is fetched.
export const adaptFirestoreDocToUnifiedBlogPost = (
  docId: string,
  data: any // Consider defining a stricter FirestoreBlogPostData type
): UnifiedBlogPost => {
  const publishedAtTimestamp = data.publishedAt;
  let publishedAtDate: Date;

  if (publishedAtTimestamp instanceof Timestamp) {
    publishedAtDate = publishedAtTimestamp.toDate();
  } else if (
    typeof publishedAtTimestamp === "string" ||
    typeof publishedAtTimestamp === "number"
  ) {
    publishedAtDate = new Date(publishedAtTimestamp);
  } else if (
    publishedAtTimestamp &&
    typeof publishedAtTimestamp.toDate === "function"
  ) {
    // Fallback for objects that might have a toDate method (like older SDKs or different structures)
    publishedAtDate = publishedAtTimestamp.toDate();
  } else {
    publishedAtDate = new Date(); // Fallback to now if undefined or unparseable
    console.warn(
      `PublishedAt for post ID ${docId} was invalid. Defaulting to current date.`
    );
  }

  let updatedAtDate: Date | undefined = undefined;
  if (data.updatedAt) {
    if (data.updatedAt instanceof Timestamp) {
      updatedAtDate = data.updatedAt.toDate();
    } else if (
      typeof data.updatedAt === "string" ||
      typeof data.updatedAt === "number"
    ) {
      updatedAtDate = new Date(data.updatedAt);
    } else if (data.updatedAt && typeof data.updatedAt.toDate === "function") {
      updatedAtDate = data.updatedAt.toDate();
    }
  }

  return {
    id: docId,
    title: data.title || "Untitled Post",
    slug: data.slug || "",
    content: data.content || "",
    excerpt:
      data.excerpt ||
      (data.content
        ? data.content.substring(0, 150) + "..."
        : "No excerpt available."),
    imageUrl: data.imageUrl,
    author: data.author,
    relatedProducts: data.relatedProducts || [],
    publishedAt: publishedAtDate,
    updatedAt: updatedAtDate,
    Priority: data.Priority || 3, // Default priority
    status: data.status || "draft", // Default status
    isStatic: false, // Data from Firestore is dynamic
  };
};
