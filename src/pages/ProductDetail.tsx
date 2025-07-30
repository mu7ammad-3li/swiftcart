// src/pages/ProductDetail.tsx

import React, { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom"; // Added useLocation
import { ChevronRight } from "lucide-react";

// --- Component Imports ---
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarCartButton from "@/components/NavbarCartButton";
import ProductImageSection from "@/components/product/ProductImageSection";
import ProductInfo from "@/components/product/ProductInfo";
import ProductDetailsTab from "@/components/product/ProductDetailsTab";
import ProductNotFound from "@/components/product/ProductNotFound";
import Spinner from "@/components/ui/Spinner";

// --- Data Fetching & Analytics ---
import { useProductById } from "@/hooks/useProductById";
import AnalyticsService from "@/services/analyticsService";
import { Product } from "@/data/products"; // Import Product type

// Helper function to parse price (can be imported from analyticsService or defined here)
const parsePriceForSchema = (price: string | number | undefined | null): number => {
  if (price === null || price === undefined) return 0;
  const strPrice = String(price);
  const numericString = strPrice.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except dot
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation(); // Get current location for product URL

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProductById(productId);

  // --- Effect for Reveal Animation ---
  useEffect(() => {
    if (!isLoading && product) {
      const timer = setTimeout(() => {
        const elementsToReveal = document.querySelectorAll(".reveal");
        elementsToReveal.forEach((element) => {
          element.classList.add("active");
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, product]);

  // --- Effect for Analytics Tracking ---
  useEffect(() => {
    if (product) {
      AnalyticsService.trackViewContent(product);
    }
  }, [product]);

  // --- Effect for Schema.org Product Microdata ---
  useEffect(() => {
    if (product) {
      const productUrl = window.location.origin + location.pathname;
      // Replace 'https://www.bellaguard.net' with your actual domain or a config variable
      // Ensure product.image has a leading slash if it's a root-relative path, or adjust accordingly.
      const imageUrl =product.image ;

      const schemaOrgProduct = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name ,
        image: imageUrl,
        description: product.details.longDescription || product.shortDescription,
        sku: product.id,
        brand: {
          "@type": "Brand",
          name: "Bella Guard", // Or fetch dynamically if brand varies
        },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "EGP",
          price: parsePriceForSchema(
            product.onSale && product.salePrice ? product.salePrice : product.price
          ),
          availability: "In stock",
          itemCondition: "NewCondition",
        },
      };

      const existingScript = document.getElementById("schema-org-product");
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = "schema-org-product";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schemaOrgProduct, null, 2);
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.getElementById("schema-org-product");
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [product, location.pathname]);

  // --- Conditional Rendering ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar cartButton={<NavbarCartButton />} />
        <div className="flex-grow flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching product:", error);
    return <ProductNotFound />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartButton={<NavbarCartButton />} />
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="bella-container">
          <div className="mb-8">
            <Link
              to="/products"
              className="text-bella hover:text-bella-dark flex items-center gap-1 transition-colors w-fit text-sm"
            >
              <ChevronRight className="h-4 w-4" />
              <span>العودة للمتجر</span>
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-6 md:p-8">
              <ProductImageSection image={product.image} name={product.name} />
              <ProductInfo product={product} />
            </div>
            <ProductDetailsTab product={product} />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetail;