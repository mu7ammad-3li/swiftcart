
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import NavbarCartButton from "@/components/NavbarCartButton";

const ProductNotFound = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar cartButton={<NavbarCartButton />} />
      <div className="bella-container pt-36 pb-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">المنتج غير متوفر</h1>
          <p className="text-gray-600 mb-8">عذراً، المنتج الذي تبحث عنه غير موجود.</p>
          <Link to="/products" className="bella-button">
            العودة للمتجر
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductNotFound;
