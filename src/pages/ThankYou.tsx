import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Import useToast

const ThankYou = () => {
  const { toast } = useToast();
  const location = useLocation();
  const orderId = location.state.orderId; // Optional: Get order ID if passed

  // Show the success toast when the page loads
  useEffect(() => {
    toast({
      title: "تم تقديم الطلب بنجاح",
      description: "سنتواصل معك قريبًا لتأكيد الطلب وتفاصيل الشحن.",
      variant: "default", // Or your success variant
      duration: 3000, // Optional: Keep toast visible longer
    });
    // Scroll to top
    window.scrollTo(0, 0);
  }, [toast, location.state]); // Dependency array includes toast

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Note: No cart button needed on thank you page usually */}
      <Navbar />
      <section className="flex-grow pt-32 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="bella-container max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 md:h-20 md:w-20 text-green-500 mx-auto" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              تم تقديم طلبك بنجاح!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              شكرًا لك على طلبك. سنتواصل معك قريبًا لتأكيد الطلب وتفاصيل الشحن.
            </p>
            {/* Optional: Display Order ID if available */}
            {orderId && (
              <>
                <p className="text-xl text-bella-500 mb-8">
                  كود طلبك هو: <span className="font-semibold">{orderId}</span>
                </p>
                <p className="text-xl text-bella-dark mb-8">
                  احتفظ بهذا الكود لتتبع الطلب{" "}
                </p>
              </>
            )}
            <Link to="/" className="bella-button inline-block">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ThankYou;
