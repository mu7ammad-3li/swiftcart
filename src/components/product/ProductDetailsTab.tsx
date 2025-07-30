import { useState } from "react";
import { ShieldCheck, BugOff } from "lucide-react";
import { Product } from "@/data/products";

interface ProductDetailsTabProps {
  product: Product;
}

const ProductDetailsTab = ({ product }: ProductDetailsTabProps) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="border-t">
      <div className="p-8">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "description"
                ? "border-b-2 border-bella text-bella"
                : "text-gray-600 hover:text-bella"
            }`}
            onClick={() => setActiveTab("description")}
          >
            الوصف
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "features"
                ? "border-b-2 border-bella text-bella"
                : "text-gray-600 hover:text-bella"
            }`}
            onClick={() => setActiveTab("features")}
          >
            المميزات
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "instructions"
                ? "border-b-2 border-bella text-bella"
                : "text-gray-600 hover:text-bella"
            }`}
            onClick={() => setActiveTab("instructions")}
          >
            إرشادات الاستخدام
          </button>
        </div>

        <div className="py-6">
          {activeTab === "description" && (
            <div className="reveal opacity-0">
              <p className="text-gray-700 leading-relaxed">
                {product.details.longDescription}
              </p>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-4 reveal opacity-0">
              {product.details.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-bella mt-1" />
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "instructions" && (
            <div className="space-y-4 reveal opacity-0">
              {product.details.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <BugOff className="h-6 w-6 text-bella mt-1" />
                  <p className="text-gray-700">{instruction}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsTab;
