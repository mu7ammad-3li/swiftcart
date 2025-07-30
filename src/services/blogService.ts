// src/services/blogService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp, // Keep for type checking if necessary, but UnifiedBlogPost uses Date
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  UnifiedBlogPost,
  BlogPostStatus, // If needed for filtering, though status is already part of UnifiedBlogPost
  adaptFirestoreDocToUnifiedBlogPost,
} from "../data/blog"; // Updated import

const BLOG_POSTS_COLLECTION = "blog_posts";

/**
 * Fetches all published blog posts from Firestore, ordered by Priority then publishedAt.
 * @returns Promise<UnifiedBlogPost[]>
 * @throws {Error} If fetching fails.
 */
export const getAllPublishedBlogs = async (): Promise<UnifiedBlogPost[]> => {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  try {
    const q = query(
      collection(db, BLOG_POSTS_COLLECTION),
      where("status", "==", "published"),
      orderBy("Priority", "asc"),
      orderBy("publishedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) =>
      adaptFirestoreDocToUnifiedBlogPost(docSnap.id, docSnap.data())
    );
  } catch (error) {
    console.error("Error fetching all published blog posts: ", error);
    if (
      error instanceof Error &&
      error.message.includes("indexes?create_composite")
    ) {
      console.error(
        "Firestore index missing! Please create required composite indexes for 'blog_posts' collection. Check Firestore console."
      );
      throw new Error(
        "Firestore index missing for blog posts query. Check console for details."
      );
    }
    throw new Error("Failed to fetch published blog posts.");
  }
};

/**
 * Fetches a single published blog post by its slug from Firestore.
 * @param slug The slug of the blog post.
 * @returns Promise<UnifiedBlogPost | null> The blog post or null if not found or not published.
 * @throws {Error} If fetching fails.
 */
export const getPublishedBlogBySlug = async (
  slug: string
): Promise<UnifiedBlogPost | null> => {
  if (!db) {
    throw new Error("Firestore is not initialized.");
  }
  if (!slug) {
    console.warn("getPublishedBlogBySlug called with no slug");
    return null;
  }
  try {
    const q = query(
      collection(db, BLOG_POSTS_COLLECTION),
      where("slug", "==", slug),
      where("status", "==", "published") // Ensure only published posts are fetched by slug
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]; // Assuming slugs are unique for published posts
      return adaptFirestoreDocToUnifiedBlogPost(docSnap.id, docSnap.data());
    }
    console.log(`No published blog post found with slug: ${slug}`);
    return null;
  } catch (error) {
    console.error(
      `Error fetching published blog post by slug "${slug}": `,
      error
    );
    if (
      error instanceof Error &&
      error.message.includes("indexes?create_composite")
    ) {
      console.error(
        "Firestore index missing! Please create required composite indexes for 'blog_posts' collection. Check Firestore console."
      );
      throw new Error(
        "Firestore index missing for blog post slug query. Check console for details."
      );
    }
    throw new Error(`Failed to fetch published blog post with slug ${slug}.`);
  }
};
