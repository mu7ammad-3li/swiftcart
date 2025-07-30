// src/components/landing/InstructionsSection.tsx
import React from 'react';
import { ListChecks } from 'lucide-react'; // Default icon from BedGuardLanding

export interface InstructionItem {
  title?: string; // Optional title for the instruction, e.g., "التحضير الأمثل:"
  detail: string; // The main instruction text
}

export interface InstructionsSectionProps {
  id: string; // For navigation and analytics
  title: string;
  instructions: InstructionItem[];
  instructionIcon?: React.ReactNode; // Icon for each instruction item
  // Styling props
  backgroundColorClass?: string; // e.g., 'bg-white'
  instructionItemBgGradientFrom?: string; // e.g., 'from-gray-50'
  instructionItemBgGradientVia?: string; // e.g., 'via-white'
  instructionItemBgGradientTo?: string; // e.g., 'to-gray-50'
  instructionItemBorderClass?: string; // e.g., 'border-gray-200'
  iconWrapperBgClass?: string; // e.g., 'bg-bella/10'
  iconColorClass?: string; // e.g., 'text-bella'
  dataSectionName?: string; // For analytics tracking
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  id,
  title,
  instructions,
  instructionIcon = <ListChecks className="h-6 w-6" />, // Default icon
  backgroundColorClass = 'bg-white',
  instructionItemBgGradientFrom = 'from-gray-50',
  instructionItemBgGradientVia = 'via-white',
  instructionItemBgGradientTo = 'to-gray-50',
  instructionItemBorderClass = 'border-gray-200',
  iconWrapperBgClass = 'bg-bella/10', // Default from BedGuard
  iconColorClass = 'text-bella',       // Default from BedGuard
  dataSectionName = "Usage Instructions Section"
}) => {
  return (
    <div 
      id={id} 
      className={`py-16 md:py-20 ${backgroundColorClass} track-section-view`}
      data-section-name={dataSectionName}
    >
      <div className="bella-container max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          {title}
        </h2>
        <div className="space-y-6">
          {instructions.map((instruction, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${instructionItemBgGradientFrom} ${instructionItemBgGradientVia} ${instructionItemBgGradientTo} p-6 rounded-xl border ${instructionItemBorderClass} hover:shadow-lg transition-all duration-300 flex items-start gap-4 transform hover:scale-[1.02]`}
            >
              <div className={`flex-shrink-0 ${iconWrapperBgClass} ${iconColorClass} p-3 rounded-full shadow-sm`}>
                {React.cloneElement(instructionIcon as React.ReactElement, {
                  className: `h-6 w-6 ${(instructionIcon as React.ReactElement).props.className || ''}`, // Preserve existing classes
                })}
              </div>
              <div>
                {instruction.title && (
                  <h4 className="font-semibold mb-2 text-lg text-gray-800">
                    {instruction.title}
                  </h4>
                )}
                <p className="text-gray-700 leading-relaxed">{instruction.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructionsSection;