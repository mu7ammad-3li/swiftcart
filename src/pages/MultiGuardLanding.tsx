// src/pages/MultiGuardLanding.tsx
import React from "react";
import ProductLandingPage, { 
    ProductLandingPageConfig,
    SingleProductConfig,
    OfferConfig
} from "./ProductLandingPage"; // Adjust path if needed

import { 
    Shield, 
    BugOff, 
    Info, 
    ListChecks, 
    Zap, 
    Clock, 
    Award, 
    Users, 
    ShoppingCart, 
    Sparkles 
} from "lucide-react";

// --- Product Data for MultiGuard 20% ---
// This data should be structured according to the SingleProductConfig interface
const multiGuardProductData: SingleProductConfig = {
  id: "multiguard20", 
  name: "مالتـي جــارد 20%",
  slug: "multiguard20", // Assuming slug if needed
  tagline: "صـراصـير؟... ولا نـمـل؟... مفيــش بعد النهاردة!",
  shortDescription: "مالتى جارد 20% الحل الآمن والفعال بتركيبة متطورة وبدون رائحة.",
  price: "249 جنيه", 
  originalPrice: "299 جنيه", // Example, adjust if productData had 'price' as original and 'salePrice' as current
  onSale: true, // Assuming salePrice is the current price
  shippingCost: 50, // Standard shipping, can be overridden by offers
  priceDescription: "العبوة ٥٠ مل تكفي لتحضير ٥ لتر مبيد لرش مساحة ١٠٠ متر مربع.",
  rating: 4.7, 
  reviewCount: 98, 
  inStock: true, 
  imageSrc: "/imgs/Multiguard20(Concentrated).webp", // Make sure this path is correct
  imageAlt: "مالتي جارد 20% لمكافحة الصراصير والنمل",
  longDescription: "وداعاً للصراصير والنمل والحشرات الزاحفة المزعجة مع مالتـي جــارد 20% من بيلا ايجيبت. طورنا تركيبة متطورة فريدة (فيبرونيل 20% ولمبادا-سيهالوثرين 10%) عشان نضمنلك القضاء الفعال على الحشرات دي من غير أي قلق. مالتـي جــارد 20% بيتميز بإنه بدون أي رائحة أو لون، يعني تقدر تستخدمه في أي مكان في البيت حتى المطبخ (مع مراعاة غسل الأواني لو اترشت). الأهم إنه آمن على كل أفراد الأسرة، من الأطفال للحيوانات الأليفة وحتى مرضى الحساسية . مفعوله سريع بيقضي على الحشرات الكبيرة خلال 3 أيام وبيوفر حماية مستمرة. عشان نضمن نتيجة نهائية، بننصح برشة تانية بعد 10-15 يوم. عبوة واحدة بتكفي شقة كاملة (100 متر). اختار مالتـي جــارد 20% لبيت نظيف وصحي وخالي من الحشرات الزاحفة.",
  features: [
    { icon: <Zap />, title: "قوة مزدوجة", description: "تركيبة متقدمة (فيبرونيل + لمبادا-سيهالوثرين) للقضاء التام على الصراصير والنمل والحشرات الزاحفة." },
    { icon: <Shield />, title: "آمن على الأسرة", description: "آمن 100% على الأسرة: الأطفال، كبار السن، الحيوانات الأليفة، ومرضى الحساسية (مع اتباع التعليمات)." },
    { icon: <BugOff />, title: "بدون رائحة أو لون", description: "بدون رائحة أو لون، لا يترك أي أثر ومناسب للاستخدام في المطابخ والحمامات." },
    { icon: <Clock />, title: "تأثير سريع وممتد", description: "يقضي على الحشرات خلال 3 أيام ويوفر حماية ممتدة." },
    { icon: <Award />, title: "إبادة كاملة", description: "رشة ثانية بعد 10-15 يوم تضمن القضاء على الأجيال الجديدة." },
    { icon: <Users />, title: "عبوة اقتصادية", description: "عبوة ٥٠ مل تكفي لرش مساحة ١٠٠ متر مربع." },
  ],
  instructions: [
    { title: "التخفيف", detail: "رج العبوة، ثم خفف 10 مل لكل 1 لتر ماء (العبوة الكاملة 50 مل لـ 5 لتر ماء)." },
    { title: "الرش", detail: "رش أماكن مرور واختباء الحشرات: الأركان، الحواف، تحت الأحواض والأجهزة، حول البالوعات ومواسير الصرف، حلوق الأبواب والشبابيك، والشقوق." },
    { title: "المطبخ", detail: "رش الخزائن بعد تفريغها. اغسل الأواني جيداً قبل الاستخدام لو لامسها الرذاذ." },
    { title: "بعد الرش", detail: "سيب الأسطح بدون مسح لمدة 4 أيام على الأقل. قم بتهوية المكان." },
    { title: "الرشة الثانية", detail: "كرر الرش بعد 10-15 يوم للقضاء على أي أجيال جديدة." },
    { title: "الأمان", detail: "تجنب ملامسة العين والوجه. اغسل يديك بعد الاستخدام. يحفظ بعيداً عن الأطفال." },
    { title: "التخزين", detail: "في العبوة الأصلية بمكان بارد وجاف." },
  ],
};

// For MultiGuard, the 'mainOffer' will be the single product itself,
// but structured as an OfferConfig.
const multiGuardMainOfferData: OfferConfig = {
  id: "MultiGuard20_double_offer",
  name: "عرض التوفير الذكي: عبوتين مالتى جـارد 20% المركزتين",
  tagline: "تخلص من الصراصير والنمل نهائياً بسعر مميز!",
  description: `احصل على ${multiGuardProductData.name} الآن بتركيبته الفعالة والآمنة. عبوة مركزة تكفي لمنزلك بالكامل وتضمن لك حماية تدوم.`,
  price: "500 جنيه",
  originalPrice: "600 جنيه",
  savings: "100 جنيه + شحن مجاني",
  benefits: [
    "فعالية مثبتة ضد الصراصير والنمل",
    "آمن على الأسرة والحيوانات الأليفة",
    "بدون رائحة تماما",
    "عبوتين مركزتين  (10 لتر بعد التخفيف)"
  ],
  imageSrc: "imgs/MultiGuard-20-Double-Defense-Pack(2Bottles).webp",
  imageAlt: "عرض عبوتين مالتى جارد المركز",
  ctaText: "اطلب الآن واستمتع ببيت نظيف!",
};
const multiGuardReadyToUseSingle={
    id: "multiguardSpray_alt", // Ensure unique ID if also a main product
    name: "بخاخ مالتي جارد المخفف (1 لتر جاهز للرش)",
    storeLink: "/products/multiguardSpray", // Make sure this route exists in your router
    imageSrc: "/imgs/Multiguard-Spray(Ready-to-Use).webp",
    imageAlt: "بخاخ مالتي جارد الجاهز",
    description: "نفس الفعالية المثبتة، جاهز للاستخدام مباشرة بدون أي تخفيف. مثالي للرش السريع والمناطق المحدودة.",
    ctaText: "اطلب بخاخ 1 لتر الجاهز",
    ctaIcon: <ShoppingCart className="inline-block ml-2 h-5 w-5" />,
    isFeatured: false,
    analyticsButtonName: "Shop Ready-to-Use Single - multiguardSpray_alt",
    analyticsSectionName: "MultiGuard Ready-To-Use Alternatives"
  

}
const multiGuardReadyToUseTriplePack={
    id: "MultiGuard-SprayBundle_alt", // Ensure unique ID
    name: "عرض التوفير: 3 عبوات بخاخ مالتى جارد المخفف (إجمالي 3 لتر)",
    storeLink: "/products/MultiGuard-SprayBundle", // Make sure this route exists
    imageSrc: "/imgs/Multiguard-Spray-Triple-Pack(3x1L-Bottles).webp",
    imageAlt: "عرض 3 عبوات بخاخ مالتى جارد",
    description: "كمية أكبر لمعالجة أشمل أو رشات متعددة للمساحات الأكبر، بسعر أوفر!",
    ctaText: "اطلب عرض الـ 3 عبوات الجاهزة",
    ctaIcon: <ShoppingCart className="inline-block ml-2 h-5 w-5" />,
    isFeatured: true,
    specialOfferBadgeText: "عرض خاص!",
    analyticsButtonName: "Shop Ready-to-Use Triple Pack - MultiGuard-SprayBundle_alt",
    analyticsSectionName: "MultiGuard Ready-To-Use Alternatives"
  

}


const multiGuardPageConfig: ProductLandingPageConfig = {
  pageTitle: "مالتي جارد 20% - وداعاً للصراصير والنمل | بيلا جارد",
  analyticsPageName: "MultiGuard",
  
  product: multiGuardProductData,
  mainOffer: multiGuardMainOfferData, 
  
  alternativeProducts: [
    multiGuardReadyToUseSingle,
    multiGuardReadyToUseTriplePack
  ],

  testimonialCategory: "Crawling-Insects",

  heroSectionConfig: {
    // productName from product.name is used by default in HeroSection if heroIcon is present
    // tagline from product.tagline
    // shortDescription from product.shortDescription
    ctaPrimaryText: multiGuardProductData.onSale ? "اطلبه الآن بسعر العرض!" : "اطلبه الآن!",
    ctaPrimaryLink: `#${multiGuardMainOfferData.id}`, // Link to mainOffer section
    ctaSecondaryText: "اقرأ المزيد من التفاصيل",
    ctaSecondaryLink: `#product-details-section-${multiGuardProductData.id}`,
    // productPrice, originalPrice, shippingCost, rating, reviewCount are taken from 'product'
  },

  // No problemStatementSectionConfig for MultiGuard
  // No solutionStrategySectionConfig for MultiGuard
  
  mainOfferSectionConfig: {
    // Data like offerName, tagline, price etc. comes from `mainOffer` (multiGuardMainOfferData)
    // This config is for additional presentation props.
    badgeText: multiGuardProductData.onSale ? "عرض خاص!" : "الأكثر مبيعاً!",
    badgeIcon: <Sparkles className="inline-block mr-2 h-5 w-5" />,
    // No secondaryActionText because the main offer IS the single product for MultiGuard in this setup.
  },

  finalCtaConfig: {
    id: "multiguard-final-cta",
    dataSectionName: "MultiGuard Final CTA",
    title: "مستعد لبيت نظيف وخالي من الحشرات الزاحفة؟",
    description: `اطلب ${multiGuardProductData.name} الآن وتمتع ببيئة صحية وآمنة لك ولعائلتك.`,
    primaryActionText: `اطلب ${multiGuardProductData.name} الآن`,
    primaryActionIcon: <BugOff className="h-6 w-6" />,
    analyticsPrimaryActionName: `Order Now - MultiGuard Final CTA`,
    analyticsItemId: multiGuardProductData.id,
    secondaryActionText: `العبوة بـ ${multiGuardProductData.price}`,
    onPrimaryActionClick: function (): void {
      throw new Error("Function not implemented.");
    }
  },

  fabConfig: {
    ariaLabel: "اشتري الآن",
    icon: <ShoppingCart className="h-6 w-6" />,
    isVisible: multiGuardProductData.inStock,
    analyticsButtonName: `Buy Now - MultiGuard Mobile FAB`,
    analyticsItemId: multiGuardProductData.id,
    onClick: function (): void {
      throw new Error("Function not implemented.");
    }
  },
  
  theme: {
    accentColorClass: 'text-green-600',
    secondaryAccentColorClass: 'text-lime-500', 

    heroBgGradientFrom: 'from-white',
    heroBgGradientVia: 'via-green-50', // Light green
    heroBgGradientTo: 'to-lime-500/5', // Very subtle lime
    heroIcon: <Shield className="h-5 w-5" />, // Default icon for MultiGuard hero badge

    // problemStatement and solutionStrategy are omitted as sections are not used

    productFeatures: {
        sectionBgClass: "bg-gray-50",
        contentWrapperBgClass: "bg-gradient-to-b from-green-50 to-green-100",
        iconWrapperBgClass: "bg-green-500/10",
        iconWrapperTextClass: "text-green-600",
    },
    mainOffer: { // Styling for MainOfferSection (representing single MultiGuard product)
        gradientFromClass: 'from-green-600',
        gradientViaClass: 'via-lime-500',
        gradientToClass: 'to-yellow-400', // As per original MultiGuard offer section
        badgeBgClass: 'bg-yellow-300', 
        badgeTextClass: 'text-green-700',
        primaryButtonBgClass: 'bg-white',
        primaryButtonTextClass: 'text-green-700',
        // secondaryActionButtonClass not applicable here as no secondary action
        patternImageUrl: "/imgs/patterns/pest-pattern-white.svg", // Can be themed or omitted
    },
    // alternativeProducts theme omitted as section is not used

    productDetails: {
        backgroundColorClass: 'bg-white',
        contentBackgroundColorClass: 'bg-gray-50',
        borderColorClass: 'border-gray-200',
        showMoreButtonTextColorClass: 'text-green-600',
        showMoreButtonHoverTextColorClass: 'hover:text-green-700',
    },
    instructions: {
        backgroundColorClass: 'bg-white',
        instructionItemBgGradientFrom: 'from-gray-50',
        instructionItemBgGradientVia: 'via-white',
        instructionItemBgGradientTo: 'to-gray-50',
        instructionItemBorderClass: 'border-gray-200',
        iconWrapperBgClass: "bg-green-500/10",
        iconColorClass: "text-green-600",
    },
    finalCallToAction: {
        backgroundColorClass: "bg-gradient-to-br from-green-500/5 via-lime-500/5 to-yellow-500/5",
        titleColorClass: "text-green-700",
        primaryButtonClass: "bg-green-600 hover:bg-green-700 text-white text-lg flex items-center justify-center gap-2 mx-auto transform hover:-translate-y-1.5 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl px-10 py-4 rounded-lg", // From original MultiGuard
        secondaryButtonClass: "text-gray-500", // For informational text
    },
    floatingActionButton: {
        bgColorClass: "bg-green-600",
        hoverBgColorClass: "hover:bg-green-700",
        focusRingColorClass: "focus:ring-green-400",
    },
  }
};

const EnhancedMultiGuardLanding = () => { // Renamed for clarity if you have an old MultiGuardLanding.tsx
  return <ProductLandingPage config={multiGuardPageConfig} />;
};

export default EnhancedMultiGuardLanding;