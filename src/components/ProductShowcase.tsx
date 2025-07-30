// src/components/ProductShowcase.tsx
import { Link } from "react-router-dom";
import {
  Shield,
  Layers2,
  SprayCan,
  PackageCheck,
  Droplets,
  SquareStack,
} from "lucide-react"; // Added PackageCheck, Droplets, SquareStack
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

const ProductShowcase = () => {
  useRevealOnScroll(".reveal", 0.1, true);

  // Emphasize benefits of the concentrated product
  const benefits = [
    {
      icon: <SquareStack className="h-7 w-7 text-bella" />, // Represents multiple liters
      text: "عبوة مركزة واقتصادية: كل ٢٥٠ جنيه توفر لك ٥ لترات من المبيد الفعال.",
    },
    {
      icon: <PackageCheck className="h-7 w-7 text-bella" />,
      text: "كل اللى محتاجه فى البوكس: بيوصلك معاها عبوة تخفيف لتر، بخاخ، وسرنجة عشان تخفف صح  .",
    },
    {
      icon: <Layers2 className="h-7 w-7 text-bella" />,
      text: "تركيبة مزدوجة فائقة القوة: تقضي على البق والبراغيث بالملامسة وعن طريق الجهاز الهضمي.",
    },
    {
      icon: <SprayCan className="h-7 w-7 text-bella" />,
      text: "آمن تماماً على أسرتك: بدون رائحة، مش بيسيب بقع، ومناسب للاستخدام حول الأطفال والحيوانات الأليفة.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="bella-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="reveal flex justify-center order-1 md:order-1">
            {" "}
            {/* Image first on mobile */}
            <div className="relative">
              <div className="absolute inset-0 bg-bella/20 rounded-full blur-3xl opacity-50 transform scale-75"></div>
              <img
                src="/imgs/BedGuard-Landing.webp" // Main product
                alt="بيد جارد 20% المركز"
                className="relative z-10 transform hover:scale-105 transition-transform duration-700 max-w-[250px] md:max-w-xs lg:max-w-sm"
              />
              {/* Optional: Small inset showing the kit 
              <img
                src="/imgs/kit-placeholder.png" // REPLACE with actual image of bottle, syringe, spray
                alt="عدة التخفيف المتكاملة"
                className="absolute z-20 bottom-0 -right-10 md:-right-16 w-20 h-20 md:w-28 md:h-28 object-contain bg-white p-1 rounded-full shadow-lg border border-bella-light"
              />
              */}
            </div>
          </div>

          <div className="reveal order-2 md:order-2">
            <div className="inline-block bella-gradient px-4 py-1.5 rounded-full mb-3 text-sm">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>الأكثر مبيعاً وفعالية</span>
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              بيد جارد 20% <span className="text-bella">المركز</span>
            </h2>
            <p className="text-xl text-gray-700 font-semibold mb-5">
              الحل النهائي والأكثر توفيراً لعدوى البق الشديدة والبراغيث!
            </p>
            <p className="text-gray-600 mb-6">
              مع بيد جارد المركز، وداعاً للبق للأبد. تركيبة قوية تعمل بالملامسة
              المباشرة وبتقضي على الحشرات نهائياً، مع ضمان الأمان التام لعيلتك.
            </p>

            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm border-l-4 border-bella-light hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 mt-0.5">{benefit.icon}</div>
                  <p className="text-gray-700 text-sm md:text-base">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center md:text-right">
              <Link
                to="/products/BedGuard20" // Make sure this ID matches your product ID for the concentrated version
                className="bella-button text-lg flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto"
              >
                <span>اطلبه دلوقتى (بــ ٢٥٠ جنيه بس هتعمل ٥ لتر!)</span>
              </Link>
              <p className="mt-3 text-sm text-gray-500">
                عبوة تخفيف + بخاخ + سرنجة + شحن مجاني لما تطلب عبوتين!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
