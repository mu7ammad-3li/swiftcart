import { Shield, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Product } from "@/data/products";
import AnalyticsService from "@/services/analyticsService"; // Import
interface ProductInfoProps {
  product: Product; // Expects a single prop named 'product' of type 'Product'
}
const ProductInfo = ({ product }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      AnalyticsService.trackAddToCart(product, quantity);
      addItem(product, quantity);
      toast({
        title: "تمت الإضافة إلى السلة",
        description: `تمت إضافة ${quantity} من ${product.name} إلى سلة التسوق`,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      AnalyticsService.trackAddToCart(product, quantity);
      addItem(product, quantity);
      navigate("/checkout");
    }
  };

  return (
    <div className="reveal opacity-0">
      <div className="inline-block bella-gradient px-4 py-2 rounded-full mb-4">
        <span className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span>منتج متميز</span>
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl text-gray-600 mb-6">{product.shortDescription}</p>
      <div className="price-section mt-2">
        {product.onSale && product.salePrice ? (
          // If on sale and salePrice exists
          <div className="flex items-baseline gap-2">
            {/* Sale Price - Make it prominent */}
            <span className="text-3xl font-bold text-bella mb-8">
              {product.salePrice}
            </span>
            {/* Original Price - Smaller and crossed out */}
            <span className="text-2xl font-bold text-bella-alert mb-8 line-through">
              {product.price}
            </span>
          </div>
        ) : (
          // If not on sale, just show the original price
          <span className="text-3xl font-bold text-bella mb-8">
            {product.price}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-gray-700">الكمية:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={decreaseQuantity}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-4 py-2">{quantity}</span>
          <button
            onClick={increaseQuantity}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          className="bella-button w-full flex items-center justify-center gap-2"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>أضف إلى السلة</span>
        </Button>

        <Button
          className="bg-bella-dark hover:bg-bella text-white w-full"
          onClick={handleBuyNow}
        >
          <span>شراء الآن</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
