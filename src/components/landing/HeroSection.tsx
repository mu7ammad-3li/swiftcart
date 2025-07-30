// src/components/landing/HeroSection.tsx
import React from 'react';
import { Heart, Share2, Star, BugOff, Info, Sparkles } from 'lucide-react'; // Using icons from BedGuardLanding

export interface HeroSectionProps {
  productName?: string; // Optional, if you want a small badge for product name
  tagline: string;
  shortDescription: string;
  imageSrc: string;
  imageAlt: string;
  ctaPrimaryText: string;
  ctaPrimaryLink?: string;
  onCtaPrimaryClick: () => void;
  ctaSecondaryText: string;
  ctaSecondaryLink?: string;
  onCtaSecondaryClick: () => void;
  wishlistStatus: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
  productPrice?: string;
  originalPrice?: string;
  shippingCost?: number;
  priceDescription?: string; // e.g., "(العبوة تكفي لتحضير 5 لتر مبيد جاهز للرش)"
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  // Theme related props
  accentColorClass?: string; // e.g., 'text-bella', 'text-green-600'
  secondaryAccentColorClass?: string; // e.g., 'text-orange-400' (for gradient in BedGuard)
  bgColorClass?: string; // e.g., 'bg-bella/10', 'bg-green-500/10' for the product name badge
  heroBgGradientFrom?: string; // e.g., 'from-white'
  heroBgGradientVia?: string; // e.g., 'via-gray-50'
  heroBgGradientTo?: string; // e.g., 'to-bella/5'
  primaryCtaButtonClasses?: string; // For full button styling if needed, e.g., "bella-button"
  secondaryCtaButtonClasses?: string; // e.g., "bg-gray-700 hover:bg-gray-900 text-white"
  heroIcon?: React.ReactNode; // e.g. <BugOff />
}

const HeroSection: React.FC<HeroSectionProps> = ({
  productName,
  tagline,
  shortDescription,
  imageSrc,
  imageAlt,
  ctaPrimaryText,
  ctaPrimaryLink,
  onCtaPrimaryClick,
  ctaSecondaryText,
  ctaSecondaryLink,
  onCtaSecondaryClick,
  wishlistStatus,
  onToggleWishlist,
  onShare,
  productPrice,
  originalPrice,
  shippingCost,
  priceDescription,
  rating,
  reviewCount,
  inStock = true,
  accentColorClass = 'text-bella',
  secondaryAccentColorClass = 'text-orange-400',
  bgColorClass = 'bg-bella/10',
  heroBgGradientFrom = 'from-white',
  heroBgGradientVia = 'via-gray-50',
  heroBgGradientTo = 'to-bella/5',
  primaryCtaButtonClasses = 'bella-button',
  secondaryCtaButtonClasses = 'bg-gray-700 hover:bg-gray-900 text-white',
  heroIcon = <BugOff className="h-5 w-5" />
}) => {
  return (
    <div
      className={`relative min-h-screen flex items-center overflow-hidden pt-24 md:pt-20 bg-gradient-to-br ${heroBgGradientFrom} ${heroBgGradientVia} ${heroBgGradientTo}`}
    >
      {/* Decorative elements from BedGuardLanding.tsx */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${bgColorClass} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${accentColorClass}/10 rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <div className="bella-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 lg:order-1 text-center lg:text-right">
          {productName && (
            <div className={`inline-block ${bgColorClass} ${accentColorClass} px-4 py-2 rounded-full mb-4 animate-bounce`}>
              <span className="flex items-center gap-2">
                {heroIcon}
                <span>{productName}</span>
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-relaxed mb-6 animate-fade-in-up">
            {tagline}
            <br />
            <span className={`${accentColorClass} bg-gradient-to-r ${accentColorClass ? `from-${accentColorClass.replace('text-','')}` : ''} ${secondaryAccentColorClass ? `to-${secondaryAccentColorClass.replace('text-','')}`: ''} bg-clip-text text-transparent`}>
              {/* Sub-tagline or highlighted part, adapt as needed. For BedGuard, it was "الحل المركز والآمن لراحة بالك!" */}
              {/* This can be part of the main tagline or a separate prop if it varies a lot */}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 animate-fade-in-up animation-delay-200">
            {shortDescription}
          </p>

          {(productPrice || (rating && reviewCount)) && (
            <div className="mb-8 animate-fade-in-up animation-delay-400">
              {productPrice && (
                <>
                  <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-2">
                    <span className={`text-3xl font-bold ${accentColorClass}`}>
                      {productPrice}
                    </span>
                    {originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        {originalPrice}
                      </span>
                    )}
                    {shippingCost && (
                       <span className="text-sm text-gray-600">+ {shippingCost} جنيه للشحن</span>
                    )}
                  </div>
                  {priceDescription && (
                    <p className="text-sm text-gray-500 mb-6 justify-center lg:justify-start flex">
                      {priceDescription}
                    </p>
                  )}
                </>
              )}
              {rating && reviewCount && (
                 <div className="flex items-center justify-center lg:justify-start gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-5 w-5 ${
                        i < Math.floor(rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                    />
                    ))}
                    <span className="text-sm text-gray-600 mr-2">
                    {rating.toFixed(1)} ({reviewCount} تقييم)
                    </span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => {
                if (ctaPrimaryLink && ctaPrimaryLink.startsWith("#")) {
                  document.querySelector(ctaPrimaryLink)?.scrollIntoView({ behavior: 'smooth' });
                }
                onCtaPrimaryClick();
              }}
              className={`${primaryCtaButtonClasses} flex items-center justify-center gap-2 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-base px-8 py-3`}
            >
              <Sparkles className="h-5 w-5" /> {/* Default icon, can be prop */}
              <span>{ctaPrimaryText}</span>
            </button>
            <button
              onClick={() => {
                if (ctaSecondaryLink && ctaSecondaryLink.startsWith("#")) {
                  document.querySelector(ctaSecondaryLink)?.scrollIntoView({ behavior: 'smooth' });
                }
                onCtaSecondaryClick();
              }}
              className={`${secondaryCtaButtonClasses} px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2 text-base`}
            >
              <Info className="h-5 w-5" /> {/* Default icon, can be prop */}
              <span>{ctaSecondaryText}</span>
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-3 mt-6 text-sm">
            <button
              onClick={onToggleWishlist}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                wishlistStatus
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label={wishlistStatus ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <Heart
                className={`h-4 w-4 ${
                  wishlistStatus ? "fill-current" : ""
                }`}
              />
              <span>حفظ</span>
            </button>
            <button
              onClick={onShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="مشاركة المنتج"
            >
              <Share2 className="h-4 w-4" />
              <span>مشاركة</span>
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative group">
            <div className={`absolute inset-0 ${accentColorClass}/15 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
            <img
              src={imageSrc}
              alt={imageAlt}
              className="relative z-10 transform group-hover:scale-105 transition-transform duration-700 max-w-[280px] md:max-w-sm lg:max-w-md animate-float"
              fetchPriority="high"
            />
            {inStock && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse shadow-md">
                متوفر الآن
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;