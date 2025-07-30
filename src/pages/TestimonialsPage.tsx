// src/pages/TestimonialsPage.tsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarCartButton from "@/components/NavbarCartButton";
import TestimonialCard from "@/components/TestimonialCard";
import { Testimonial, exampleTestimonials } from "@/data/testimonials"; // Using example data
// import { getTestimonials } from "@/services/testimonialService"; // Uncomment for Firestore
import Spinner from "@/components/ui/Spinner";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { MessageSquareQuote } from "lucide-react";

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reveal animation
  useRevealOnScroll(".testimonial-reveal-page", 0.05, !isLoading);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadTestimonials = async () => {
      setIsLoading(true);
      try {
        // const fetchedTestimonials = await getTestimonials(); // Fetch from Firestore
        // For now, using example data:
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading
        setTestimonials(exampleTestimonials); // Display all
        setError(null);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
        setError("لا يمكن تحميل آراء العملاء حالياً.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartButton={<NavbarCartButton />} />

      {/* Page Header */}
      <div className="bg-gray-50 text-bella pt-36 pb-16">
        <div className="bella-container text-center">
          <MessageSquareQuote className="h-16 w-16 text-bella mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">آراء عملائنا</h1>
          <p className="text-lg md:text-xl text-gray-700 opacity-90 max-w-3xl mx-auto">
            نعتز بثقتكم ونسعد بمشاركتكم تجاربكم مع منتجات وخدمات بيلا إيجيبت.
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <section className="py-12 md:py-20">
        <div className="bella-container">
          {isLoading ? (
            <div className="text-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="testimonial-reveal-page opacity-0"
                  style={{ animationDelay: `${index * 0.05}s` }} // Stagger animation
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-xl">
              لا توجد آراء متاحة حالياً.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;
