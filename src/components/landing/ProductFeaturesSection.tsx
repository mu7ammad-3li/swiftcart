// src/components/landing/ProductFeaturesSection.tsx
import React from 'react';

export interface FeatureItem {
  icon: React.ReactElement; // Expecting a ReactElement like a Lucide icon
  title: string;
  description: string;
}

export interface ProductFeaturesSectionProps {
  id: string; // For navigation and analytics
  title: string;
  features: FeatureItem[];
  // Styling props to match BedGuardLanding's "Enhanced Features Section"
  sectionBgClass?: string; // e.g., 'bg-gray-50'
  contentWrapperBgClass?: string; // e.g., 'bg-gradient-to-b from-orange-50 to-orange-100'
  featureCardBgClass?: string; // e.g., 'bg-white'
  iconWrapperBgClass?: string; // e.g., 'bg-bella/10'
  iconWrapperTextClass?: string; // e.g., 'text-bella'
  dataSectionName?: string; // For analytics tracking
}

const ProductFeaturesSection: React.FC<ProductFeaturesSectionProps> = ({
  id,
  title,
  features,
  sectionBgClass = 'bg-gray-50',
  contentWrapperBgClass = 'bg-gradient-to-b from-orange-50 to-orange-100',
  featureCardBgClass = 'bg-white',
  iconWrapperBgClass = 'bg-bella/10',
  iconWrapperTextClass = 'text-bella',
  dataSectionName = "Product Features Section"
}) => {
  return (
    <div 
      id={id} 
      className={`py-16 md:py-20 ${sectionBgClass} track-section-view`}
      data-section-name={dataSectionName}
    >
      <div className={`bella-container ${contentWrapperBgClass} p-6 md:p-10 rounded-xl shadow-inner`}>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${featureCardBgClass} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className={`mb-5 ${iconWrapperBgClass} ${iconWrapperTextClass} p-4 rounded-full w-fit mx-auto shadow-sm`}>
                {/* Ensure the icon passed can accept className or is already styled */}
                {React.cloneElement(feature.icon, {
                  className: `h-7 w-7 ${feature.icon.props.className || ''}`, // Preserve existing classes on icon if any
                })}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFeaturesSection;