// src/components/OfferHighlightBanner.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Zap, Truck, Package } from "lucide-react"; // Or other relevant icons

const OfferHighlightBanner: React.FC = () => {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-r from-bella to-orange-400 text-white reveal">
      <div className="bella-container text-center">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center">
            <Package className="h-10 w-10 mb-2 opacity-90" />
            <h3 className="text-2xl font-extrabold mb-1">عبوة مركزة !</h3>
            <p className="text-lg  font-semibold opacity-90">
              عبوة واحدة بـ ٢٥٠ جنيه = ٥ لتر مبيد جاهز.
            </p>
            <p className="text-lg font-semibold opacity-90">+</p>
            <p className="text-lg font-semibold opacity-90">
              كامل أدوات التخفيف
            </p>
            <p className="text-base  opacity-90">عبوة لتر + بخاخ + سرنجة</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="h-10 w-10 mb-2 opacity-90" />
            <h3 className="text-2xl font-extrabold mb-1">شحن مجاني!</h3>
            <p className="text-lg font-base opacity-90">
              عند طلب عبوتين أو أكثر من أي مبيد مركز.
            </p>
          </div>
          <div className="flex flex-col items-center mt-4 md:mt-0">
            <Link
              to="/products" // Or link directly to concentrated products category
              className="bg-white text-bella-dark font-bold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-colors text-lg transform hover:scale-105"
            >
              استيفد من العرض الآن!
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferHighlightBanner;
