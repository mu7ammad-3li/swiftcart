// src/components/landing/ProblemStatementSection.tsx
import React from 'react';

interface ProblemItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export interface ProblemStatementSectionProps {
  id: string; // For navigation and analytics
  title: string;
  subtitle?: string;
  problems: ProblemItem[];
  conclusionText?: string; // Optional text at the end of the section
  backgroundColorClass?: string; // e.g., 'bg-amber-50'
  iconTextColorClass?: string; // e.g., 'text-red-500' for BedGuard
  dataSectionName?: string; // For analytics tracking
}

const ProblemStatementSection: React.FC<ProblemStatementSectionProps> = ({
  id,
  title,
  subtitle,
  problems,
  conclusionText,
  backgroundColorClass = 'bg-amber-50', // Default from BedGuard
  iconTextColorClass,
  dataSectionName = "Problem Statement Section"
}) => {
  return (
    <div 
      id={id} 
      className={`py-16 md:py-20 ${backgroundColorClass} track-section-view`}
      data-section-name={dataSectionName}
    >
      <div className="bella-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className={`flex justify-center mb-4 ${iconTextColorClass || ''}`}>
                {React.cloneElement(item.icon as React.ReactElement, { className: `h-8 w-8 ${iconTextColorClass || ''}` })}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-700">{item.title}</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        {conclusionText && (
            <p className="text-center text-md text-gray-700 mt-12 max-w-3xl mx-auto">
                {conclusionText}
            </p>
        )}
      </div>
    </div>
  );
};

export default ProblemStatementSection;