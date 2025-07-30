import { useEffect, useRef } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

// src/components/Features.tsx
import {
  ShieldCheck,
  Microscope,
  BugOff,
  SmilePlus,
  HeartHandshake,
} from "lucide-react"; // Added SmilePlus

const features = [
  {
    icon: <HeartHandshake className="h-8 w-8 text-bella" />,
    title: "أمان تام لأسرتك", // Emphasize safety
    description:
      "اطمئن على صحة أطفالك وحيواناتك الأليفة. منتجاتنا آمنة تماماً عند الاستخدام حسب التعليمات وبدون روائح مزعجة.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-bella" />,
    title: "فعالية مثبتة وقوية",
    description:
      "وداعاً للحشرات! تركيباتنا المزدوجة تقضي على الآفات بسرعة وتضمن عدم عودتها لفترة طويلة.",
  },
  {
    icon: <SmilePlus className="h-8 w-8 text-bella" />, // Icon for ease of use/convenience
    title: "سهولة في الاستخدام",
    description:
      "تعليمات واضحة مع عبوات مركزة واقتصادية. نوفر لك كل ما تحتاجه لتطبيق سهل وفعال بنفسك.",
  },
  {
    icon: <Microscope className="h-8 w-8 text-bella" />,
    title: "خبرة وتخصص",
    description:
      "مبيدات متخصصة لكل نوع من الحشرات (البق، الصراصير، النمل) بناءً على أحدث الأبحاث لضمان أفضل النتائج.",
  },
];
const Features = () => {
  useRevealOnScroll(".reveal", 0.1, true); // Or useRevealOnScroll(".reveal", 0.1, true);

  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="py-20 bg-white">
      <div className="bella-container">
        <div className="text-center mb-16">
          <h2 className="section-title inline-block mx-auto after:right-1/2 after:translate-x-1/2">
            ليه تختار منتجات بيلا إيجبت؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            منتجات متخصصة بتركيبات فعالة للقضاء على جميع أنواع الآفات والحشرات
            بطريقة آمنة وفعالة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
              className="reveal glass-card p-8 flex flex-col items-center text-center"
            >
              <div className="bg-bella/10 p-4 rounded-full mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
