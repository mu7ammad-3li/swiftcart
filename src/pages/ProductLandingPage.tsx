// src/pages/ProductLandingPage.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // Assumed existing
import Footer from "../components/Footer"; // Assumed existing
import TestimonialsSection from "@/components/TestimonialsSection"; // Existing, to be adapted
import { useCart } from "@/contexts/CartContext"; //
import { toast } from "@/hooks/use-toast"; //
import { Product as ProductType } from "@/data/products"; //
import AnalyticsService from "@/services/analyticsService"; //

// Import the new generic section components
import HeroSection, { HeroSectionProps } from "@/components/landing/HeroSection"; //
import ProblemStatementSection, { ProblemStatementSectionProps } from "@/components/landing/ProblemStatementSection"; //
import ProductFeaturesSection, { ProductFeaturesSectionProps } from "@/components/landing/ProductFeaturesSection"; //
import SolutionStrategySection, { SolutionStrategySectionProps } from "@/components/landing/SolutionStrategySection"; //
import MainOfferSection, { MainOfferSectionProps } from "@/components/landing/MainOfferSection"; //
import AlternativeProductsSection, { AlternativeProductsSectionProps } from "@/components/landing/AlternativeProductsSection"; //
import ProductDetailsSection, { ProductDetailsSectionProps } from "@/components/landing/ProductDetailsSection"; //
import InstructionsSection, { InstructionsSectionProps } from "@/components/landing/InstructionsSection"; //
import FinalCallToActionSection, { FinalCallToActionSectionProps } from "@/components/landing/FinalCallToActionSection"; //
// REMOVE: import FloatingActionButton, { FloatingActionButtonProps } from "@/components/landing/FloatingActionButton";
// Import the context hook and the prop type for the primary button
import { usePrimaryFab } from "@/contexts/PrimaryFabContext"; // Assuming path from previous step
import { FloatingActionButtonProps } from "@/components/landing/FloatingActionButton"; // Keep this if fabConfig uses it
import { PrimaryActionButtonProps } from "@/components/landing/GlobalFloatingButtons"; // Assuming path from previous step


// Interface for the main product data (single unit)
export interface SingleProductConfig {
  id: string; //
  name: string; //
  slug?: string; //
  tagline?: string; // Used in Hero and potentially other places
  shortDescription: string; //
  longDescription: string; //
  price: string; // Formatted price string
  originalPrice?: string; //
  onSale?: boolean; //
  shippingCost?: number; //
  priceDescription?: string; // e.g. "العبوة تكفي لتحضير 5 لتر"
  rating?: number; //
  reviewCount?: number; //
  inStock?: boolean; //
  imageSrc: string; //
  imageAlt?: string; //
  features: ProductFeaturesSectionProps['features']; // Array of features for ProductFeaturesSection
  instructions: InstructionsSectionProps['instructions']; // Array of instructions for InstructionsSection
  // Potentially more fields like SKU, categories, etc.
}

// Interface for a special offer (like BedGuard's double offer)
export interface OfferConfig {
  id: string; //
  name: string; //
  tagline: string; //
  description: string; //
  price: string; //
  originalPrice?: string; //
  savings?: string; //
  benefits?: string[]; //
  imageSrc: string; //
  imageAlt?: string; //
  ctaText: string; //
  // any other offer-specific fields
}

// Main configuration for the entire landing page
export interface ProductLandingPageConfig {
  pageTitle: string; //
  analyticsPageName: string; //
  
  // Data for the core product being featured
  product: SingleProductConfig;  //
  
  // Data for the main highlighted offer (could be a bundle of 'product', or a different offer)
  mainOffer: OfferConfig;  //
  
  // Optional data for alternative products/upsells
  alternativeProducts?: AlternativeProductsSectionProps['products']; //
  
  // Testimonial category for this product
  testimonialCategory: string; // e.g., "Bed-Bugs", "Crawling-Insects"

  // Specific content/props for sections if not directly derivable from product/offer data
  heroSectionConfig?: Partial<HeroSectionProps>; // Overrides or additions to what's derived from product
  problemStatementSectionConfig?: ProblemStatementSectionProps; // If this section is present
  solutionStrategySectionConfig?: SolutionStrategySectionProps; // If this section is present
  finalCtaConfig?: FinalCallToActionSectionProps; //
  fabConfig?: FloatingActionButtonProps; //
  mainOfferSectionConfig?: Partial<MainOfferSectionProps>; //
  // Theme/Styling (can be simplified if consistent patterns emerge)
  theme: {
    accentColorClass: string; // e.g., 'text-bella', 'text-green-600'
    secondaryAccentColorClass?: string; // e.g., 'text-orange-400'
    
    heroBgGradientFrom: string; //
    heroBgGradientVia: string; //
    heroBgGradientTo: string; //
    heroIcon?: React.ReactNode; //

    problemStatement?: { // Optional if section is not used
        backgroundColorClass?: string; //
        iconTextColorClass?: string; //
    };
    productFeatures: { //
        sectionBgClass?: string; //
        contentWrapperBgClass?: string; //
        iconWrapperBgClass?: string; //
        iconWrapperTextClass?: string; //
    };
    solutionStrategy?: { // Optional if section is not used
        backgroundColorClass?: string; //
        iconWrapperClass?: string; //
        highlightedTextColorClass?: string; //
    };
    mainOffer: { //
        gradientFromClass: string; //
        gradientViaClass?: string; //
        gradientToClass: string; //
        badgeBgClass?: string; //
        badgeTextClass?: string; //
        primaryButtonBgClass?: string; //
        primaryButtonTextClass?: string; //
        secondaryActionButtonClass?: string; //
        patternImageUrl?: string; //
    };
    alternativeProducts?: { // Optional
        backgroundColorClass?: string; //
        featuredBorderClass?: string; //
        defaultButtonClass?: string; //
        featuredButtonClass?: string; //
    };
    productDetails: { //
        backgroundColorClass?: string; //
        contentBackgroundColorClass?: string; //
        borderColorClass?: string; //
        showMoreButtonTextColorClass?: string; //
        showMoreButtonHoverTextColorClass?: string; //
    };
    instructions: { //
        backgroundColorClass?: string; //
        instructionItemBgGradientFrom?: string; //
        instructionItemBgGradientVia?: string; //
        instructionItemBgGradientTo?: string; //
        instructionItemBorderClass?: string; //
        iconWrapperBgClass?: string; //
        iconColorClass?: string; //
    };
    finalCallToAction?: { // Optional
        backgroundColorClass?: string; //
        titleColorClass?: string; //
        primaryButtonClass?: string; //
        secondaryButtonClass?: string; //
    };
    floatingActionButton?: { // Optional
        bgColorClass?: string; //
        hoverBgColorClass?: string; //
        focusRingColorClass?: string; //
    };
  };
}


const ProductLandingPage: React.FC<{ config: ProductLandingPageConfig }> = ({ config }) => {
  const navigate = useNavigate(); //
  const { addItem: addToCart } = useCart(); //
  const { setPrimaryButtonProps } = usePrimaryFab();
  const alreadyTrackedSections = useRef(new Set<string>()); //
  const [showFullDescription, setShowFullDescription] = useState(false); //
  const [isWishlisted, setIsWishlisted] = useState(false); // Example state

  const handleAddToCart = useCallback((product: SingleProductConfig | OfferConfig, quantity: number = 1, isOffer: boolean = false) => {
    const analyticsProductName = isOffer ? (product as OfferConfig).name : (product as SingleProductConfig).name; //
    AnalyticsService.trackButtonClick( //
        `Add to Cart - ${analyticsProductName}`, //
        `${config.analyticsPageName} Action`, //
        product.id //
    );
    
    const cartProduct: ProductType = { //
        id: product.id, //
        name: product.name, //
        price: product.price, // This assumes 'price' on OfferConfig is the final price
        image: product.imageSrc, //
        shortDescription: (product as any).shortDescription || (product as OfferConfig).tagline, //
        FreeDelivery: isOffer, // Example: offers might have free delivery
        featured: true, //
        details: { //
            longDescription: (product as SingleProductConfig).longDescription || "", //
            features: (product as SingleProductConfig).features?.map(f => f.description) || [], //
            instructions: (product as SingleProductConfig).instructions?.map(i => i.detail) || [], //
        },
        slug: (product as SingleProductConfig).slug, //
        onSale: false //
    };
    addToCart(cartProduct, quantity); //
    toast({ //
      title: "تمت الإضافة إلى السلة", //
      description: `تمت إضافة ${quantity} × ${product.name} إلى السلة.`, //
      variant: "default", //
    });
  }, [addToCart, config.analyticsPageName]);

  const handleBuyNow = useCallback((product: SingleProductConfig | OfferConfig, isOffer: boolean = false) => {
    const analyticsProductName = isOffer ? (product as OfferConfig).name : (product as SingleProductConfig).name; //
    AnalyticsService.trackButtonClick( //
        `Buy Now - ${analyticsProductName}`, //
        `${config.analyticsPageName} Action`, //
        product.id //
    );
    handleAddToCart(product, 1, isOffer); //
    navigate("/checkout"); //
  }, [navigate, handleAddToCart, config.analyticsPageName]);
  
  const handleShare = useCallback(async () => {
    AnalyticsService.trackButtonClick('Share', `${config.analyticsPageName} Hero`, config.product.id); //
     if (navigator.share) { //
      try { //
        await navigator.share({ //
          title: config.product.name, //
          text: config.product.shortDescription, //
          url: window.location.href, //
        });
      } catch (error) { //
        console.error("Error sharing:", error); //
        navigator.clipboard.writeText(window.location.href); //
        toast({ title: "تم نسخ الرابط", description: "حدث خطأ أثناء المشاركة, تم نسخ الرابط بدلاً من ذلك.", variant: "default"}); //
      }
    } else { //
      navigator.clipboard.writeText(window.location.href); //
      toast({ title: "تم نسخ الرابط!", variant: "default" }); //
    }
  }, [config.analyticsPageName, config.product.id, config.product.name, config.product.shortDescription]);

  const toggleWishlist = useCallback(() => {
    const newWishlistStatus = !isWishlisted; //
    setIsWishlisted(newWishlistStatus); //
    AnalyticsService.trackButtonClick( //
      newWishlistStatus ? 'Add to Wishlist' : 'Remove from Wishlist', //
      `${config.analyticsPageName} Hero`, //
      config.product.id //
    );
  }, [isWishlisted, config.analyticsPageName, config.product.id]);
  
  const handleShowMoreDescription = useCallback(() => {
    setShowFullDescription(prev => !prev); //
    AnalyticsService.trackButtonClick( //
      !showFullDescription ? 'Show More Details' : 'Show Less Details', //
      `${config.analyticsPageName} Details Section`, //
      config.product.id //
    );
  }, [showFullDescription, config.analyticsPageName, config.product.id]);

  useEffect(() => {
    document.title = config.pageTitle; //
    window.scrollTo(0, 0); //

    const elementsToObserve = document.querySelectorAll(".track-section-view"); //
    const observer = new IntersectionObserver( //
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) { //
            if (!alreadyTrackedSections.current.has(entry.target.id)) { //
              AnalyticsService.trackSectionView( //
                entry.target.getAttribute("data-section-name") || entry.target.id, //
                entry.target.id, //
                window.location.pathname //
              );
              alreadyTrackedSections.current.add(entry.target.id); //
            }
          }
        });
      },
      { threshold: 0.3 } //
    );
    elementsToObserve.forEach((el) => observer.observe(el)); //
    
    // Set the primary FAB props for this page
    if (config.fabConfig && config.product.inStock) { //
      const fabOnClick = () => {
        AnalyticsService.trackButtonClick( //
          config.fabConfig?.analyticsButtonName || "FAB Click", //
          `${config.analyticsPageName} FAB`, //
          config.mainOffer.id //
        );
        const offerElement = document.getElementById(config.mainOffer.id); //
        if (offerElement) { //
          offerElement.scrollIntoView({ behavior: 'smooth' }); //
        } else {
          handleBuyNow(config.mainOffer, true); // Fallback
        }
      };

      const pageFabProps: PrimaryActionButtonProps = {
        ...config.fabConfig, // Spreads icon, ariaLabel, analyticsButtonName etc.
        onClick: fabOnClick,
        isVisible: config.fabConfig.isVisible !== undefined ? config.fabConfig.isVisible : config.product.inStock, //
        bgColorClass: config.fabConfig.bgColorClass || config.theme.floatingActionButton?.bgColorClass, //
        hoverBgColorClass: config.fabConfig.hoverBgColorClass || config.theme.floatingActionButton?.hoverBgColorClass, //
        focusRingColorClass: config.fabConfig.focusRingColorClass || config.theme.floatingActionButton?.focusRingColorClass, //
        // analyticsLocation: config.fabConfig.analyticsLocation, // Ensure these are part of FloatingActionButtonProps if used
        // analyticsItemId: config.fabConfig.analyticsItemId,
      };
      setPrimaryButtonProps(pageFabProps);
    } else {
      setPrimaryButtonProps(undefined);
    }

    return () => {
      elementsToObserve.forEach((el) => observer.unobserve(el)); //
      observer.disconnect(); //
      setPrimaryButtonProps(undefined); // Reset FAB when component unmounts
    };
  }, [config, setPrimaryButtonProps, handleBuyNow]);


  return (
    <div className="min-h-screen bg-white"> {/* */}
      <Navbar /> {/* */}

      <HeroSection //
        productName={config.product.name} //
        tagline={config.product.tagline || config.mainOffer.tagline} //
        shortDescription={config.product.shortDescription} //
        imageSrc={config.product.imageSrc} //
        imageAlt={config.product.imageAlt || config.product.name} //
        ctaPrimaryText={config.heroSectionConfig?.ctaPrimaryText || "اكتشف العرض الرئيسي"} //
        ctaPrimaryLink={config.heroSectionConfig?.ctaPrimaryLink || `#${config.mainOffer.id}`} //
        onCtaPrimaryClick={() => { /* scroll or other action */  //
            AnalyticsService.trackButtonClick(config.heroSectionConfig?.ctaPrimaryText || "اكتشف العرض الرئيسي", `${config.analyticsPageName} Hero`, config.mainOffer.id); //
            const offerElement = document.getElementById(config.mainOffer.id); //
            if (offerElement) offerElement.scrollIntoView({ behavior: 'smooth' }); //
        }}
        ctaSecondaryText={config.heroSectionConfig?.ctaSecondaryText || "اقرأ المزيد"} //
        ctaSecondaryLink={config.heroSectionConfig?.ctaSecondaryLink || `#product-details-section`} // Assuming a standard ID for details section
        onCtaSecondaryClick={() => {  //
            AnalyticsService.trackButtonClick(config.heroSectionConfig?.ctaSecondaryText || "اقرأ المزيد", `${config.analyticsPageName} Hero`, config.product.id); //
            const detailsElement = document.getElementById(`product-details-section-${config.product.id}`); // More specific ID
            if (detailsElement) detailsElement.scrollIntoView({ behavior: 'smooth' }); //
        }}
        wishlistStatus={isWishlisted} //
        onToggleWishlist={toggleWishlist} //
        onShare={handleShare} //
        productPrice={config.product.price} //
        originalPrice={config.product.originalPrice} //
        shippingCost={config.product.shippingCost} //
        priceDescription={config.product.priceDescription} //
        rating={config.product.rating} //
        reviewCount={config.product.reviewCount} //
        inStock={config.product.inStock} //
        accentColorClass={config.theme.accentColorClass} //
        secondaryAccentColorClass={config.theme.secondaryAccentColorClass} //
        bgColorClass={`${config.theme.accentColorClass.replace('text-','')}/10`} //
        heroBgGradientFrom={config.theme.heroBgGradientFrom} //
        heroBgGradientVia={config.theme.heroBgGradientVia} //
        heroBgGradientTo={config.theme.heroBgGradientTo} //
        heroIcon={config.theme.heroIcon} //
        {...config.heroSectionConfig} 
      />
      {config.alternativeProducts && config.alternativeProducts.length > 0 && ( //
        <AlternativeProductsSection //
          id={`alternatives-${config.product.id}`} //
          title="لو مش حابب تخفف" // Or make this configurable
          products={config.alternativeProducts} //
          backgroundColorClass={config.theme.alternativeProducts?.backgroundColorClass} //
          featuredBorderClass={config.theme.alternativeProducts?.featuredBorderClass} //
          defaultButtonClass={config.theme.alternativeProducts?.defaultButtonClass} //
          featuredButtonClass={config.theme.alternativeProducts?.featuredButtonClass} //
        />
      )}

      {config.problemStatementSectionConfig && ( //
        <ProblemStatementSection  //
            {...config.problemStatementSectionConfig}  //
            backgroundColorClass={config.problemStatementSectionConfig.backgroundColorClass || config.theme.problemStatement?.backgroundColorClass} //
            iconTextColorClass={config.problemStatementSectionConfig.iconTextColorClass || config.theme.problemStatement?.iconTextColorClass} //
        />
      )}

      <ProductFeaturesSection //
        id={`features-${config.product.id}`} //
        title={config.heroSectionConfig?.productName ? `مميزات ${config.heroSectionConfig.productName} الفريدة` : `مميزات ${config.product.name} الفريدة`} //
        features={config.product.features} //
        sectionBgClass={config.theme.productFeatures.sectionBgClass} //
        contentWrapperBgClass={config.theme.productFeatures.contentWrapperBgClass} //
        iconWrapperBgClass={config.theme.productFeatures.iconWrapperBgClass} //
        iconWrapperTextClass={config.theme.productFeatures.iconWrapperTextClass} //
      />

      {config.solutionStrategySectionConfig && ( //
        <SolutionStrategySection  //
            {...config.solutionStrategySectionConfig}  //
            backgroundColorClass={config.solutionStrategySectionConfig.backgroundColorClass || config.theme.solutionStrategy?.backgroundColorClass} //
            iconWrapperClass={config.solutionStrategySectionConfig.iconWrapperClass || config.theme.solutionStrategy?.iconWrapperClass} //
            highlightedTextColorClass={config.solutionStrategySectionConfig.highlightedTextColorClass || config.theme.solutionStrategy?.highlightedTextColorClass} //
        />
      )}
      
      <MainOfferSection //
        id={config.mainOffer.id} //
        offerName={config.mainOffer.name} //
        offerTagline={config.mainOffer.tagline} //
        offerDescription={config.mainOffer.description} //
        offerPrice={config.mainOffer.price} //
        originalPrice={config.mainOffer.originalPrice} //
        savingsText={config.mainOffer.savings} //
        benefits={config.mainOffer.benefits} //
        imageSrc={config.mainOffer.imageSrc} //
        imageAlt={config.mainOffer.imageAlt || config.mainOffer.name} //
        ctaText={config.mainOffer.ctaText} //
        onCtaClick={() => handleBuyNow(config.mainOffer, true)} //
        secondaryActionText={ (config.mainOffer.id !== config.product.id) ? `أو اطلب ${config.product.name} (${config.product.price})` : undefined} //
        onSecondaryActionClick={ (config.mainOffer.id !== config.product.id) ? () => handleBuyNow(config.product, false) : undefined} //
        gradientFromClass={config.theme.mainOffer.gradientFromClass} //
        gradientViaClass={config.theme.mainOffer.gradientViaClass} //
        gradientToClass={config.theme.mainOffer.gradientToClass} //
        badgeBgClass={config.theme.mainOffer.badgeBgClass} //
        badgeTextClass={config.theme.mainOffer.badgeTextClass} //
        primaryButtonBgClass={config.theme.mainOffer.primaryButtonBgClass} //
        primaryButtonTextClass={config.theme.mainOffer.primaryButtonTextClass} //
        secondaryActionButtonClass={config.theme.mainOffer.secondaryActionButtonClass} //
        patternImageUrl={config.theme.mainOffer.patternImageUrl} //
        badgeText={config.mainOffer.id === config.product.id && config.product.onSale ? "عرض خاص!" : undefined} // Example badge logic
      />
      
      <ProductDetailsSection //
        id={`product-details-section-${config.product.id}`} //
        title={`لماذا ${config.product.name} هو الحل الأمثل بالتفصيل؟`} //
        longDescription={config.product.longDescription} //
        showFullDescription={showFullDescription} //
        onToggleShowMore={handleShowMoreDescription} //
        backgroundColorClass={config.theme.productDetails.backgroundColorClass} //
        contentBackgroundColorClass={config.theme.productDetails.contentBackgroundColorClass} //
        borderColorClass={config.theme.productDetails.borderColorClass} //
        showMoreButtonTextColorClass={config.theme.productDetails.showMoreButtonTextColorClass} //
        showMoreButtonHoverTextColorClass={config.theme.productDetails.showMoreButtonHoverTextColorClass} //
      />

      <InstructionsSection //
        id={`instructions-${config.product.id}`} //
        title={`خطوات بسيطة للاستخدام مع ${config.product.name}`} //
        instructions={config.product.instructions} //
        backgroundColorClass={config.theme.instructions.backgroundColorClass} //
        instructionItemBgGradientFrom={config.theme.instructions.instructionItemBgGradientFrom} //
        instructionItemBgGradientVia={config.theme.instructions.instructionItemBgGradientVia} //
        instructionItemBgGradientTo={config.theme.instructions.instructionItemBgGradientTo} //
        instructionItemBorderClass={config.theme.instructions.instructionItemBorderClass} //
        iconWrapperBgClass={config.theme.instructions.iconWrapperBgClass} //
        iconColorClass={config.theme.instructions.iconColorClass} //
      />
      
      <TestimonialsSection category={config.testimonialCategory} /> {/* */}

      {config.finalCtaConfig && ( //
          <FinalCallToActionSection  //
            {...config.finalCtaConfig} //
            onPrimaryActionClick={() => { //
                AnalyticsService.trackButtonClick(config.finalCtaConfig?.analyticsPrimaryActionName || config.finalCtaConfig!.primaryActionText, `${config.analyticsPageName} Final CTA`, config.mainOffer.id); //
                const offerElement = document.getElementById(config.mainOffer.id); //
                if (offerElement) offerElement.scrollIntoView({ behavior: 'smooth' }); //
                else handleBuyNow(config.mainOffer, true); // Fallback
            }}
            onSecondaryActionClick={config.finalCtaConfig.onSecondaryActionClick ? () => { //
                AnalyticsService.trackButtonClick(config.finalCtaConfig?.analyticsSecondaryActionName || config.finalCtaConfig!.secondaryActionText!, `${config.analyticsPageName} Final CTA`, config.product.id); //
                handleBuyNow(config.product, false); // Assuming secondary is for single product
            } : undefined}
            backgroundColorClass={config.finalCtaConfig.backgroundColorClass || config.theme.finalCallToAction?.backgroundColorClass} //
            titleColorClass={config.finalCtaConfig.titleColorClass || config.theme.finalCallToAction?.titleColorClass} //
            primaryButtonClass={config.finalCtaConfig.primaryButtonClass || config.theme.finalCallToAction?.primaryButtonClass} //
            secondaryButtonClass={config.finalCtaConfig.secondaryButtonClass || config.theme.finalCallToAction?.secondaryButtonClass} //
          />
      )}
      
      <Footer /> {/* */}
      
      <style jsx>{`
        // Minimal global styles if needed
        @keyframes float { 
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.7s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .line-clamp-5 { /* For long descriptions preview */
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        // Ensure .track-section-view is defined if not already global
      `}</style> {/* */}
    </div>
  );
};

export default ProductLandingPage;