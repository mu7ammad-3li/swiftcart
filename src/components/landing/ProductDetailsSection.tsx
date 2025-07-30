// src/components/landing/ProductDetailsSection.tsx
import React from 'react';

export interface ProductDetailsSectionProps {
  id: string; // For navigation and analytics
  title: string;
  longDescription: string;
  showFullDescription: boolean;
  onToggleShowMore: () => void;
  // Styling props
  backgroundColorClass?: string; // e.g., 'bg-white'
  contentBackgroundColorClass?: string; // e.g., 'bg-gray-50'
  borderColorClass?: string; // e.g., 'border-gray-200'
  showMoreButtonTextColorClass?: string; // e.g., 'text-bella'
  showMoreButtonHoverTextColorClass?: string; // e.g., 'hover:text-bella-dark'
  maxHeightClassCollapsed?: string; // e.g., 'max-h-40 line-clamp-5' from BedGuard
  maxHeightClassExpanded?: string; // e.g., 'max-h-[2000px]' from BedGuard
  dataSectionName?: string; // For analytics tracking
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  id,
  title,
  longDescription,
  showFullDescription,
  onToggleShowMore,
  backgroundColorClass = 'bg-white',
  contentBackgroundColorClass = 'bg-gray-50',
  borderColorClass = 'border-gray-200',
  showMoreButtonTextColorClass = 'text-bella',
  showMoreButtonHoverTextColorClass = 'hover:text-bella-dark',
  maxHeightClassCollapsed = 'max-h-40 line-clamp-5', // Default from BedGuard
  maxHeightClassExpanded = 'max-h-[2000px]', // Default from BedGuard
  dataSectionName = "Product Details Section"
}) => {
  return (
    <div 
      id={id} 
      className={`py-16 md:py-20 ${backgroundColorClass} track-section-view`}
      data-section-name={dataSectionName}
    >
      <div className="bella-container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
          {title}
        </h2>
        <div className={`relative ${contentBackgroundColorClass} p-6 md:p-8 rounded-xl shadow-lg border ${borderColorClass}`}>
          <div
            className={`text-lg text-gray-700 leading-relaxed transition-all duration-500 ease-in-out overflow-hidden ${
              showFullDescription ? maxHeightClassExpanded : maxHeightClassCollapsed
            }`}
            // If longDescription contains HTML, use dangerouslySetInnerHTML. Otherwise, render directly.
            // For safety, assuming plain text rendering unless HTML is explicitly intended and sanitized.
          >
            {/* For simple text: */}
            {/* {longDescription.split('\n').map((paragraph, index) => <p key={index} className="mb-4 last:mb-0">{paragraph}</p>)} */}
            {/* If you expect HTML or want to preserve exact formatting from a string with <p> tags etc. you might need dangerouslySetInnerHTML,
                but ensure the source is trusted or sanitized. The original BedGuardLanding used direct rendering of a template literal.
                For more robust paragraph handling if 'longDescription' is plain text with newlines:
            */}
            {longDescription.split('\n\n').map((paragraph, index, arr) => (
              <p key={index} className={index === arr.length - 1 ? '' : 'mb-4'}>
                {paragraph.split('\n').map((line, lineIndex) => <React.Fragment key={lineIndex}>{line}{lineIndex !== paragraph.split('\n').length - 1 && <br />}</React.Fragment>)}
              </p>
            ))}
          </div>
          <button
            onClick={onToggleShowMore}
            className={`mt-4 ${showMoreButtonTextColorClass} ${showMoreButtonHoverTextColorClass} font-semibold transition-colors mx-auto block`}
          >
            {showFullDescription ? "عرض أقل" : "عرض المزيد من التفاصيل"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;