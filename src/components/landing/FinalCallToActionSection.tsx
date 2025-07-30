// src/components/landing/FinalCallToActionSection.tsx
import React from 'react';
import AnalyticsService from '@/services/analyticsService'; // Assuming this service is available

export interface FinalCallToActionSectionProps {
  id: string; // For navigation and analytics
  title: string;
  description: string;
  primaryActionText: string;
  primaryActionIcon?: React.ReactNode;
  onPrimaryActionClick: () => void;
  secondaryActionText?: string;
  onSecondaryActionClick?: () => void;
  // Styling props
  backgroundColorClass?: string; // e.g., 'bg-gradient-to-br from-bella/5 via-orange-50 to-bella/10'
  titleColorClass?: string; // e.g., 'text-bella-dark'
  descriptionColorClass?: string; // e.g., 'text-gray-700'
  primaryButtonClass?: string; // e.g., 'bella-button text-lg ...'
  secondaryButtonClass?: string; // e.g., 'text-bella hover:underline font-semibold'
  dataSectionName?: string; // For analytics tracking
  // Analytics specific props for more granular tracking if needed
  analyticsPrimaryActionName?: string;
  analyticsSecondaryActionName?: string;
  analyticsItemId?: string; // ID of the item being promoted (e.g., double offer ID or product ID)
}

const FinalCallToActionSection: React.FC<FinalCallToActionSectionProps> = ({
  id,
  title,
  description,
  primaryActionText,
  primaryActionIcon,
  onPrimaryActionClick,
  secondaryActionText,
  onSecondaryActionClick,
  backgroundColorClass = 'bg-gradient-to-br from-bella/5 via-orange-50 to-bella/10', // Default from BedGuard
  titleColorClass = 'text-bella-dark', // Default from BedGuard
  descriptionColorClass = 'text-gray-700',
  primaryButtonClass = 'bella-button text-lg flex items-center justify-center gap-3 mx-auto transform hover:-translate-y-1.5 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl px-10 py-4', // Default from BedGuard
  secondaryButtonClass = 'text-bella hover:underline font-semibold', // Default from BedGuard
  dataSectionName = "Final CTA Section",
  analyticsPrimaryActionName,
  analyticsSecondaryActionName,
  analyticsItemId
}) => {
  
  const handlePrimaryClick = () => {
    if (analyticsPrimaryActionName) {
        AnalyticsService.trackButtonClick(
            analyticsPrimaryActionName,
            dataSectionName,
            analyticsItemId
        );
    }
    onPrimaryActionClick();
  };

  const handleSecondaryClick = () => {
    if (analyticsSecondaryActionName && onSecondaryActionClick) {
        AnalyticsService.trackButtonClick(
            analyticsSecondaryActionName,
            dataSectionName,
            analyticsItemId // Or a different ID if secondary action refers to something else
        );
        onSecondaryActionClick();
    } else if (onSecondaryActionClick) {
        onSecondaryActionClick();
    }
  };

  return (
    <div
      id={id}
      className={`text-center py-16 md:py-20 ${backgroundColorClass} track-section-view`}
      data-section-name={dataSectionName}
    >
      <div className="bella-container">
        <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${titleColorClass}`}>
          {title}
        </h3>
        <p className={`${descriptionColorClass} mb-8 text-lg max-w-2xl mx-auto`}>
          {description}
        </p>
        <button
          onClick={handlePrimaryClick}
          className={primaryButtonClass}
        >
          {primaryActionIcon && React.cloneElement(primaryActionIcon as React.ReactElement, { className: `h-6 w-6 ${(primaryActionIcon as React.ReactElement).props.className || ''}` })}
          <span>{primaryActionText}</span>
        </button>
        {secondaryActionText && onSecondaryActionClick && (
          <p className="mt-6 text-gray-600">
            {/* This structure assumes the secondary action is a button styled as a link */}
            أو <button onClick={handleSecondaryClick} className={secondaryButtonClass}>{secondaryActionText}</button>
          </p>
        )}
         {secondaryActionText && !onSecondaryActionClick && ( // Case for informational secondary text (like in MultiGuard)
          <p className={`mt-3 text-sm ${descriptionColorClass === 'text-gray-700' ? 'text-gray-500': descriptionColorClass}`}>
            {secondaryActionText}
          </p>
        )}
      </div>
    </div>
  );
};

export default FinalCallToActionSection;