// src/components/landing/AlternativeProductsSection.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming usage of React Router for links
import AnalyticsService from '@/services/analyticsService'; // Assuming this service is available

interface AlternativeProduct {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt?: string;
  description: string;
  ctaText: string;
  storeLink: string;
  ctaIcon?: React.ReactNode;
  isFeatured?: boolean; // To highlight a specific alternative, like the triple pack in BedGuard
  specialOfferBadgeText?: string; // e.g., "عرض خاص!"
  analyticsButtonName: string; // For tracking, e.g. `Shop Ready-to-Use Single - ${id}`
  analyticsSectionName: string; // For tracking, e.g. 'Ready-To-Use Alternatives Section'
}

export interface AlternativeProductsSectionProps {
  id: string; // For navigation and analytics
  title: string;
  description?: string; // Main description for the section
  products: AlternativeProduct[];
  footerNote?: string; // e.g., "يرجى ملاحظة: المنتج المركز يبقى الخيار الأكثر توفيراً..."
  backgroundColorClass?: string; // e.g., 'bg-blue-50'
  featuredBorderClass?: string; // e.g., 'border-2 border-bella-accent'
  defaultButtonClass?: string; // e.g. 'bella-button-secondary'
  featuredButtonClass?: string; // e.g. 'bella-button'
  dataSectionName?: string; // For analytics tracking
}

const AlternativeProductsSection: React.FC<AlternativeProductsSectionProps> = ({
  id,
  title,
  description,
  products,
  footerNote,
  backgroundColorClass = 'bg-blue-50', // Default from BedGuard
  featuredBorderClass = 'border-2 border-bella-accent', // Default from BedGuard
  defaultButtonClass = 'block w-full bella-button-secondary text-center text-base px-6 py-3',
  featuredButtonClass = 'block w-full bella-button text-center text-base px-6 py-3',
  dataSectionName = "Alternative Products Section"
}) => {
  if (!products || products.length === 0) {
    return null; // Don't render if there are no alternative products
  }

  return (
    <div 
      id={id} 
      className={`py-16 md:py-20 ${backgroundColorClass} track-section-view`}
      data-section-name={dataSectionName}
    >
      <div className="bella-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          {title}
        </h2>
        {description && (
          <p className="text-center text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            {description}
          </p>
        )}
        <div className={`grid grid-cols-1 ${products.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-10 items-stretch`}>
          {products.map((product) => (
            <div 
              key={product.id}
              className={`bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ${product.isFeatured ? featuredBorderClass : ''}`}
            >
              <div className="relative"> {/* Added relative for badge positioning */}
                {product.isFeatured && product.specialOfferBadgeText && (
                    <div className="absolute top-0 right-0 bg-bella-accent text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-md animate-pulse">
                        {product.specialOfferBadgeText}
                    </div>
                )}
                <img 
                  src={product.imageSrc} 
                  alt={product.imageAlt || product.name} 
                  className="w-full max-w-[200px] h-auto mx-auto mb-6 rounded mix-blend-multiply" // Max width from BedGuard for single
                />
                <h3 className="text-xl lg:text-2xl font-semibold mb-3 text-center text-gray-700">{product.name}</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
                  {product.description}
                </p>
              </div>
              <Link
                to={product.storeLink}
                onClick={() => AnalyticsService.trackButtonClick(
                  product.analyticsButtonName, 
                  product.analyticsSectionName,
                  product.id,
                  product.storeLink
                )}
                className={product.isFeatured ? featuredButtonClass : defaultButtonClass}
              >
                {product.ctaIcon && React.cloneElement(product.ctaIcon as React.ReactElement, { className: `inline-block ml-2 h-5 w-5 ${(product.ctaIcon as React.ReactElement).props.className || ''}`})}
                {product.ctaText}
              </Link>
            </div>
          ))}
        </div>
        {footerNote && (
          <p className="text-center text-gray-600 mt-12 text-sm">
            <strong>يرجى ملاحظة:</strong> {footerNote}
          </p>
        )}
      </div>
    </div>
  );
};

export default AlternativeProductsSection;