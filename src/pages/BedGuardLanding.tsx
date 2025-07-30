// src/pages/BedGuardLanding.tsx
import React from "react";
import ProductLandingPage, { 
    ProductLandingPageConfig, 
    SingleProductConfig, // Assuming this is exported from ProductLandingPage or a types file
    OfferConfig         // Assuming this is exported from ProductLandingPage or a types file
} from "./ProductLandingPage"; // Adjust path if ProductLandingPage.tsx is elsewhere

import { 
    BugOff, 
    Info, 
    Zap, 
    Shield, 
    Clock, 
    Award, 
    Package as ProductPackageIcon, // Renamed to avoid conflict with React.Package
    Sparkles, 
    ShoppingCart, 
    AlertTriangle, 
    Target, 
    ListChecks 
} from "lucide-react";

// Data Imports/Definitions (ensure these paths or definitions are correct)
// Option 1: Import from original BedGuardLanding if data is kept there and exported
// import { 
//     singleProductData as bedGuardSingleProductData, 
//     doubleProductOffer as bedGuardDoubleOfferData,
//     readyToUseSingle as bedGuardReadyToUseSingle,
//     readyToUseTriplePack as bedGuardReadyToUseTriplePack
// } from './BedGuardLanding.original'; // Example path if you moved the old file

// Option 2: Define directly (as in your prompt, ensure these are complete)
// For brevity, using placeholders. Replace with actual full data objects.
const bedGuardSingleProductData: SingleProductConfig = {
  id: "BedGuard20_single",
  name: "بـيد جـارد 20% (العبوة المركزة)",
  slug: "BedGuard20",
  tagline: "وداعاً لكابوس بق الفراش والبراغيث نهائياً!",
  shortDescription: "تركيبة مركزة فائقة القوة، تقضي على البق وتمنع عودته. آمنة وبدون رائحة.",
  price: "250 جنيه",
  originalPrice: "300 جنيه",
  onSale: true,
  shippingCost: 50,
  priceDescription: "العبوة تكفي لتحضير 5 لتر مبيد جاهز للرش",
  rating: 4.9,
  reviewCount: 158,
  inStock: true,
  imageSrc: "/imgs/Bedguard20-(Concentrated).webp",
  imageAlt: "بيد جارد 20% العبوة المركزة",
  longDescription: `تخلص نهائياً من بق الفراش والبراغيث مع ${"بـيد جـارد 20% المركز"}، الحل الثوري من بيلا إيجيبت. تركيبتنا الاحترافية بمادتين فعالتين تضمن لك القضاء الشامل على هذه الحشرات المزعجة في جميع أطوار حياتها. الأهم من ذلك، ${"بـيد جـارد 20%"} آمن تمامًا على صحة عائلتك وحيواناتك الأليفة، ومثالي لمرضى الحساسية لأنه بدون أي رائحة أو لون ولا يترك أي بقع. ستبدأ في رؤية النتائج المذهلة من اليوم الأول، وخلال أيام قليلة ستودع هذه المشكلة. لضمان عدم عودة البق مرة أخرى، من الضروري تكرار عملية الرش بعد حوالي أسبوعين. عبوة واحدة مركزة (50 مل) تُخفف لتعطيك 5 لتر من المبيد الجاهز، وهي كمية كافية لتغطية منزل متوسط بالكامل (حتى 100 متر مربع). اختر ${"بـيد جـارد 20%"} لبيت نظيف، آمن، ونوم هادئ ومريح.`,
  features: [
    { icon: <Zap />, title: "فعالية فورية وممتدة", description: "يقضي على الحشرات الظاهرة فوراً ويظل فعالاً لفترة طويلة للقضاء على البيض والأجيال الجديدة." },
    { icon: <Shield />, title: "آمن 100% على الأسرة", description: "آمن على الأطفال، كبار السن، مرضى الحساسية، والحيوانات الأليفة عند اتباع التعليمات." },
    { icon: <BugOff />, title: "بدون رائحة مزعجة", description: "خالي تماماً من الروائح النفاذة والألوان، لا يترك أي بقع أو أثر مرئي." },
    { icon: <Clock />, title: "نتائج مثبتة وسريعة", description: "لاحظ الفرق خلال 24 ساعة، وتخلص من المشكلة بالكامل خلال أيام قليلة مع الاستخدام الصحيح." },
    { icon: <Award />, title: "تغطية واسعة للمنزل", description: "العبوة المركزة الواحدة (50 مل) تكفي لتحضير 5 لتر مبيد، تغطي مساحة حتى 100 متر مربع." },
    { icon: <ProductPackageIcon />, title: "عبوة متكاملة للاستخدام", description: "يصلك مع العبوة المركزة: عبوة لتر فارغة للتخفيف، بخاخ عملي للرش، وسرنجة معيارية للتركيز الدقيق." },
  ],
  instructions: [
    { title: "التحضير الأمثل", detail: "رج العبوة المركزة جيداً. أضف 10 مل من Bedguard 20% لكل 1 لتر ماء (العبوة الكاملة 50 مل لـ 5 لتر ماء) باستخدام السرنجة المرفقة في عبوة التخفيف." },
    { title: "أماكن الرش الفعالة", detail: "رش جميع الأماكن المحتملة بدقة: المراتب، جوانب وأسفل الأسرة، الكنب والانتريهات، السجاد والموكيت، الستائر، جميع الشقوق والزوايا، خلف البراويز واللوحات، وداخل الدواليب (بعد إفراغها)." },
    { title: "نصيحة ذهبية", detail: "لا تقم بمسح أو غسل الأسطح المرشوشة لمدة 4 إلى 7 أيام على الأقل لضمان بقاء المفعول." },
    { title: "الرش الوقائي الحاسم", detail: "كرر عملية الرش بنفس الطريقة بعد 10-15 يومًا. هذه الرشة الثانية ضرورية للقضاء التام على أي بيض قد يكون فقس أو أي حشرات كانت مختبئة." },
    { title: "السلامة أولاً ودائماً", detail: "تجنب الرش المباشر على الطعام، أواني الطهي، الوجه أو العينين. اغسل يديك جيداً بالماء والصابون بعد الانتهاء. قم بتهوية المكان بعد الرش." },
    { title: "التخزين الصحيح", detail: "احفظ العبوة الأصلية مغلقة بإحكام في مكان بارد وجاف، بعيداً عن متناول الأطفال والحيوانات الأليفة ومصادر اللهب." },
  ],
};

const bedGuardDoubleOfferData: OfferConfig = {
  id: "BedGuard20_double_offer",
  name: "عرض التوفير الذكي: عبوتين بـيد جـارد 20% المركزتين",
  tagline: "القضاء الكامل على البق وتوفير أكيد! (10 لتر مبيد + شحن مجاني)",
  description: "كمية وفيرة (10 لتر مبيد) تكفي لتطبيق خطة الرش المتكرر بشكل كامل وفعال، وتقضي على المشكلة من جذورها وتوفر فلوس الشحن وتكلفة العبوات الإضافية!",
  price: "500 جنيه",
  originalPrice: "600 جنيه",
  savings: "100 جنيه + شحن مجاني",
  benefits: ["عبوتين مركزتين", "الأدوات كاملة", "شحن مجاني!"],
  imageSrc: "/imgs/Bedguard20-Double-Action-Pack(2Bottles).webp",
  imageAlt: "عرض عبوتين بيد جارد المركز",
  ctaText: "اطلب  العرض  دلوقتى!",
};

const bedGuardReadyToUseSingle = {
  id: "bedguardSpray_alt", // Ensure unique ID if also a main product
  name: "بخاخ بيد جارد المخفف (1 لتر جاهز للرش)",
  storeLink: "/products/bedguardSpray", // Make sure this route exists in your router
  imageSrc: "/imgs/Bedguard-Spray(Ready-to-Use).webp",
  imageAlt: "بخاخ بيد جارد الجاهز",
  description: "نفس الفعالية المثبتة، جاهز للاستخدام مباشرة بدون أي تخفيف. مثالي للرش السريع والمناطق المحدودة.",
  ctaText: "اطلب بخاخ 1 لتر الجاهز",
  ctaIcon: <ShoppingCart className="inline-block ml-2 h-5 w-5" />,
  isFeatured: false,
  analyticsButtonName: "Shop Ready-to-Use Single - bedguardSpray_alt",
  analyticsSectionName: "BedGuard Ready-To-Use Alternatives"
};

const bedGuardReadyToUseTriplePack = {
  id: "BedGuard-SprayBundle_alt", // Ensure unique ID
  name: "عرض التوفير: 3 عبوات بخاخ بيد جارد المخفف (إجمالي 3 لتر)",
  storeLink: "/products/BedGuard-SprayBundle", // Make sure this route exists
  imageSrc: "/imgs/Bedguard-Spray-Triple-Pack (3x1L_Bottles).webp",
  imageAlt: "عرض 3 عبوات بخاخ بيد جارد",
  description: "كمية أكبر لمعالجة أشمل أو رشات متعددة للمساحات الأكبر، بسعر أوفر!",
  ctaText: "اطلب عرض الـ 3 عبوات الجاهزة",
  ctaIcon: <ShoppingCart className="inline-block ml-2 h-5 w-5" />,
  isFeatured: true,
  specialOfferBadgeText: "عرض خاص!",
  analyticsButtonName: "Shop Ready-to-Use Triple Pack - BedGuard-SprayBundle_alt",
  analyticsSectionName: "BedGuard Ready-To-Use Alternatives"
};

// Configuration for BedGuard Landing Page
const bedGuardPageConfig: ProductLandingPageConfig = {
  pageTitle: "بيد جارد 20% - القضاء النهائي على بق الفراش | بيلا جارد",
  analyticsPageName: "BedGuard",
  
  product: bedGuardSingleProductData,
  mainOffer: bedGuardDoubleOfferData,
  
  alternativeProducts: [
    bedGuardReadyToUseSingle,
    bedGuardReadyToUseTriplePack
  ],
  
  testimonialCategory: "Bed-Bugs",

  heroSectionConfig: {
    // Tagline's second line is handled by how tagline is structured in SingleProductConfig or if HeroSection supports sub-tagline
    // shortDescription is augmented here as an example
    shortDescription: `${bedGuardSingleProductData.shortDescription} اكتشف كيف يقضي على البق من جذوره ويمنحك نوماً هادئاً.`,
    ctaPrimaryText: "اكتشف عرض التوفير المذهل!",
    ctaPrimaryLink: `#${bedGuardDoubleOfferData.id}`, // Link to mainOffer section
    ctaSecondaryText: "اقرأ المزيد من التفاصيل",
    ctaSecondaryLink: `#product-details-section-${bedGuardSingleProductData.id}`, // Link to details section (ID needs to match the one generated in ProductLandingPage)
  },

  problemStatementSectionConfig: {
    id: "why-diy-fails-bedguard",
    dataSectionName: "Why DIY Bed Bug Treatments Fail",
    title: "ليه أغلب محاولات التخلص من البق بتفشل؟",
    subtitle: "لو حاولت كتير ولسه المشكلة بترجع، متقلقش أنت مش لوحدك! المشكلة غالبًا بتكون بسبب المعلومات الناقصة دي:",
    problems: [
      { icon: <Clock />, title: "بتعتقد إنه بيموت بسرعة؟", desc: "الحقيقة: البق البالغ ممكن يعيش شهور طويلة، ولو ملقاش أكل أو الجو مش مناسب، بيدخل في حالة سكون ويستخبى في أضيق الشقوق لشهور أكتر!" },
      { icon: <BugOff />, title: "مش فاهم دورة حياته السريعة؟", desc: "الحقيقة: البيضة بتفقس في أسبوع لـ 10 أيام. والحورية لازم تتغذى على الدم 5 مرات عشان تكبر. لو فيه بيض متساب، المشكلة هتتجدد بسرعة." },
      { icon: <Shield />, title: "بتفتكر إنه بيجي في الوساخة بس؟", desc: "الحقيقة: البق بيدور على دم، مش وساخة. ممكن تلاقيه في أنضف البيوت والفنادق الفخمة لو وصلها عن طريق شنطة سفر أو ضيف." },
      { icon: <Zap />, title: "بتوقف المكافحة بدري جدًا؟", desc: "الحقيقة: أول ما اللدغات تخف، بنفتكر إننا خلصنا وبننسى البيض المستخبي أو الحشرات اللي في سكون. الرشة الواحدة مش كافية." },
      { icon: <Info />, title: "بتعالج السرير بس؟", desc: "الحقيقة: البق خبير تخفي وممكن يستخبى في أي مكان: تحت السجاد، ورا البراويز، في شقوق الحيطة، الأثاث، وحتى فيش الكهربا." },
      { icon: <AlertTriangle />, title: "النتيجة؟ المشكلة بترجع تاني!", desc: "كل الأسباب دي بتخلي الحلول المؤقتة غير فعالة على المدى الطويل، وبترجع المعاناة من جديد." },
    ],
     //backgroundColorClass: 'bg-amber-50', // Will use theme default or override here
     //iconTextColorClass: 'text-red-500'   // Will use theme default or override here
  },

  solutionStrategySectionConfig: {
    id: "winning-strategy-bedguard",
    dataSectionName: "Bed Bug Winning Strategy",
    title: "الخطة الذكية للقضاء النهائي: ليه رشة واحدة لا تكفي!",
    icon: <Target className="h-10 w-10" />,
    descriptionLines: [
        "زي ما عرفنا، البق عدو عنيد ودورة حياته سريعة ومراحلها متعددة (بيض - حوريات - حشرات بالغة). عشان نضمن إبادة شاملة ومندييش أي فرصة للمشكلة ترجع تاني، لازم نطبق خطة رش متكاملة تستهدف كل الأطوار دي."
    ],
    highlightedText: "السر في التكرار: رشتين على الأقل، وفي الحالات الصعبة ممكن 3 رشات، بفاصل زمني حوالي 10-15 يوم بين كل رشة والتانية.",
    concludingText: "ده بيضمن القضاء على أي بيض فقس بعد الرشة الأولى، أو أي حشرات كانت مختبئة وظهرت لاحقًا. كده بنكسر دورة حياتهم تمامًا!",
    // Styling can be overridden or rely on theme defaults
  },
  
  finalCtaConfig: {
    id: "bedguard-final-cta",
    dataSectionName: "BedGuard Final CTA",
    title: "جاهز للتخلص من بق الفراش نهائياً وبأذكى طريقة؟",
    description: `اختر عرض العبوتين من ${bedGuardSingleProductData.name} الآن واستفد من خصم خاص وشحن مجاني! استثمر في راحتك وراحة أسرتك واستمتع ببيت نظيف وآمن ونوم هادئ بدون أي قلق.`,
    primaryActionText: "اطلب عرض التوفير (العبوتين) الآن!",
    primaryActionIcon: <Sparkles className="h-6 w-6" />,
    analyticsPrimaryActionName: `Order Double Offer - BedGuard Final CTA`, // More specific for analytics
    analyticsItemId: bedGuardDoubleOfferData.id,
    secondaryActionText: `أو اطلب عبوة واحدة مبدئيًا`,
    analyticsSecondaryActionName: `Order Single - BedGuard Final CTA`,
    onPrimaryActionClick: function (): void {
      throw new Error("Function not implemented.");
    }
  },

  fabConfig: {
    ariaLabel: "اطلب عرض التوفير الآن",
    icon: <><Sparkles className="h-5 w-5 mr-1 inline-block" /> <ShoppingCart className="h-6 w-6 inline-block" /></>,
    isVisible: bedGuardSingleProductData.inStock,
    analyticsButtonName: `Buy Double Offer - BedGuard Mobile FAB`,
    analyticsItemId: bedGuardDoubleOfferData.id,
    onClick: function (): void {
      throw new Error("Function not implemented.");
    }
  },
  
  theme: {
    accentColorClass: 'text-bella',
    secondaryAccentColorClass: 'text-orange-400', // For hero sub-tagline gradient

    heroBgGradientFrom: 'from-white',
    heroBgGradientVia: 'via-gray-50',
    heroBgGradientTo: 'to-bella/5',
    heroIcon: <BugOff className="h-5 w-5" />,

    problemStatement: {
        backgroundColorClass: 'bg-amber-50',
        iconTextColorClass: 'text-red-500',
    },
    productFeatures: {
        sectionBgClass: "bg-gray-50",
        contentWrapperBgClass: "bg-gradient-to-b from-orange-50 to-orange-100",
        iconWrapperBgClass: "bg-bella/10",
        iconWrapperTextClass: "text-bella",
    },
    solutionStrategy: {
        backgroundColorClass: 'bg-gray-50',
        iconWrapperClass: 'bg-bella/10 text-bella',
        highlightedTextColorClass: 'text-bella-dark',
    },
    mainOffer: {
        gradientFromClass: 'from-bella',
        gradientViaClass: 'via-orange-400',
        gradientToClass: 'to-orange-500',
        badgeBgClass: 'bg-yellow-300',
        badgeTextClass: 'text-bella-dark',
        primaryButtonBgClass: 'bg-white',
        primaryButtonTextClass: 'text-bella-dark',
        secondaryActionButtonClass: 'text-white hover:text-yellow-300 font-semibold transition-colors underline',
        patternImageUrl: "/imgs/patterns/pest-pattern-white.svg",
    },
    alternativeProducts: {
        backgroundColorClass: "bg-blue-50",
        featuredBorderClass: 'border-2 border-bella-accent',
        // defaultButtonClass and featuredButtonClass will use component defaults if not specified here
    },
    productDetails: {
        backgroundColorClass: 'bg-white',
        contentBackgroundColorClass: 'bg-gray-50',
        borderColorClass: 'border-gray-200',
        showMoreButtonTextColorClass: 'text-bella',
        showMoreButtonHoverTextColorClass: 'hover:text-bella-dark',
    },
    instructions: {
        backgroundColorClass: 'bg-white',
        instructionItemBgGradientFrom: 'from-gray-50',
        instructionItemBgGradientVia: 'via-white',
        instructionItemBgGradientTo: 'to-gray-50',
        instructionItemBorderClass: 'border-gray-200',
        iconWrapperBgClass: "bg-bella/10",
        iconColorClass: "text-bella",
    },
    finalCallToAction: {
        backgroundColorClass: "bg-gradient-to-br from-bella/5 via-orange-50 to-bella/10",
        titleColorClass: "text-bella-dark",
        primaryButtonClass: "bella-button text-lg flex items-center justify-center gap-3 mx-auto transform hover:-translate-y-1.5 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl px-10 py-4",
        secondaryButtonClass: "text-bella hover:underline font-semibold",
    },
    floatingActionButton: {
        bgColorClass: "bg-bella",
        hoverBgColorClass: "hover:bg-bella-dark",
        focusRingColorClass: "focus:ring-bella-light",
    },
  }
};

const EnhancedBedGuardLanding = () => {
  // Make sure ProductLandingPage is correctly imported and its props match ProductLandingPageConfig
  return <ProductLandingPage config={bedGuardPageConfig} />;
};

export default EnhancedBedGuardLanding;