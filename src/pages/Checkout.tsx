// src/components/Checkout.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, ChevronRight, Trash2 } from "lucide-react";
import NavbarCartButton from "@/components/NavbarCartButton";
import Spinner from "@/components/ui/Spinner";
import AnalyticsService from "@/services/analyticsService"; // Import
// Data models
import { Customer } from "@/data/customer";
import { Order, OrderItem, InternalNote } from "@/data/order"; //
// Define the type for the payload, excluding the timestamp
type InitialNotePayload = Omit<InternalNote, "timestamp">; //
// Services
// === CHANGE: Import findOrCreateCustomer instead of createCustomer ===
import { findOrCreateCustomer } from "@/services/customerService"; // Import updated customer service function
import { createOrder } from "@/services/orderService";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../lib/firebase";

// Utils
import { formatPhoneNumber } from "@/lib/utils";

/**
 * Helper function to extract numeric price from string or number
 */
const extractNumericPrice = (
  priceInput: string | number | undefined | null
): number => {
  if (priceInput === null || priceInput === undefined) return 0;
  const strPrice = String(priceInput);
  return parseFloat(strPrice.replace(/[^\d.-]/g, "")) || 0;
};

const Checkout = () => {
  const { state, itemCount, totalPrice, clearCart, removeItem } = useCart();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    secondPhone: "",
    address: "", // Maps to fullAdress
    city: "",
    governorate: "",
    landMark: "",
    notes: "",
  });

  // Scroll to top and track InitiateCheckout
  useEffect(() => {
    window.scrollTo(0, 0);
    if (state.items.length > 0) {
      // Check items exist before tracking
      const content_ids = state.items.map((item) => item.id);
      const value = state.items.reduce(
        (sum, item) =>
          sum +
          extractNumericPrice(item.onSale ? item.salePrice : item.price) *
            item.quantity, // Use extractNumericPrice for safety
        0
      );
      const num_items = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      AnalyticsService.trackInitiateCheckout(state.items);
    }
  }, [state.items]); // Depend on state.items

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = (productId: string) => {
    if (typeof removeItem === "function") {
      removeItem(productId);
      toast({
        title: "تمت إزالة المنتج",
        description: "تم تحديث سلة التسوق.",
        variant: "default",
      });
    } else {
      console.error("removeItem function is not available in CartContext");
      toast({
        title: "خطأ",
        description: "لم نتمكن من إزالة المنتج.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (state.items.length === 0) {
        toast({
          title: "سلة فارغة",
          description: "لا يمكنك إتمام الطلب بسلة فارغة.",
          variant: "destructive",
        });
        return;
      }

      // --- Required Fields Validation ---
      const requiredFields = {
        fullName: "الاسم الكامل",
        phone: "رقم الهاتف",
        governorate: "المحافظة",
        city: "المدينة / المنطقة",
        address: "العنوان التفصيلي",
      };

      const missingFields: string[] = [];
      for (const [key, label] of Object.entries(requiredFields)) {
        if (!(formData[key as keyof typeof formData] as string).trim()) {
          missingFields.push(label);
        }
      }

      if (missingFields.length > 0) {
        toast({
          title: "بيانات غير مكتملة",
          description: `الرجاء ملء الحقول المطلوبة: ${missingFields.join("، ")}`,
          variant: "destructive",
        });
        return;
      }

      // --- Format Phone Numbers ---
      const formattedPhone = formatPhoneNumber(formData.phone); //
      const formattedSecondPhone = formatPhoneNumber(formData.secondPhone); //

      // --- Phone Number Validation ---
      if (!formattedPhone) {
        toast({
          title: "رقم الهاتف مطلوب",
          description: "الرجاء إدخال رقم هاتف صحيح.",
          variant: "destructive",
        });
        return;
      }
      // Basic Egyptian phone number check (starts with 01, length 11)
      if (!/^01[0-9]{9}$/.test(formattedPhone)) {
        toast({
          title: "رقم الهاتف غير صحيح",
          description: `يجب أن يكون رقم الهاتف المصري 11 رقمًا ويبدأ بـ "01". الرقم المدخل: ${formattedPhone}`,
          variant: "destructive",
        });
        return;
      }
      if (
        formData.secondPhone.trim() &&
        (!formattedSecondPhone || !/^01[0-9]{9}$/.test(formattedSecondPhone))
      ) {
        toast({
          title: "رقم الهاتف الثانوي غير صحيح",
          description: `إذا تم إدخال رقم هاتف ثانوي، فيجب أن يكون رقمًا مصريًا صحيحًا (11 رقمًا ويبدأ بـ "01"). ${
            formattedSecondPhone ? `الرقم المدخل: ${formattedSecondPhone}` : ""
          }`,
          variant: "destructive",
        });
        return;
      }
      // --- End Phone Number Validation ---

      // Track AddPaymentInfo (optional)
      AnalyticsService.trackAddPaymentInfo();
      // 1. Prepare Customer Data
      const customerData: Omit<Customer, "id"> = {
        //
        fullName: formData.fullName.trim(),
        email: formData.email.trim() || undefined,
        phone: formattedPhone, // Use validated & formatted phone
        secondPhone: formattedSecondPhone || undefined,
        address: {
          //
          governorate: formData.governorate.trim(),
          city: formData.city.trim(),
          landMark: formData.landMark.trim() || "", // Use empty string if not provided
          fullAdress: formData.address.trim(),
        },
        status: "active",
      };

      // === CHANGE: Use findOrCreateCustomer ===
      // 2. Find or Create Customer using the Service
      console.log(
        "Attempting to find or create customer with phone:",
        formattedPhone
      );
      const customerId = await findOrCreateCustomer(customerData); // - This now returns the phone number ID
      console.log("Obtained customer ID (phone):", customerId);

      // 3. Prepare Order Items
      let calculatedTotal = 0;
      const orderItems: OrderItem[] = state.items.map((item) => {
        //
        const isOnSale = !!(
          item.onSale &&
          item.salePrice &&
          extractNumericPrice(item.salePrice) > 0
        ); // More robust sale check
        const numericOriginalPrice = extractNumericPrice(item.price);
        const actualPriceInput = isOnSale ? item.salePrice : item.price;
        const numericActualPrice = extractNumericPrice(actualPriceInput);

        calculatedTotal += numericActualPrice * item.quantity;

        return {
          quantity: item.quantity,
          originalPrice: numericOriginalPrice, // Store numeric price
          priceAtPurchase: numericActualPrice, // Store numeric price paid
          wasOnSale: isOnSale,
          product: {
            //
            id: item.id,
            name: item.name,
          },
        };
      });

      // 4. Calculate Final Total (including shipping)
      const shippingCost = calculatedTotal >= 300 ? 0 : 50; // Example: Free shipping over 300 EGP item total
      const finalTotal = calculatedTotal + shippingCost;

      // Sanity check item total vs cart context total (optional)
      if (Math.abs(calculatedTotal - totalPrice) > 0.01) {
        console.warn(
          `Calculated item total (${calculatedTotal}) differs from context item total (${totalPrice}). Using calculated item total for order.`
        );
      }

      // 5. Prepare Order Data
      // 5. Prepare Order Data (as before, excluding notes and internalNotes)
      const orderDataBase: Omit<Order, "id" | "notes" | "internalNotes"> = {
        customerId: customerId,
        items: orderItems,
        orderDate: new Date(),
        totalAmount: finalTotal,
        status: "pending",
        shippingAddress: {
          governorate: customerData.address.governorate,
          city: customerData.address.city,
          landMark: customerData.address.landMark,
          fullAdress: customerData.address.fullAdress,
        },
        paymentMethod: {
          type: "cash_on_delivery", // Default payment method
          details: {}
        }
      };

      // --- Prepare the initialNotePayload ---
      const customerInfoSummary = `
        Name: ${customerData.fullName}
        Phone: ${customerData.phone}${
        customerData.secondPhone ? ` / ${customerData.secondPhone}` : ""
      }
        Address: ${customerData.address.fullAdress}, ${
        customerData.address.city
      }, ${customerData.address.governorate}
        Landmark: ${customerData.address.landMark || "N/A"}
        User Notes: ${formData.notes.trim() || "None"}
      `.trim();

      const initialNote: InitialNotePayload = {
        title: "Order Placed via Checkout",
        summary: customerInfoSummary, // Include customer details and user notes
        createdBy: "system", // As requested
      };
      // --- End preparing initialNotePayload ---

      // 6. Combine base order data, customer notes, and prepare for service call
      const orderDataForService: Omit<Order, "id" | "internalNotes"> = {
        ...orderDataBase,
        notes: formData.notes.trim() || undefined, // Add customer notes separately
      };
      // 7. Save Order using the Service, passing the initial note
      console.log(
        "Attempting to create order with initial note:",
        orderDataForService,
        initialNote
      );
      // === Pass orderData AND the initialNote ===
      const newOrderId = await createOrder(orderDataForService, initialNote);
      console.log("Order created with ID:", newOrderId);
      // 7. Track Purchase Event with Meta Pixel
      AnalyticsService.trackPurchase(orderDataForService, newOrderId); // Success actions
      setOrderPlaced(true); // Show success screen
      if (typeof clearCart === "function") {
        clearCart();
      } else {
        console.error("clearCart function not available in CartContext");
      }

      // Navigate to thank-you page AFTER state update & tracking
      navigate("/thank-you", { state: { orderId: newOrderId, orderDataBase } });
    } catch (error) {
      console.error("Error during checkout process: ", error);
      setIsSubmitting(false); // Reset submitting state on error
      toast({
        title: "حدث خطأ",
        description:
          error instanceof Error
            ? error.message
            : "لم نتمكن من حفظ طلبك. يرجى المحاولة مرة أخرى أو التواصل معنا.",
        variant: "destructive",
      });
    }
    // No finally block needed here as state is reset in success/error paths
  };

  // --- RENDER LOGIC ---

  // Order Placed Screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar cartButton={<NavbarCartButton />} />
        <section className="flex-grow pt-32 pb-16 bg-gray-50 flex items-center justify-center">
          <div className="bella-container max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 md:h-20 md:w-20 text-green-500 mx-auto" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                تم تقديم طلبك بنجاح
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                شكرًا لك على طلبك! سنتواصل معك قريبًا لتأكيد الطلب وتفاصيل
                الشحن.
              </p>
              <Link to="/" className="bella-button inline-block">
                العودة للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Empty Cart Screen
  if (!isSubmitting && state.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar cartButton={<NavbarCartButton />} />
        <section className="flex-grow pt-32 pb-16 bg-gray-50 flex items-center justify-center">
          <div className="bella-container text-center">
            <h1 className="text-3xl font-bold mb-4">سلة التسوق فارغة</h1>
            <p className="text-gray-600 mb-8">
              لا توجد منتجات في سلة التسوق الخاصة بك.
            </p>
            <Link to="/products" className="bella-button">
              تسوق الآن
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Checkout Form Screen
  // Calculate dynamic shipping cost and final total for display
  const displayItemTotal = state.items.reduce(
    (sum, item) =>
      sum +
      extractNumericPrice(item.onSale ? item.salePrice : item.price) *
        item.quantity,
    0
  );
  const displayShippingCost = displayItemTotal >= 300 ? 0 : 50; // Use same logic as calculation
  const displayFinalTotal = displayItemTotal + displayShippingCost;

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartButton={<NavbarCartButton />} />
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="bella-container">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              to="/products"
              className="text-bella hover:text-bella-dark flex items-center gap-2 transition-colors w-fit"
            >
              <ChevronRight className="h-5 w-5" />
              <span>العودة للمتجر</span>
            </Link>
          </div>
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold">معلومات الشحن والتواصل</h2>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="p-6 space-y-6"
                  noValidate // Use JS validation
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Inputs */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        placeholder="ادخل اسمك بالكامل"
                        autoComplete="name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel" // Use tel for better mobile UX
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        placeholder="01xxxxxxxxx"
                        dir="ltr" // Keep LTR for phone numbers
                        autoComplete="tel"
                        maxLength={15} // Allow slightly more for spaces/prefix
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="governorate">المحافظة *</Label>
                      <Input
                        id="governorate"
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        placeholder="مثال: القاهرة"
                        autoComplete="address-level1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة / المنطقة *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        placeholder="مثال: مدينة نصر"
                        autoComplete="address-level2"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">العنوان التفصيلي *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        placeholder="مثال: 10 شارع النصر، عمارة 5، الدور 3، شقة 10"
                        autoComplete="street-address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondPhone">
                        رقم هاتف اخر (اختياري)
                      </Label>
                      <Input
                        id="secondPhone"
                        name="secondPhone"
                        type="tel"
                        value={formData.secondPhone}
                        onChange={handleChange}
                        placeholder="رقم بديل للتواصل"
                        dir="ltr"
                        autoComplete="tel-national"
                        maxLength={15}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@domain.com"
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="landMark">علامة مميزة (اختياري)</Label>
                      <Input
                        id="landMark"
                        name="landMark"
                        value={formData.landMark}
                        onChange={handleChange}
                        placeholder="مثال: بجوار مسجد السلام"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">ملاحظات الطلب (اختياري)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="أي تعليمات خاصة بالتوصيل أو الطلب..."
                        rows={3}
                      />
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-bella hover:bg-bella-dark text-white py-3 text-lg font-semibold transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      disabled={isSubmitting || state.items.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          {/* Optional: Add a spinner icon */}
                          {/* <Spinner size="sm" className="mr-2" /> */}
                          جارٍ تأكيد الطلب...
                        </>
                      ) : (
                        "تأكيد الطلب"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            {/* Summary Column */}
            <div className="sticky top-28">
              {" "}
              {/* Adjust top offset if needed */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-2xl font-bold">ملخص الطلب</h2>
                </div>
                <div className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border p-1">
                          <img
                            src={item.image || "/placeholder.png"} // Add placeholder
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          <div className="flex justify-between items-center mt-1 text-sm">
                            <span className="text-gray-500">
                              الكمية: {item.quantity}
                            </span>
                            {/* Price Display */}
                            <div className="price-section text-left">
                              {item.onSale &&
                              item.salePrice &&
                              extractNumericPrice(item.salePrice) > 0 ? (
                                <div className="flex flex-col items-end">
                                  <span className="font-semibold text-bella">
                                    {extractNumericPrice(
                                      item.salePrice
                                    ).toFixed(2)}{" "}
                                    ج.م
                                  </span>
                                  <span className="text-xs line-through text-gray-400">
                                    {extractNumericPrice(item.price).toFixed(2)}{" "}
                                    ج.م
                                  </span>
                                </div>
                              ) : (
                                <span className="font-semibold">
                                  {extractNumericPrice(item.price).toFixed(2)}{" "}
                                  ج.م
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 h-8 w-8 flex-shrink-0"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label={`إزالة ${item.name}`}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {/* Totals */}
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي المنتجات</span>
                      <span className="font-medium">
                        {displayItemTotal.toFixed(2)} ج.م
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تكلفة الشحن</span>
                      {displayShippingCost === 0 ? (
                        <span className="font-medium text-green-600">
                          مجاني
                        </span>
                      ) : (
                        <span className="font-medium">
                          {displayShippingCost.toFixed(2)} ج.م
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between font-bold text-xl pt-2 border-t mt-2">
                      <span>الإجمالي</span>
                      <span className="text-bella">
                        {displayFinalTotal.toFixed(2)} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};
export default Checkout;
