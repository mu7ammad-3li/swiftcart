import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarCartButton from "../components/NavbarCartButton";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar cartButton={<NavbarCartButton />} />

      {/* Page Header */}
      <div className="bg-white text-bella pt-36 pb-16">
        <div className="bella-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">اتصل بنا</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            نحن هنا للإجابة على جميع استفساراتك ومساعدتك في الحصول على أفضل حلول
            مكافحة الآفات
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <section className="py-20">
        <div className="bella-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-bella/10 p-4 rounded-full inline-flex justify-center items-center mb-6">
                <Phone className="h-8 w-8 text-bella" />
              </div>
              <h3 className="text-xl font-bold mb-4">اتصل بنا</h3>
              <p className="text-gray-600">-01148481374</p>
              <p className="text-gray-600">01110086949</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-bella/10 p-4 rounded-full inline-flex justify-center items-center mb-6">
                <Mail className="h-8 w-8 text-bella" />
              </div>
              <h3 className="text-xl font-bold mb-4">البريد الإلكتروني</h3>
              <p className="text-gray-600 mb-2">info@bellaegypt.com</p>
              <p className="text-gray-600">support@bellaegypt.com</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-bella/10 p-4 rounded-full inline-flex justify-center items-center mb-6">
                <MapPin className="h-8 w-8 text-bella" />
              </div>
              <h3 className="text-xl font-bold mb-4">العنوان</h3>
              <p className="text-gray-600 mb-2">القاهرة، مصر</p>
              <p className="text-gray-600">حدائق الزيتون </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">ارسل رسالة</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    الاسم
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bella focus:border-transparent"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bella focus:border-transparent"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الموضوع
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bella focus:border-transparent"
                  placeholder="أدخل موضوع رسالتك"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bella focus:border-transparent"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-bella text-white py-3 px-6 rounded-md hover:bg-bella/90 transition-colors font-medium"
              >
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="mb-20">
        <div className="bella-container">
          <div className="rounded-lg overflow-hidden h-[400px] shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221747.86831282265!2d31.10029845!3d30.059482450000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1624979122887!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="خريطة الموقع"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
