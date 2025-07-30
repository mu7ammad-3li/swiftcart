// src/pages/Store.tsx
import React, {
  useEffect, // Removed useState for products, isLoading, error related to direct fetch
} from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, SprayCan } from "lucide-react";
import NavbarCartButton from "@/components/NavbarCartButton";
// import { Product } from "@/data/products"; // Product type comes from the hook now
import Spinner from "@/components/ui/Spinner";

// Import the NEW hook
import { useProducts } from "@/hooks/useProducts"; // Correct path to your new hook
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const Store: React.FC = () => {
  // Use the useProducts hook to fetch and manage product data
  const {
    data: products, // products will be Product[] | undefined
    isLoading,
    isError,
    error, // error will be Error | null
  } = useProducts();

  // Reveal animation trigger remains the same, tied to isLoading from the hook
  useRevealOnScroll(".reveal", 0.1, !isLoading);

  useEffect(() => {
    window.scrollTo(0, 0);
    // No need for the manual fetchProducts useEffect anymore
  }, []);

  // featuredProduct logic needs to handle products possibly being undefined initially
  const featuredProduct =
    !isLoading && Array.isArray(products)
      ? products.find((p) => p.featured)
      : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar cartButton={<NavbarCartButton />} />
        <div className="flex-grow flex justify-center items-center">
          <Spinner />
        </div>
        {/* Footer might be skipped or placed depending on design */}
      </div>
    );
  }

  if (isError && error) {
    // Check if error object exists
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartButton={<NavbarCartButton />} />
        <div className="bella-container pt-32 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-600">
            خطأ
          </h1>
          {/* Display the error message from the hook */}
          <p className="text-xl text-gray-600">
            {error.message ||
              "فشل تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقًا."}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle case where products might be undefined even if not loading and no error (e.g., initial state of useQuery)
  // or if getProducts returns an empty array successfully.
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar cartButton={<NavbarCartButton />} />
        <div className="bella-container pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">لا توجد منتجات</h1>
          <p className="text-xl text-gray-600">
            لا توجد منتجات متاحة حاليا في المتجر.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartButton={<NavbarCartButton />} />

      <section className="pt-32 pb-16 bg-gray-50">
        <div className="bella-container">
          <div className="text-center mb-16 reveal opacity-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">منتجاتنا</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تسوق منتجات بيلا مصر المتخصصة في مكافحة الآفات والحشرات بتركيبات
              فعالة وآمنة
            </p>
          </div>

          {featuredProduct && (
            <div className="mb-16 reveal opacity-0">
              <div className="glass-card p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-bella/20 rounded-full blur-3xl opacity-50"></div>
                      <img
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        className="relative z-10 max-w-[240px] md:max-w-xs lg:max-w-sm"
                        onError={(e) =>
                          (e.currentTarget.src = "/placeholder.png")
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="inline-block bella-gradient px-3 py-1 rounded-full text-sm">
                        <span className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          <span>منتج مميز</span>
                        </span>
                      </div>
                      <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <span className="flex items-center gap-1">
                          <SprayCan className="h-4 w-4" />
                          <span>بدون رائحة</span>
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-3">
                      {featuredProduct.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">
                      {featuredProduct.shortDescription}
                    </p>
                    <div className="price-section mb-6">
                      {featuredProduct.onSale && featuredProduct.salePrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-bella">
                            {featuredProduct.salePrice}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            {featuredProduct.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-gray-800">
                          {featuredProduct.price}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/products/${featuredProduct.id}`}
                      className="bella-button inline-block"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products // No need for Array.isArray check if hook guarantees Product[] or undefined
              .filter((p) => !p.featured) // Ensure p is not undefined if products can be Product[] | undefined
              .map((product, index) => (
                <div
                  key={product.id}
                  className="reveal glass-card overflow-hidden hover:shadow-xl transition-all duration-300 opacity-0 flex flex-col"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-square bg-white flex items-center justify-center p-4 md:p-6 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.png")
                      }
                    />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-grow">
                    <div className="mb-3">
                      <div className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        <span className="flex items-center gap-1">
                          <SprayCan className="h-3 w-3" />
                          <span>بدون رائحة</span>
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 flex-grow">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
                      {product.onSale && product.salePrice ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-md font-bold text-bella">
                            {product.salePrice}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-md font-bold text-gray-800">
                          {product.price}
                        </span>
                      )}
                      <Link
                        to={`/products/${product.id}`}
                        className="bg-bella hover:bg-bella-dark text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                      >
                        التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* This specific check might be redundant if the one above covers it */}
          {/* {!isLoading && !error && products && products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">
                لا توجد منتجات متاحة حاليا.
              </p>
            </div>
          )} */}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Store;
