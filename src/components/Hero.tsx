// src/components/Hero.tsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Shield, Bug, BugOff, Users } from "lucide-react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-gradient-to-b from-white to-gray-50">
      <div
        ref={heroRef}
        className="bella-container grid grid-cols-1 md:grid-cols-2 gap-12 items-center  reveal" // <--- ADD 'reveal' HERE
      >
        <div className="order-2 md:order-1">
          <div className="inline-block bg-bella/10 text-bella px-4 py-2 rounded-full mb-4">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {/* Consider a more specific benefit here if possible */}
              <span>حماية مضمونة لمنزلك وعملك</span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            إتخلص من قلق الحشرات نهائياً! {/* More direct pain/solution */}
            <span className="block text-bella text-3xl md:text-4xl mt-2">
              حلول بيلا إيجيبت الآمنة والفعالة
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            بنقدملك تركيبات متطورة و متخصصة عشان تقضى نهائي على البق، الصراصير،
            والنمل، آمنة تماماً على أسرتك وحيواناتك الأليفة. استمتع ببيئة صحية
            وراحة بال دايمة.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
            <Link
              to="/products"
              className="bella-button flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <BugOff className="h-5 w-5" />
              <span>اكتشف منتجاتنا الفعالة</span>
            </Link>
            <Link
              to="/testimonials"
              className="border border-bella text-bella hover:bg-bella hover:text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Users className="h-5 w-5" />{" "}
              {/* Changed icon to Users for "customers" */}
              <span>آراء عملائنا</span>
            </Link>
          </div>
          {/* Upsell / Offer Teaser */}
          <p className="mt-6 text-md text-gray-700">
            Psst!{" "}
            <Link
              to="/products"
              className="text-bella font-semibold hover:underline"
            >
              وفر أكثر مع عبواتنا المركزة
            </Link>{" "}
            - شحن مجاني عند طلب عبوتين!
          </p>
        </div>{" "}
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-bella/30 to-bella/5 rounded-full blur-3xl opacity-30"></div>
            <img
              src="./imgs/Banner.webp"
              alt="أقوى مبيد لعلاج حشرة البق نهائياً في مصر "
              className="relative z-10 transform hover:scale-105 transition-transform duration-500 max-w-[280px] md:max-w-full"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
