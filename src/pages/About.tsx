import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarCartButton from "../components/NavbarCartButton";
import { Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar cartButton={<NavbarCartButton />} />

      {/* Page Header */}
      <div className="bg-white text-bella pt-36 pb-16">
        <div className="bella-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">من نحن</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            تعرف على قصتنا ومهمتنا في مكافحة الآفات والحشرات بطرق آمنة وفعالة
          </p>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-20">
        <div className="bella-container">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="h-12 w-12 text-bella" />
                <h2 className="text-3xl font-bold">قصتنا</h2>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                تأسست شركة بيلا مصر منذ أكثر من 5 أعوام بهدف توفير حلول فعالة
                لمكافحة الآفات والحشرات بطرق آمنة وصديقة للبيئة، وذلك استجابة
                للحاجة المتزايدة لخدمات مكافحة الآفات ذات الجودة العالية في
                السوق المصري.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                منذ البداية، كان تركيزنا منصباً على الابتكار والبحث المستمر
                لتقديم أفضل المنتجات والخدمات التي تلبي احتياجات عملائنا مع
                الالتزام بأعلى معايير السلامة والجودة.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                اليوم، تفتخر بيلا مصر بكونها واحدة من الشركات الرائدة في مجال
                مكافحة الآفات في مصر، حيث نخدم آلاف العملاء سنوياً من الأفراد
                والشركات والمؤسسات الحكومية.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/imgs/Banner.webp"
                  alt="فريق بيلا مصر"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-gray-50">
        <div className="bella-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">مهمتنا وقيمنا</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              نسعى لخلق بيئة آمنة وصحية خالية من الآفات من خلال تقديم منتجات
              وخدمات متميزة تركز على العميل والبيئة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-bella/10 p-4 rounded-xl inline-block mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-bella"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">الجودة</h3>
              <p className="text-gray-600">
                نلتزم بتقديم منتجات وخدمات ذات جودة عالية تفوق توقعات عملائنا
                وتضمن نتائج فعالة ودائمة.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-bella/10 p-4 rounded-xl inline-block mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-bella"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">الابتكار</h3>
              <p className="text-gray-600">
                نستثمر في البحث والتطوير لإيجاد حلول مبتكرة وفعالة لمكافحة
                الآفات بطرق تحافظ على سلامة الإنسان والبيئة.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-bella/10 p-4 rounded-xl inline-block mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-bella"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">المسؤولية البيئية</h3>
              <p className="text-gray-600">
                نلتزم بتقديم منتجات وخدمات صديقة للبيئة تقلل من الأثر البيئي
                وتحافظ على التوازن الطبيعي للنظام البيئي.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
