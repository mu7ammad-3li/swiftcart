// src/components/landing/SolutionStrategySection.tsx
import React from 'react';

export interface SolutionStrategySectionProps {
  id: string; // For navigation and analytics
  title: string;
  icon?: React.ReactNode; // Optional: an icon like <Target />
  descriptionLines: string[]; // Each string can be a paragraph
  highlightedText?: string; // For text like "السر في التكرار..."
  concludingText?: string; // For the final paragraph
  // Styling props
  backgroundColorClass?: string; // e.g., 'bg-gray-50'
  iconWrapperClass?: string; // e.g., 'bg-bella/10 text-bella'
  highlightedTextColorClass?: string; // e.g., 'text-bella-dark'
  dataSectionName?: string; // For analytics tracking
}

const SolutionStrategySection: React.FC<SolutionStrategySectionProps> = ({
  id,
  title,
  icon,
  descriptionLines,
  highlightedText,
  concludingText,
  backgroundColorClass = 'bg-gray-50',
  iconWrapperClass = 'bg-bella/10 text-bella',
  highlightedTextColorClass = 'text-bella-dark',
  dataSectionName = "Solution Strategy Section"
}) => {
  return (
    <div 
      id={id} 
      className={`py-16 md:py-20 ${backgroundColorClass} track-section-view`}
      data-section-name={dataSectionName}
    >
      <div className="bella-container text-center">
        {icon && (
          <div className={`mb-5 ${iconWrapperClass} p-4 rounded-full w-fit mx-auto shadow-sm`}>
            {/* Ensure the icon passed can accept className or is already styled */}
            {React.cloneElement(icon as React.ReactElement, {
              className: `h-10 w-10 ${(icon as React.ReactElement).props.className || ''}`, // Preserve existing classes
            })}
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          {title}
        </h2>
        {descriptionLines.map((line, index) => (
          <p key={index} className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-4">
            {line}
          </p>
        ))}
        {highlightedText && (
          <p className={`text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto font-semibold ${highlightedTextColorClass} mb-4`}>
            {highlightedText}
          </p>
        )}
        {concludingText && (
           <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mt-4">
            {concludingText}
          </p>
        )}
      </div>
    </div>
  );
};

export default SolutionStrategySection;