// src/components/landing/MainOfferSection.tsx
import React from 'react';
import { ShoppingCart, CheckCircle } from 'lucide-react'; // CheckCircle for benefits list

export interface MainOfferSectionProps {
  id: string; // For navigation and analytics
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  offerName: string;
  offerTagline: string;
  offerDescription: string;
  offerPrice: string;
  originalPrice?: string;
  savingsText?: string;
  benefits?: string[]; // Optional list of benefits like "يشمل عبوتين..."
  imageSrc: string;
  imageAlt: string;
  ctaText: string;
  onCtaClick: () => void;
  secondaryActionText?: string; // For "Or buy single unit"
  onSecondaryActionClick?: () => void;
  // Styling props
  gradientFromClass: string;
  gradientViaClass?: string;
  gradientToClass: string;
  badgeBgClass?: string; // e.g., 'bg-yellow-300'
  badgeTextClass?: string; // e.g., 'text-bella-dark'
  primaryButtonBgClass?: string; // e.g., 'bg-white' for BedGuard offer button
  primaryButtonTextClass?: string; // e.g., 'text-bella-dark'
  secondaryActionButtonClass?: string; // e.g. 'text-white hover:text-yellow-300'
  patternImageUrl?: string; // For the subtle background pattern
  dataSectionName?: string; // For analytics tracking
}

const MainOfferSection: React.FC<MainOfferSectionProps> = ({
  id,
  badgeText,
  badgeIcon,
  offerName,
  offerTagline,
  offerDescription,
  offerPrice,
  originalPrice,
  savingsText,
  benefits,
  imageSrc,
  imageAlt,
  ctaText,
  onCtaClick,
  secondaryActionText,
  onSecondaryActionClick,
  gradientFromClass,
  gradientViaClass,
  gradientToClass,
  badgeBgClass = 'bg-yellow-300',
  badgeTextClass = 'text-bella-dark',
  primaryButtonBgClass = 'bg-white',
  primaryButtonTextClass = 'text-bella-dark',
  secondaryActionButtonClass = 'text-white hover:text-yellow-300 font-semibold transition-colors underline',
  patternImageUrl = "/imgs/patterns/pest-pattern-white.svg", // Default pattern from BedGuard
  dataSectionName = "Main Offer Section"
}) => {
  return (
    <div
      id={id}
      className={`py-16 md:py-20 bg-gradient-to-br ${gradientFromClass} ${gradientViaClass || ''} ${gradientToClass} text-white overflow-hidden relative track-section-view`}
      data-section-name={dataSectionName}
    >
      {patternImageUrl && (
        <div
          className="absolute inset-0 opacity-[0.07] bg-repeat"
          style={{ backgroundImage: `url(${patternImageUrl})` }}
        ></div>
      )}
      <div className="bella-container grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 md:order-1 text-center md:text-right">
          {badgeText && (
            <div className={`inline-block ${badgeBgClass} ${badgeTextClass} px-4 py-1.5 rounded-full mb-5 text-sm font-bold animate-pulse shadow-lg`}>
              {badgeIcon && React.cloneElement(badgeIcon as React.ReactElement, { className: `inline-block mr-2 h-5 w-5 ${(badgeIcon as React.ReactElement).props.className || ''}`})}
              {badgeText}
            </div>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
            {offerName}
          </h2>
          <p className="text-xl md:text-2xl font-semibold leading-relaxed mb-2 drop-shadow-sm">
            {offerTagline}
          </p>
          <p className="text-lg mb-6 drop-shadow-sm">
            {offerDescription}
          </p>
          <div className="bg-black/25 backdrop-blur-sm rounded-lg p-6 mb-8 text-center md:text-right">
            <p className="text-2xl md:text-3xl font-bold text-yellow-300 mb-2">{offerPrice}</p>
            {originalPrice && (
              <p className="text-lg line-through text-gray-300 mb-1">بدلاً من {originalPrice}</p>
            )}
            {savingsText && (
              <p className="text-md font-semibold text-white">وفر {savingsText}!</p>
            )}
            {benefits && benefits.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center justify-center md:justify-start">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            )}
          </div>
          <button
            onClick={onCtaClick}
            className={`inline-block ${primaryButtonBgClass} ${primaryButtonTextClass} px-10 py-4 rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1.5 hover:scale-105 font-bold text-xl w-full sm:w-auto`}
          >
            <ShoppingCart className="inline-block ml-2 h-6 w-6" /> {/* Assuming ShoppingCart icon for CTA */}
            {ctaText}
          </button>
          {secondaryActionText && onSecondaryActionClick && (
            <div className="mt-8 text-center md:text-right">
              <p className="text-gray-200 mb-2">هل تحتاج شيئًا آخر؟</p> {/* Generic placeholder */}
              <button 
                onClick={onSecondaryActionClick}
                className={secondaryActionButtonClass}
              >
                {secondaryActionText}
              </button>
            </div>
          )}
        </div>
        <div className="order-1 md:order-2 flex justify-center items-center">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full max-w-[320px] md:max-w-sm lg:max-w-md transform transition-transform duration-500 hover:scale-110 drop-shadow-2xl rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MainOfferSection;