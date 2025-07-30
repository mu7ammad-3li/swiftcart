// src/pages/Blog.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { staticBlogPosts } from "@/data/staticBlogs";
import { UnifiedBlogPost, BlogPostStatus } from "@/data/blog"; // Import UnifiedBlogPost
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Terminal,
  Image as ImageIconPlaceholder,
  BookOpenCheck,
  Edit3,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import NavbarCartButton from "@/components/NavbarCartButton";
import Footer from "../components/Footer";
// No need for DisplayCardBlogPost or adapter functions anymore if types align

const BlogPostCard: React.FC<{ post: UnifiedBlogPost }> = ({ post }) => {
  const publishedDate = post.publishedAt.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const placeholder = target.parentElement?.querySelector(
      ".image-placeholder-container"
    );
    if (placeholder) {
      (placeholder as HTMLElement).style.display = "flex";
    }
  };

  return (
    <Link
      to={`/blog/${post.slug}`}
      key={post.id}
      className="blog-post-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group h-full"
    >
      <div className="relative w-full h-56 overflow-hidden">
        {post.imageUrl ? (
          <>
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
            <div
              className="image-placeholder-container absolute inset-0 w-full h-full bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500"
              style={{ display: "none" }}
            >
              <ImageIconPlaceholder
                size={48}
                strokeWidth={1.5}
                className="mb-2"
              />
              <span>صورة غير متوفرة</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <ImageIconPlaceholder
              size={48}
              strokeWidth={1.5}
              className="mb-2"
            />
            <span>صورة غير متوفرة</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-bella dark:group-hover:text-bella-light transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3">
          {post.author && <span className="font-medium">{post.author} • </span>}
          {publishedDate}
          {post.isStatic && (
            <span className="text-bella-dark dark:text-bella-light font-semibold ml-2">
              (مقالة ثابتة)
            </span>
          )}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        <span className="mt-auto text-bella dark:text-bella-light font-semibold text-sm self-start group-hover:underline flex items-center gap-1">
          اقرأ أكـتر{" "}
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

const BlogListPage: React.FC = () => {
  const {
    data: dynamicBlogPosts, // Already UnifiedBlogPost[] from the hook
    isLoading,
    isError,
    error,
  } = useBlogPosts();

  // Combine static and dynamic posts
  // The staticBlogPosts already conform to UnifiedBlogPost[]
  // The dynamicBlogPosts from the hook also conform to UnifiedBlogPost[]
  const allPosts = React.useMemo(() => {
    const posts = [...staticBlogPosts];
    if (dynamicBlogPosts) {
      // Filter out dynamic posts that might have the same ID as a static post, preferring static.
      const staticIds = new Set(staticBlogPosts.map((p) => p.id));
      const uniqueDynamicPosts = dynamicBlogPosts.filter(
        (dp) => !staticIds.has(dp.id)
      );
      posts.push(...uniqueDynamicPosts);
    }
    // Sort all posts together: by Priority (asc), then by publishedAt (desc)
    return posts.sort((a, b) => {
      if (a.Priority !== b.Priority) {
        return a.Priority - b.Priority;
      }
      return b.publishedAt.getTime() - a.publishedAt.getTime();
    });
  }, [dynamicBlogPosts]);

  let content;
  if (isLoading && (!staticBlogPosts || staticBlogPosts.length === 0)) {
    // Show skeletons only if no static content to show immediately
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="border rounded-xl overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg"
          >
            <Skeleton className="w-full h-56" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/4 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-5 w-1/3 mt-2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (isError && allPosts.length === 0) {
    // Show error only if no posts at all
    content = (
      <Alert
        variant="destructive"
        className="max-w-xl mx-auto my-10 bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-700"
      >
        <Terminal className="h-5 w-5 text-red-600 dark:text-red-400" />
        <AlertTitle className="font-semibold text-red-700 dark:text-red-300">
          حدث خطأ
        </AlertTitle>
        <AlertDescription className="text-red-600 dark:text-red-400">
          فشل تحميل المقالات. يرجى المحاولة مرة أخرى لاحقًا.
          {error?.message && (
            <small className="mt-2 block text-xs">
              التفاصيل: {error.message}
            </small>
          )}
        </AlertDescription>
      </Alert>
    );
  } else if (allPosts.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {allPosts.map((post) => (
          <BlogPostCard
            key={post.isStatic ? `static-${post.id}` : `dynamic-${post.id}`}
            post={post}
          />
        ))}
      </div>
    );
  } else {
    // This case means not loading, no error, and allPosts is empty.
    content = (
      <p className="text-center text-gray-600 dark:text-gray-400 mt-10 text-lg">
        لا توجد مقالات متاحة حالياً.
      </p>
    );
  }

  return (
    <>
      <Navbar cartButton={<NavbarCartButton />} />
      <header className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white pt-32 md:pt-36 pb-16 md:pb-20">
        <div className="container mx-auto px-4 text-center">
          <BookOpenCheck className="h-16 w-16 text-bella dark:text-bella-light mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-bella dark:text-bella-light tracking-tight">
            معلومات تهمك من بيلا إيجيبت
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            اكتشف آخر النصائح والمعلومات المهمة حول مكافحة الآفات، العناية
            بالمنزل، وكيفية استخدام منتجاتنا بفعالية وأمان.
          </p>
        </div>
      </header>

      <main className="blog-list-container container mx-auto py-10 md:py-16 px-4">
        {/* Static blogs and dynamic blogs are now merged and sorted */}
        {/* If you still want separate sections, you'd filter `allPosts` by `isStatic` */}
        <section>
          {isLoading &&
            allPosts.length > 0 && ( // Show loading indicator if there's static content but dynamic is still loading
              <div className="text-center my-8">
                <Skeleton className="h-8 w-1/2 mx-auto rounded" />
                <Skeleton className="h-4 w-1/4 mx-auto mt-2 rounded" />
              </div>
            )}
          {allPosts.length > 0 && (
            <div className="flex items-center justify-center md:justify-start mb-8 gap-3">
              <Edit3 className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                أحدث المقالات والنصائح
              </h2>
            </div>
          )}
          {content}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogListPage;
