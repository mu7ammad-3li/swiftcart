// src/App.tsx
import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Spinner from "@/components/ui/Spinner";
import { CartProvider } from "./contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import RouteChangeTracker from "./components/Analytics/RouteChangeTracker";
import AnalyticsService from "./services/analyticsService";
import TestimonialsPage from "./pages/TestimonialsPage";
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import GlobalFloatingButtons from "./components/landing/GlobalFloatingButtons";
// Import the PrimaryFabProvider and usePrimaryFab hook
import { PrimaryFabProvider, usePrimaryFab } from "./contexts/PrimaryFabContext";

const queryClient = new QueryClient();

// Lazy load pages (existing code)
const IndexPage = React.lazy(() => import("./pages/Index"));
const StorePage = React.lazy(() => import("./pages/Store"));
const ProductDetailPage = React.lazy(() => import("./pages/ProductDetail"));
const CheckoutPage = React.lazy(() => import("./pages/Checkout"));
const ThankYouPage = React.lazy(() => import("./pages/ThankYou"));
const BlogListPage = React.lazy(() => import("./pages/Blog"));
const IndividualBlogPage = React.lazy(() => import("./pages/BlogPost"));
const AboutPage = React.lazy(() => import("./pages/About"));
const ContactPage = React.lazy(() => import("./pages/Contact"));
// Corrected lazy import for ProductLandingPage
const ProductLandingPage = React.lazy(() => import("./pages/ProductLandingPage"));
const BedGuardLandingPage = React.lazy(() => import("./pages/BedGuardLanding"));
const MultiGuardLandingPage = React.lazy(() => import("./pages/MultiGuardLanding"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));


const PageLoader: React.FC = () => (
  <div className="min-h-screen w-full flex justify-center items-center bg-background">
    <Spinner />
  </div>
);

// AppContent component to use the context hook
const AppContent: React.FC = () => {
  const { primaryButtonProps } = usePrimaryFab(); // Get props from context

  return (
    <>
      <ScrollToTop />
      <RouteChangeTracker />
      
      <GlobalFloatingButtons
        whatsappNumber="201148481374" // Replace
        messengerLink="https://m.me/Bella1Egypt"   // Replace
        primaryButton={primaryButtonProps} // Use props from context
      />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/products" element={<StorePage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          {/* Example route for a product landing page that uses ProductLandingPage.tsx */}
          {/* You would have specific routes like /products/your-product-slug */}
          {/* For demonstration, assuming a generic route, replace with your actual routing logic */}
          {/* <Route path="/landing/:productSlug" element={<ProductLandingPage config={...} />} /> */}
          <Route path="/bedguard" element={<BedGuardLandingPage />} />
          <Route path="/multiguard" element={<MultiGuardLandingPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<IndividualBlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/return-policy" element={<ReturnPolicyPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

const App: React.FC = () => {
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        console.log("APP.TSX: ATTEMPTING META PIXEL INITIALIZATION VIA ANALYTICS SERVICE"); 
        await AnalyticsService.initializeMetaPixel(import.meta.env.VITE_META_PIXEL_ID);
        await AnalyticsService.initializeTikTokPixel(import.meta.env.VITE_TIKTOK_PIXEL_ID);
        console.log("[App] Analytics services initialized successfully");
      } catch (error) {
        console.error("[App] Error initializing analytics services:", error);
      }
    };
    initializeAnalytics();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <PrimaryFabProvider> {/* Wrap with the context provider */}
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent /> {/* Render AppContent which uses the context */}
            </BrowserRouter>
          </PrimaryFabProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;