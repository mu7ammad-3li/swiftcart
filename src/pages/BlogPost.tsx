// src/pages/BlogPost.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublishedBlogBySlug } from "../services/blogService"; // Updated service import
import { staticBlogPosts } from "@/data/staticBlogs";
import { UnifiedBlogPost } from "@/data/blog"; // Import UnifiedBlogPost
import { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

import { format } from "date-fns";
import { arEG } from "date-fns/locale";

import Spinner from "../components/ui/Spinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// Removed Timestamp import as UnifiedBlogPost uses Date

import Navbar from "../components/Navbar";
import NavbarCartButton from "@/components/NavbarCartButton";
import Footer from "../components/Footer";
import { ChevronRight, AlertTriangle, Tag } from "lucide-react";

// No need for FullDisplayBlogPost interface

const IndividualBlogPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blogPost, setBlogPost] = useState<UnifiedBlogPost | null>(null); // Use UnifiedBlogPost
  const [loadingPost, setLoadingPost] = useState(true);
  const [relatedProductsData, setRelatedProductsData] = useState<Product[]>([]);
  const [postError, setPostError] = useState<string | null>(null);

  const {
    data: allProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorLoadingProducts,
  } = useProducts();

  const fetchBlogPostDetails = useCallback(async () => {
    if (!slug) {
      setPostError("لم يتم تحديد رابط المقالة.");
      setLoadingPost(false);
      return;
    }

    setLoadingPost(true);
    setPostError(null);
    setBlogPost(null);
    setRelatedProductsData([]);

    // 1. Check static blogs first
    // staticBlogPosts are already Array<UnifiedBlogPost>
    const staticPost = staticBlogPosts.find(
      (p) => p.slug === slug && p.status === "published"
    );

    if (staticPost) {
      setBlogPost(staticPost); // Already UnifiedBlogPost
      setLoadingPost(false);
      return;
    }

    // 2. If not found in static, fetch from Firestore
    try {
      // getPublishedBlogBySlug now returns UnifiedBlogPost | null
      const fetchedPostFromDB = await getPublishedBlogBySlug(slug);

      if (fetchedPostFromDB) {
        // Already checks for published status in service
        setBlogPost(fetchedPostFromDB);
      } else {
        setPostError("المقالة غير موجودة أو غير متاحة للنشر.");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching from DB.";
      console.error("Error fetching blog post by slug from DB:", slug, err);
      setPostError(`فشل تحميل المقالة: ${errorMsg}`);
    } finally {
      setLoadingPost(false);
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogPostDetails();
  }, [fetchBlogPostDetails]);

  useEffect(() => {
    if (
      blogPost &&
      blogPost.relatedProducts &&
      blogPost.relatedProducts.length > 0 &&
      allProducts &&
      allProducts.length > 0
    ) {
      const related = allProducts.filter((product) =>
        blogPost.relatedProducts!.includes(product.id)
      );
      setRelatedProductsData(related);
    } else {
      setRelatedProductsData([]);
    }
  }, [blogPost, allProducts]);

  if (loadingPost) {
    return (
      <>
        <Navbar cartButton={<NavbarCartButton />} />
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <Spinner />
        </div>
        <Footer />
      </>
    );
  }

  if (postError || !blogPost) {
    return (
      <>
        <Navbar cartButton={<NavbarCartButton />} />
        <div className="bella-container text-center py-16 md:py-20 min-h-[calc(100vh-200px)] flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            خطأ في عرض المقالة
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            {postError ||
              "تعذر العثور على المقالة المطلوبة أو حدث خطأ غير متوقع."}
          </p>
          <Link
            to="/blog"
            className="mt-8 bella-button inline-block bg-bella hover:bg-bella-dark text-white"
          >
            العودة إلى صفحة المقالات
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar cartButton={<NavbarCartButton />} />
      <div className="bg-gray-50 dark:bg-gray-900 py-8 md:pt-12">
        <div className="container mx-auto px-4">
          <nav
            className="mb-6 text-sm text-gray-600 dark:text-gray-400"
            aria-label="Breadcrumb"
          >
            <ol className="list-none p-0 inline-flex flex-wrap">
              <li className="flex items-center">
                <Link
                  to="/"
                  className="hover:text-bella dark:hover:text-bella-light"
                >
                  الرئيسية
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
              </li>
              <li className="flex items-center">
                <Link
                  to="/blog"
                  className="hover:text-bella dark:hover:text-bella-light"
                >
                  المقالات
                </Link>
                <ChevronRight className="h-4 w-4 mx-1" />
              </li>
              <li className="flex items-center">
                <span
                  className="text-gray-800 dark:text-gray-200 font-medium"
                  aria-current="page"
                >
                  {blogPost.title}
                </span>
              </li>
            </ol>
          </nav>

          <article className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-10">
            {blogPost.imageUrl && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={blogPost.imageUrl}
                  alt={blogPost.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white leading-tight">
              {blogPost.title}
            </h1>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
              {blogPost.author && (
                <span className="font-medium">
                  بواسطة: {blogPost.author} |{" "}
                </span>
              )}
              <span>
                {format(blogPost.publishedAt, "PPP", { locale: arEG })}
              </span>
              {blogPost.updatedAt &&
                blogPost.updatedAt.getTime() !==
                  blogPost.publishedAt.getTime() && (
                  <span className="ml-2 text-xs">
                    (تم التحديث:{" "}
                    {format(blogPost.updatedAt, "PPP", { locale: arEG })})
                  </span>
                )}
            </div>

            <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-bella hover:prose-a:text-bella-dark dark:prose-a:text-bella-light dark:hover:prose-a:text-bella prose-strong:text-gray-800 dark:prose-strong:text-gray-100 prose-ul:list-disc prose-ul:ml-5 prose-ol:list-decimal prose-ol:ml-5 prose-img:rounded-md prose-img:shadow-sm prose-blockquote:border-r-4 prose-blockquote:border-bella dark:prose-blockquote:border-bella-light prose-blockquote:pl-4 prose-blockquote:italic">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blogPost.content}
              </ReactMarkdown>
            </div>

            {blogPost.relatedProducts &&
              blogPost.relatedProducts.length > 0 && (
                <section className="mt-12 border-t-2 border-gray-100 dark:border-gray-700 pt-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Tag className="h-6 w-6 text-bella dark:text-bella-light" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      منتجات ذات صلة مذكورة في المقال
                    </h2>
                  </div>
                  {isLoadingProducts && (
                    <div className="flex justify-center my-4">
                      <Spinner />
                    </div>
                  )}
                  {isErrorProducts && (
                    <p className="text-red-500 dark:text-red-400 text-center">
                      حدث خطأ أثناء تحميل المنتجات ذات الصلة:{" "}
                      {errorLoadingProducts?.message}
                    </p>
                  )}
                  {!isLoadingProducts &&
                    !isErrorProducts &&
                    relatedProductsData.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {relatedProductsData.map((product) => (
                          <Link
                            to={`/products/${product.id}`}
                            key={product.id}
                            className="group block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/50 hover:border-bella dark:hover:border-bella-light"
                          >
                            <div className="w-full h-40 sm:h-48 bg-gray-50 dark:bg-gray-700/30 overflow-hidden p-2">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) =>
                                    (e.currentTarget.src = "/placeholder.png")
                                  }
                                />
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100 group-hover:text-bella dark:group-hover:text-bella-light transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                {product.shortDescription}
                              </p>
                              <span className="text-bella dark:text-bella-light font-medium text-sm flex items-center gap-1">
                                عرض المنتج{" "}
                                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  {!isLoadingProducts &&
                    !isErrorProducts &&
                    relatedProductsData.length === 0 &&
                    !loadingPost && (
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        لم يتم العثور على منتجات ذات صلة.
                      </p>
                    )}
                </section>
              )}
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default IndividualBlogPage;
