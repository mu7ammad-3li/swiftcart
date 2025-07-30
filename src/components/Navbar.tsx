import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

type NavbarProps = {
  cartButton?: React.ReactNode;
};

const Navbar = ({ cartButton }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-3 bg-white shadow-lg" : "py-5 bg-transparent"
      }`}
    >
      <div className="bella-container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-bella" />
          <span className="text-2xl font-bold">Bella Egypt</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          <Link
            to="/"
            className={`px-4 py-2 font-medium transition-colors ${
              location.pathname === "/"
                ? "text-bella"
                : "text-gray-700 hover:text-bella"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            to="/products"
            className={`px-4 py-2 font-medium transition-colors ${
              location.pathname.includes("/products")
                ? "text-bella"
                : "text-gray-700 hover:text-bella"
            }`}
          >
            المتجر
          </Link>
          <Link // Blog Link
            to="/blog"
            className={`px-4 py-2 font-medium transition-colors ${
              location.pathname.includes("/blog")
                ? "text-bella"
                : "text-gray-700 hover:text-bella"
            }`}
          >
            معلومات تهمك
          </Link>
          <Link
            to="/testimonials"
            className={`px-4 py-2 font-medium transition-colors ${
              location.pathname === "/about"
                ? "text-bella"
                : "text-gray-700 hover:text-bella"
            }`}
          >
            أراء عملائنا
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 font-medium transition-colors ${
              location.pathname === "/about"
                ? "text-bella"
                : "text-gray-700 hover:text-bella"
            }`}
          >
            من نحن
          </Link>
          <Link
            to="/contact"
            className={`px-4 py-2 font-medium transition-colors ${
              location.pathname === "/contact"
                ? "text-bella"
                : "text-gray-700 hover:text-bella"
            }`}
          >
            اتصل بنا
          </Link>
        </nav>

        {/* Cart Button & Mobile Menu Trigger */}
        <div className="flex items-center gap-4">
          {cartButton}

          {/* Mobile Menu Trigger */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-x-0 top-[72px] bg-white shadow-lg transition-all duration-300 z-50 ${
            mobileMenuOpen
              ? "max-h-screen py-4"
              : "max-h-0 overflow-hidden py-0"
          }`}
        >
          <div className="bella-container flex flex-col space-y-4">
            <Link
              to="/"
              className={`px-4 py-2 font-medium transition-colors ${
                location.pathname === "/"
                  ? "text-bella"
                  : "text-gray-700 hover:text-bella"
              }`}
            >
              الرئيسية
            </Link>
            <Link
              to="/products"
              className={`px-4 py-2 font-medium transition-colors ${
                location.pathname.includes("/products")
                  ? "text-bella"
                  : "text-gray-700 hover:text-bella"
              }`}
            >
              المتجر
            </Link>
            <Link // Blog Link
              to="/blog"
              className={`px-4 py-2 font-medium transition-colors ${
                location.pathname.includes("/blog")
                  ? "text-bella"
                  : "text-gray-700 hover:text-bella"
              }`}
            >
              معلومات تهمك
            </Link>
            <Link
              to="/testimonials"
              className={`px-4 py-2 font-medium transition-colors ${
                location.pathname === "/about"
                  ? "text-bella"
                  : "text-gray-700 hover:text-bella"
              }`}
            >
              أراء عملائنا
            </Link>

            <Link
              to="/about"
              className={`px-4 py-2 font-medium transition-colors ${
                location.pathname === "/about"
                  ? "text-bella"
                  : "text-gray-700 hover:text-bella"
              }`}
            >
              من نحن
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 font-medium transition-colors ${
                location.pathname === "/contact"
                  ? "text-bella"
                  : "text-gray-700 hover:text-bella"
              }`}
            >
              اتصل بنا
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
