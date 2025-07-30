import { useEffect, useRef } from "react";
import { Bug, Rat, Shield, BugOff } from "lucide-react";

const services = [
  {
    icon: <Bug className="h-10 w-10 text-bella" />,
    title: "مكافحة الحشرات",
    description:
      "خدمات متكاملة للقضاء على الحشرات المنزلية والتجارية بطرق آمنة وفعالة.",
  },
  {
    icon: <Rat className="h-10 w-10 text-bella" />,
    title: "مكافحة القوارض",
    description:
      "حلول متخصصة للتخلص من القوارض ومنع عودتها بأحدث الأساليب والتقنيات.",
  },
  {
    icon: <Shield className="h-10 w-10 text-bella" />,
    title: "الوقاية والحماية",
    description:
      "برامج وقائية دورية لحماية المنازل والمنشآت من الآفات قبل ظهورها.",
  },
  {
    icon: <BugOff className="h-10 w-10 text-bella" />,
    title: "مكافحة للمنشآت",
    description:
      "خدمات مخصصة للشركات والمصانع والمطاعم تلبي المعايير الصحية العالمية.",
  },
];

const Services = () => {
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="bella-container">
        <div className="text-center mb-16">
          <h2 className="section-title inline-block mx-auto after:right-1/2 after:translate-x-1/2">
            خدماتنا المتميزة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم خدمات احترافية متكاملة لمكافحة مختلف أنواع الآفات والحشرات
            بأحدث التقنيات والمنتجات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="reveal glass-card hover:bg-bella/5 p-8 transition-all duration-300 cursor-pointer"
            >
              <div className="bg-bella/10 p-4 rounded-xl inline-block mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
