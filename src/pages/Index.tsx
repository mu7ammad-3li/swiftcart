// src/pages/Index.tsx
import React, { useEffect } from "react"; // useEffect for window.scrollTo is still fine
import Navbar from "../components/Navbar"; // Assuming correct path
import Hero from "../components/Hero"; // Assuming correct path
import Features from "../components/Features"; // Assuming correct path
import ProductShowcase from "../components/ProductShowcase"; // Assuming correct path
import Services from "../components/Services"; // Assuming correct path
import Footer from "../components/Footer"; // Assuming correct path
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import TestimonialsSection from "@/components/TestimonialsSection";
import OfferHighlightBanner from "@/components/OfferHighlightBanner";

const Index: React.FC = () => {
  useRevealOnScroll(".reveal", 0.1); // Or useRevealOnScroll(".reveal", 0.1, true);

  // Effect to scroll to top on component mount (if this is desired behavior for this page)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Note: The Intersection Observer for '.reveal' animations is now handled globally
  // by the useRevealOnScroll() hook called in App.tsx.
  // No need for a separate observer here.

  return (
    <div className="min-h-screen bg-white">
      {/* Ensure NavbarCartButton is passed if Navbar expects it, or adjust Navbar component */}
      <Navbar />
      <Hero />
      <Features />
      <ProductShowcase />
      <OfferHighlightBanner />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
