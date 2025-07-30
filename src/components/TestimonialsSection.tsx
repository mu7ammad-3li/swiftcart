// src/components/TestimonialsSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { Star, ThumbsUp, MessageCircle,ChevronLeft, ChevronRight } from "lucide-react";
import { Testimonial, getTestimonials, TestimonialProductCategory } from "@/data/testimonials"; // Import new type
import TestimonialCard from "./TestimonialCard"; // Assuming TestimonialCard is ready
import AnalyticsService from "@/services/analyticsService"; // For tracking section view

interface TestimonialsSectionProps {
  id?: string; // Optional ID for the section
  title?: string;
  subtitle?: string;
  maxTestimonials?: number; // Max testimonials to show on a landing page section
  category?: TestimonialProductCategory; // **** NEW PROP ****
  showAllLink?: boolean; // To show a link to the main testimonials page
  allLinkHref?: string;
  allLinkText?: string;
  backgroundColorClass?: string;
  dataSectionName?: string; // For analytics
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  id = "testimonials-section",
  title = "عملائنا بيقولوا عننا إيه؟",
  subtitle = "شهادات حقيقية من عملاء جربوا منتجاتنا وخدماتنا وكانوا راضيين تمامًا.",
  maxTestimonials, // If not provided, will show all (or as per carousel logic)
  category = "All", // Default to "All"
  showAllLink = false,
  allLinkHref = "/testimonials",
  allLinkText = "شاهد كل الشهادات",
  backgroundColorClass = "bg-gray-100 dark:bg-gray-800",
  dataSectionName = "Testimonials Section"
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null); // For tracking section view

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        // Pass category and maxTestimonials (as limit) to getTestimonials
        const fetchedTestimonials = await getTestimonials(category, maxTestimonials);
        setTestimonials(fetchedTestimonials);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Optionally set an error state here
      }
      setIsLoading(false);
    };

    fetchTestimonials();
  }, [category, maxTestimonials]); // Re-fetch if category or maxTestimonials changes

  // Section view tracking
  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          AnalyticsService.trackSectionView(
            dataSectionName,
            id,
            window.location.pathname
          );
          observer.unobserve(currentRef); // Track only once
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [id, dataSectionName]);


  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (isLoading) {
    return (
      <div ref={sectionRef} id={id} className={`py-12 md:py-20 ${backgroundColorClass} track-section-view`} data-section-name={dataSectionName}>
        <div className="bella-container text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">جار تحميل الشهادات...</p>
        </div>
      </div>
    );
  }

  if (!testimonials.length) {
    return (
      <div ref={sectionRef} id={id} className={`py-12 md:py-20 ${backgroundColorClass} track-section-view`} data-section-name={dataSectionName}>
        <div className="bella-container text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            لا توجد شهادات متاحة حاليًا لهذه الفئة.
          </p>
        </div>
      </div>
    );
  }
  
  // Determine how many cards to show at once based on screen size for carousel effect
  // This is a simplified carousel logic. For a real app, consider a library like Swiper.js or Embla Carousel.
  const itemsToShow = 1; // Simple: show one at a time. Can be made responsive.

  return (
    <section ref={sectionRef} id={id} aria-labelledby="testimonial-heading" className={`py-12 md:py-20 ${backgroundColorClass} track-section-view`} data-section-name={dataSectionName}>
      <div className="bella-container">
        <div className="mx-auto max-w-2xl text-center">
          <ThumbsUp className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h2
            id="testimonial-heading"
            className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>
        
        <div className="relative mx-auto mt-16 flow-root max-w-5xl">
          {testimonials.length > itemsToShow && (
             <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/50 p-2 text-gray-700 shadow-md hover:bg-white dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Previous testimonial"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="overflow-hidden"> {/* This div would be the container for a carousel library */}
            <div 
                className="flex transition-transform duration-500 ease-in-out"
                // style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }} // Basic sliding effect
            >
              {/* Displaying one testimonial at a time for simplicity with current logic */}
              {/* Replace with proper carousel component if multiple items are to be shown and animated */}
              <div className="w-full flex-shrink-0 px-4"> {/* Added px-4 for spacing if one item shown */}
                 <TestimonialCard testimonial={testimonials[currentIndex]} />
              </div>
              {/* // If you want to map all and control via transform (needs more robust styling for itemsToShow > 1)
                testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className={`w-full md:w-1/${itemsToShow} flex-shrink-0 p-2`}>
                      <TestimonialCard testimonial={testimonial} />
                  </div>
              ))*/}
            </div>
          </div>
          {testimonials.length > itemsToShow && (
            <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/50 p-2 text-gray-700 shadow-md hover:bg-white dark:bg-gray-700/50 dark:text-gray-200 dark:hover:bg-gray-700"
                aria-label="Next testimonial"
            >
                <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {testimonials.length > 1 && ( // Dots for navigation
            <div className="mt-8 flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-bella' : 'bg-gray-300 dark:bg-gray-600'} hover:bg-bella-light`}
                    aria-label={`Go to testimonial ${index + 1}`}
                />
                ))}
            </div>
        )}

        {showAllLink && (
          <div className="mt-12 text-center">
            <a
              href={allLinkHref}
              className="text-lg font-semibold leading-6 text-bella hover:text-bella-dark dark:hover:text-bella-light"
            >
              {allLinkText} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;