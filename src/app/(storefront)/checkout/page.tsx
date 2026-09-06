"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  Tag,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Check,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Banknote,
  QrCode,
  Sparkles,
  Percent,
  Info,
  ExternalLink,
  Smartphone,
  HelpCircle,
  Download,
  ArrowRight,
  X,
} from "lucide-react";
import { useCartWishlist, CartItem } from "@/components/providers/CartWishlistProvider";

interface Coupon {
  code: string;
  label: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
  minAmount?: number;
}

const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "DEVA10",
    label: "10% OFF",
    type: "percent",
    value: 10,
    description: "Flat 10% Extra Discount on all exam books",
  },
  {
    code: "STUDENT50",
    label: "₹50 OFF",
    type: "fixed",
    value: 50,
    minAmount: 399,
    description: "₹50 Instant Discount on orders above ₹399",
  },
];

const INDIAN_STATES = [
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Rajasthan",
  "Bihar",
  "Delhi",
  "Maharashtra",
  "Chhattisgarh",
  "Gujarat",
  "Haryana",
  "Jharkhand",
  "Punjab",
  "Uttarakhand",
  "West Bengal",
  "Other State / UT",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount, clearCart } = useCartWishlist();

  // Only real-time products from the user's cart
  const activeItems = cart;

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [saveAddress, setSaveAddress] = useState(true);

  // Payment Method Selection
  type PaymentOption = "upi" | "cards" | "cod";
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>("upi");

  // Active Stepper Step (1: Cart, 2: Address, 3: Payment, 4: Review)
  const [currentStep, setCurrentStep] = useState<number>(2);

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    if (stepNumber === 2) {
      document.getElementById("address-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (stepNumber === 3) {
      document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (stepNumber === 4) {
      document.getElementById("order-summary-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Sub-method states
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Order Placement Modal & Loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Financial calculations
  const totalItemCount = useMemo(() => {
    return activeItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [activeItems]);

  const subtotalOriginalMRP = useMemo(() => {
    return activeItems.reduce(
      (acc, item) => acc + (item.originalPrice || item.price) * (item.quantity || 1),
      0
    );
  }, [activeItems]);

  const subtotalCurrent = useMemo(() => {
    return activeItems.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
  }, [activeItems]);

  // Book discount
  const bookDiscount = Math.max(0, subtotalOriginalMRP - subtotalCurrent);

  // Delivery charge (Free above threshold or standard)
  const deliveryCharge = activeItems.length === 0 ? 0 : shippingMethod === "express" ? 49 : 0;

  // Coupon discount
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minAmount && subtotalCurrent < appliedCoupon.minAmount) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.round((subtotalCurrent * appliedCoupon.value) / 100);
    }
    return Math.min(subtotalCurrent, appliedCoupon.value);
  }, [appliedCoupon, subtotalCurrent]);

  // Final Total & Total Savings
  const finalTotal = Math.max(0, subtotalCurrent - couponDiscount + deliveryCharge);
  // Total savings shown in design: (subtotalOriginalMRP - finalTotal)
  const totalSavings = Math.max(0, subtotalOriginalMRP - finalTotal);

  // Handle Pincode Verify
  const handleVerifyPincode = () => {
    if (!pincode || pincode.trim().length !== 6) {
      setFormErrors((prev) => ({ ...prev, pincode: "Please enter a valid 6-digit Pincode" }));
      setPincodeVerified(false);
      return;
    }
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.pincode;
      return copy;
    });
    setPincodeVerified(true);
    // Auto-detect example city/state if user changes
    if (pincode.startsWith("452")) {
      setCity("Indore");
      setState("Madhya Pradesh");
    } else if (pincode.startsWith("462")) {
      setCity("Bhopal");
      setState("Madhya Pradesh");
    } else if (pincode.startsWith("110")) {
      setCity("New Delhi");
      setState("Delhi");
    } else if (pincode.startsWith("226")) {
      setCity("Lucknow");
      setState("Uttar Pradesh");
    }
  };

  // Handle Apply Coupon
  const handleApplyCoupon = (couponToApply?: Coupon) => {
    setCouponError(null);
    setCouponSuccess(null);

    const code = (couponToApply ? couponToApply.code : couponInput).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      setCouponError("Invalid coupon code. Try DEVA10 or STUDENT50");
      return;
    }

    if (found.minAmount && subtotalCurrent < found.minAmount) {
      setCouponError(`Minimum order value ₹${found.minAmount} required for ${found.code}`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput("");
    setCouponSuccess(`Code '${found.code}' applied successfully!`);
    setTimeout(() => setCouponSuccess(null), 3500);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  };

  // Handle Place Order
  const handlePlaceOrder = () => {
    if (activeItems.length === 0) {
      alert("Aapka cart empty hai! Please pehle books cart me add karein.");
      return;
    }

    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 10) {
      errors.phoneNumber = "Enter a valid 10-digit mobile number";
    }
    if (!pincode.trim() || pincode.length !== 6) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }
    if (!address.trim()) errors.address = "Complete address is required";
    if (!city.trim()) errors.city = "City is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to address top
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setPlacedOrderId(generatedId);
      setIsSubmitting(false);
      setIsOrderSuccess(true);
      if (cart.length > 0) {
        clearCart();
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#FBFBFC] text-[#1D2129] pb-28 md:pb-16">
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/cart" className="hover:text-[#C61821] transition-colors">
              Shopping Cart
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#C61821] font-semibold">Checkout</span>
          </nav>
        </div>
      </div>

      {/* 2. Stepper Progress Bar (Interactive with dynamic thin red connecting lines) */}
      <section className="bg-white border-b border-gray-150 py-3.5 sm:py-5 shadow-2xs">
        <div className="mx-auto px-4 sm:px-6 max-w-[1350px]">
          <div className="flex items-center justify-between sm:justify-center sm:gap-4 md:gap-8">
            {/* Step 1: Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C61821] text-[#C61821] flex items-center justify-center font-bold text-xs sm:text-sm bg-white group-hover:bg-red-50 transition-colors">
                1
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#C61821] group-hover:underline">
                Cart
              </span>
            </Link>

            {/* Connecting Thin Line 1 -> 2 (Always Red at Checkout) */}
            <div className="w-8 sm:w-16 md:w-20 h-[1.5px] bg-[#C61821] transition-all duration-500 rounded-full" />

            {/* Step 2: Address */}
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  currentStep >= 2
                    ? "bg-[#C61821] text-white shadow-sm shadow-red-600/30"
                    : "border border-gray-300/70 text-gray-400 bg-white"
                }`}
              >
                2
              </div>
              <span
                className={`text-xs sm:text-sm transition-colors duration-300 ${
                  currentStep >= 2
                    ? "font-bold text-[#C61821]"
                    : "font-medium text-gray-500"
                }`}
              >
                Address
              </span>
            </button>

            {/* Connecting Thin Line 2 -> 3 (Red when currentStep >= 3, low opacity when pending) */}
            <div
              className={`w-8 sm:w-16 md:w-20 h-[1.5px] transition-all duration-500 rounded-full ${
                currentStep >= 3 ? "bg-[#C61821]" : "bg-gray-300/40"
              }`}
            />

            {/* Step 3: Payment */}
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  currentStep >= 3
                    ? "bg-[#C61821] text-white shadow-sm shadow-red-600/30"
                    : "border border-gray-300/70 text-gray-400 bg-white"
                }`}
              >
                3
              </div>
              <span
                className={`text-xs sm:text-sm transition-colors duration-300 ${
                  currentStep >= 3
                    ? "font-bold text-[#C61821]"
                    : "font-medium text-gray-500"
                }`}
              >
                Payment
              </span>
            </button>

            {/* Connecting Thin Line 3 -> 4 (Red when currentStep >= 4, low opacity when pending) */}
            <div
              className={`w-8 sm:w-16 md:w-20 h-[1.5px] transition-all duration-500 rounded-full ${
                currentStep >= 4 ? "bg-[#C61821]" : "bg-gray-300/40"
              }`}
            />

            {/* Step 4: Review & Place Order */}
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  currentStep >= 4
                    ? "bg-[#C61821] text-white shadow-sm shadow-red-600/30"
                    : "border border-gray-300/70 text-gray-400 bg-white"
                }`}
              >
                4
              </div>
              <span
                className={`text-xs sm:text-sm transition-colors duration-300 hidden sm:inline ${
                  currentStep >= 4
                    ? "font-bold text-[#C61821]"
                    : "font-medium text-gray-500"
                }`}
              >
                Review &amp; Place Order
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Checkout Grid (Left: Forms & Payment, Right: Summary & Badges) */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Address, Payment, Coupon (lg:col-span-7)     */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 space-y-6">
            {/* ---------------------------------------------------- */}
            {/* CARD 1: Delivery Address Form                        */}
            {/* ---------------------------------------------------- */}
            <div id="address-section" className="bg-white rounded-2xl border border-gray-200/90 p-3 sm:p-5 shadow-xs scroll-mt-24">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                   Shipping Details
                  </h2>
                  <p className="text-xs text-gray-500">
                 Review shipping options and delivery details.
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-4 text-xs sm:text-sm">
                {/* Row 1: Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#C61821] ${
                        formErrors.fullName
                          ? "border-red-500 bg-red-50/20"
                          : "border-gray-250 hover:border-gray-350 focus:border-[#C61821]"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your 10-digit mobile number"
                      maxLength={10}
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#C61821] ${
                        formErrors.phoneNumber
                          ? "border-red-500 bg-red-50/20"
                          : "border-gray-250 hover:border-gray-350 focus:border-[#C61821]"
                      }`}
                    />
                    {formErrors.phoneNumber && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Pincode + Verify Button */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Pincode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value);
                        setPincodeVerified(false);
                      }}
                      placeholder="Enter pincode"
                      maxLength={6}
                      className={`flex-1 px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#C61821] ${
                        formErrors.pincode
                          ? "border-red-500 bg-red-50/20"
                          : "border-gray-250 hover:border-gray-350 focus:border-[#C61821]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPincode}
                      className="px-5 py-2.5 rounded-lg border border-[#C61821] text-[#C61821] font-semibold text-xs sm:text-sm hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    >
                      {pincodeVerified ? "Verified ✓" : "Verify"}
                    </button>
                  </div>
                  {pincodeVerified && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Delivery available to this pincode (Standard: 3-5 days)</span>
                    </p>
                  )}
                  {formErrors.pincode && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.pincode}</p>
                  )}
                </div>

                {/* Row 3: Address & City / Town Side by Side (Responsive) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Address (House No., Building, Street)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter complete address"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#C61821] ${
                        formErrors.address
                          ? "border-red-500 bg-red-50/20"
                          : "border-gray-250 hover:border-gray-350 focus:border-[#C61821]"
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#C61821] ${
                        formErrors.city
                          ? "border-red-500 bg-red-50/20"
                          : "border-gray-250 hover:border-gray-350 focus:border-[#C61821]"
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.city}</p>
                    )}
                  </div>
                </div>

                {/* Row 4: Landmark, State, Shipping Method */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="E.g. Near City Hospital"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-250 hover:border-gray-350 focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs sm:text-sm transition-colors focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-250 hover:border-gray-350 focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs sm:text-sm bg-white transition-colors focus:outline-none"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Shipping Method
                    </label>
                    <select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-250 hover:border-gray-350 focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs sm:text-sm bg-white transition-colors focus:outline-none"
                    >
                      <option value="standard">Standard Delivery (3-5 days)</option>
                      <option value="express">Express Delivery (1-2 days) +₹49</option>
                    </select>
                  </div>
                </div>

                {/* Row 6: Save Address Checkbox */}
                <div className="pt-2">
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        saveAddress
                          ? "bg-[#C61821] text-white"
                          : "border border-gray-300 bg-white"
                      }`}
                    >
                      {saveAddress && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      Save this address for future orders
                    </span>
                  </label>
                </div>

                {/* Continue to Payment CTA */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C61821] hover:bg-[#8F0E15] text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 2: Payment Method                               */}
            {/* ---------------------------------------------------- */}
            <div id="payment-section" className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 shadow-xs scroll-mt-24">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    Payment Method
                  </h2>
                  <p className="text-xs text-gray-500">
                    Choose a payment option
                  </p>
                </div>
              </div>

              {/* 2-Column Responsive Layout for Payment Option Selection */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left: Payment Method Radio List (md:col-span-5) */}
                <div className="md:col-span-5 space-y-2.5">
                  {/* 1. UPI Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("upi")}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      selectedPayment === "upi"
                        ? "border-[#C61821] bg-red-50/25 ring-1 ring-[#C61821]/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPayment === "upi"
                            ? "border-[#C61821]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === "upi" && (
                          <div className="w-2 h-2 rounded-full bg-[#C61821]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <span>UPI</span>
                          <span className="text-[10px] font-black italic tracking-tighter text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                            UPI
                          </span>
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Pay using any UPI app</p>
                    </div>
                  </button>

                  {/* 2. Cards Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("cards")}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      selectedPayment === "cards"
                        ? "border-[#C61821] bg-red-50/25 ring-1 ring-[#C61821]/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPayment === "cards"
                            ? "border-[#C61821]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === "cards" && (
                          <div className="w-2 h-2 rounded-full bg-[#C61821]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                        Cards
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Visa, MasterCard, Rupay
                      </p>
                      {/* Logos */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-extrabold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 leading-none">
                          VISA
                        </span>
                        <span className="text-[9px] font-extrabold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200 leading-none">
                          MC
                        </span>
                        <span className="text-[9px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 leading-none">
                          RuPay
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* 3. Cash on Delivery Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("cod")}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      selectedPayment === "cod"
                        ? "border-[#C61821] bg-red-50/25 ring-1 ring-[#C61821]/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPayment === "cod"
                            ? "border-[#C61821]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedPayment === "cod" && (
                          <div className="w-2 h-2 rounded-full bg-[#C61821]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          Cash on Delivery
                        </span>
                        <Banknote className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">Pay when you receive</p>
                    </div>
                  </button>
                </div>

                {/* Right: Active Detail Pane (md:col-span-7) */}
                <div className="md:col-span-7 bg-gray-50/60 rounded-xl p-4 sm:p-5 border border-gray-150 flex flex-col justify-between">
                  {/* === UPI Subview === */}
                  {selectedPayment === "upi" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                          Pay using UPI
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Scan any UPI QR code or enter UPI ID
                        </p>
                      </div>

                      {/* QR Code Container with Central Devanagari 'd' Logo Badge */}
                      <div className="bg-white p-3 rounded-xl border border-gray-250 shadow-2xs inline-block mx-auto relative group">
                        <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
                          {/* Styled SVG QR Code */}
                          <svg
                            viewBox="0 0 100 100"
                            className="w-full h-full text-gray-900"
                            fill="currentColor"
                          >
                            {/* Top Left Marker */}
                            <rect x="5" y="5" width="26" height="26" rx="2" fill="#111827" />
                            <rect x="9" y="9" width="18" height="18" rx="1" fill="#ffffff" />
                            <rect x="13" y="13" width="10" height="10" rx="1" fill="#C61821" />

                            {/* Top Right Marker */}
                            <rect x="69" y="5" width="26" height="26" rx="2" fill="#111827" />
                            <rect x="73" y="9" width="18" height="18" rx="1" fill="#ffffff" />
                            <rect x="77" y="13" width="10" height="10" rx="1" fill="#C61821" />

                            {/* Bottom Left Marker */}
                            <rect x="5" y="69" width="26" height="26" rx="2" fill="#111827" />
                            <rect x="9" y="73" width="18" height="18" rx="1" fill="#ffffff" />
                            <rect x="13" y="77" width="10" height="10" rx="1" fill="#C61821" />

                            {/* Dense QR Pattern elements */}
                            <rect x="36" y="8" width="6" height="6" fill="#1F2937" />
                            <rect x="46" y="8" width="6" height="6" fill="#1F2937" />
                            <rect x="56" y="8" width="6" height="6" fill="#1F2937" />
                            <rect x="36" y="18" width="16" height="6" fill="#1F2937" />
                            <rect x="56" y="18" width="8" height="6" fill="#1F2937" />

                            <rect x="8" y="36" width="6" height="14" fill="#1F2937" />
                            <rect x="18" y="36" width="12" height="6" fill="#1F2937" />
                            <rect x="18" y="46" width="8" height="6" fill="#1F2937" />

                            <rect x="74" y="36" width="8" height="8" fill="#1F2937" />
                            <rect x="86" y="36" width="8" height="16" fill="#1F2937" />
                            <rect x="74" y="48" width="8" height="6" fill="#1F2937" />

                            <rect x="36" y="68" width="6" height="16" fill="#1F2937" />
                            <rect x="46" y="74" width="8" height="6" fill="#1F2937" />
                            <rect x="58" y="68" width="6" height="20" fill="#1F2937" />
                            <rect x="46" y="84" width="8" height="8" fill="#1F2937" />
                            <rect x="68" y="74" width="8" height="18" fill="#1F2937" />
                            <rect x="80" y="74" width="14" height="6" fill="#1F2937" />
                            <rect x="80" y="84" width="14" height="8" fill="#1F2937" />
                          </svg>

                          {/* Central Brand Badge exactly as in screenshot: red circle with white 'd' / 'दे' */}
                          <div className="absolute inset-0 m-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#C61821] text-white flex items-center justify-center font-bold text-sm sm:text-base border-2 border-white shadow-md">
                            <span className="font-devanagari leading-none">दे</span>
                          </div>
                        </div>
                      </div>

                      {/* OR Divider */}
                      <div className="relative flex items-center justify-center">
                        <div className="border-t border-gray-250 w-full" />
                        <span className="bg-gray-50/60 px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider absolute">
                          OR
                        </span>
                      </div>

                      {/* Enter UPI ID input */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Enter UPI ID
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@upi"
                            className="w-full pl-3 pr-12 py-2 rounded-lg border border-gray-250 focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs bg-white"
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-600 tracking-tight">
                            UPI
                          </div>
                        </div>
                      </div>

                      {/* UPI Apps Row (GPay, PhonePe, Paytm, BHIM) */}
                      <div className="pt-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                        <span className="px-2 py-1 rounded bg-white border border-gray-200 text-[10px] font-bold text-gray-700 shadow-2xs flex items-center gap-1">
                          <span className="text-blue-500 font-black">G</span>Pay
                        </span>
                        <span className="px-2 py-1 rounded bg-white border border-gray-200 text-[10px] font-bold text-purple-700 shadow-2xs flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[8px] font-black">pe</span>
                          PhonePe
                        </span>
                        <span className="px-2 py-1 rounded bg-white border border-gray-200 text-[10px] font-bold text-sky-600 shadow-2xs">
                          paytm
                        </span>
                        <span className="px-2 py-1 rounded bg-white border border-gray-200 text-[10px] font-bold text-emerald-700 shadow-2xs">
                          BHIM&gt;
                        </span>
                      </div>
                    </div>
                  )}

                  {/* === Cards Subview === */}
                  {selectedPayment === "cards" && (
                    <div className="space-y-3.5">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                          Credit or Debit Card
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Safe 256-bit encrypted card checkout
                        </p>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-3 py-2 rounded-lg border border-gray-250 focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs bg-white font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                              Valid Thru (MM/YY)
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-3 py-2 rounded-lg border border-gray-250 focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs bg-white text-center font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-3 py-2 rounded-lg border border-gray-250 focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs bg-white text-center font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Enter name as printed on card"
                            className="w-full px-3 py-2 rounded-lg border border-gray-250 focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs bg-white"
                          />
                        </div>

                        <div className="pt-1">
                          <label className="inline-flex items-center gap-2 text-[11px] text-gray-600 cursor-pointer">
                            <input type="checkbox" defaultChecked className="rounded text-[#C61821]" />
                            <span>Save this card securely as per RBI guidelines</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* === Cash on Delivery Subview === */}
                  {selectedPayment === "cod" && (
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                          Cash on Delivery (COD)
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Pay in cash when your order reaches your doorstep
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Zero Extra COD Convenience Fee</span>
                        </p>
                        <p className="text-[11px] text-emerald-800">
                          Please keep exact change of <strong>₹{finalTotal}</strong> ready at the time of delivery.
                        </p>
                      </div>

                      <div className="text-[11px] text-gray-500">
                        🛡️ For order verification, you may receive a confirmation SMS or WhatsApp before dispatch.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step Navigation in Payment Card */}
              <div className="pt-4 flex justify-between items-center border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#C61821] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C61821] hover:bg-[#8F0E15] text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Review &amp; Place Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* CARD 3: Apply Coupon                                 */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                      Apply Coupon
                    </h2>
                    <p className="text-xs text-gray-500">
                      Have a coupon code? Apply it here
                    </p>
                  </div>
                </div>

                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-[#C61821] hover:underline cursor-pointer"
                  >
                    Remove Coupon
                  </button>
                )}
              </div>

              {!appliedCoupon ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleApplyCoupon();
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-250 focus:outline-none focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs sm:text-sm uppercase tracking-wider font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="px-6 py-2.5 rounded-lg border border-[#C61821] text-[#C61821] font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Clickable Quick Coupon Tags */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {AVAILABLE_COUPONS.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-dashed border-red-300 bg-red-50/60 text-[#C61821] hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{c.code}</span>
                        <span className="text-gray-500 font-normal">({c.label})</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </div>
                    <div>
                      <span className="font-bold text-emerald-900">
                        {appliedCoupon.code} Applied
                      </span>
                      <p className="text-[11px] text-emerald-700">
                        {appliedCoupon.description}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700 tabular-nums">
                    -₹{couponDiscount}
                  </span>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-600 font-medium mt-2">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 font-medium mt-2">{couponSuccess}</p>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Order Summary & CTA (lg:col-span-4)         */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* ---------------------------------------------------- */}
            {/* ORDER SUMMARY CARD                                   */}
            {/* ---------------------------------------------------- */}
            <div id="order-summary-section" className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-xs space-y-5 scroll-mt-24">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-500">
                    {totalItemCount} {totalItemCount === 1 ? "Item" : "Items"} in your cart
                  </p>
                </div>
              </div>

              {/* Items List (Real-time Cart Products) */}
              {activeItems.length === 0 ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C61821] flex items-center justify-center mx-auto shadow-2xs">
                    <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800">
                      Your Cart is Empty
                    </h4>
                    <p className="text-[11px] text-gray-500 max-w-[200px] mx-auto">
                      Add books to your cart to see real-time order summary
                    </p>
                  </div>
                  <div className="pt-1">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C61821] hover:bg-[#8F0E15] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      <span>Browse Exam Books</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto pr-1 no-scrollbar space-y-2">
                  {activeItems.map((item) => {
                    const discountPercent = item.originalPrice
                      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                      : 0;

                    return (
                      <div
                        key={item.id}
                        className="pt-2.5 pb-2.5 flex items-center justify-between gap-3 group"
                      >
                        {/* Left: Thumbnail + Title/Author */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-15 sm:w-12 sm:h-16 shrink-0 bg-gray-50 rounded border border-gray-200 p-0.5 overflow-hidden flex items-center justify-center shadow-2xs">
                            <img
                              src={item.image || "/images/books/image-3.png"}
                              alt={item.title}
                              className="h-full w-full object-contain filter drop-shadow-2xs"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate leading-snug">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">
                              by {item.author || "Dnyanagari Prakashan"}
                            </p>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-gray-400 font-semibold">
                                Qty: {item.quantity}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Prices & Discount Badge */}
                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-black text-[#C61821] tabular-nums leading-tight">
                            ₹{item.price * (item.quantity || 1)}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-[11px] text-gray-400 line-through tabular-nums leading-none mt-0.5">
                              ₹{item.originalPrice * (item.quantity || 1)}
                            </div>
                          )}
                          {discountPercent > 0 && (
                            <div className="text-[9.5px] font-bold text-[#C61821] uppercase tracking-wider leading-none mt-1">
                              {discountPercent}% OFF
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Price Calculation Rows */}
              <div className="space-y-2.5 text-xs sm:text-sm border-t border-gray-150 pt-4 text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({totalItemCount} items)</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    ₹{subtotalOriginalMRP.toLocaleString()}
                  </span>
                </div>

                {bookDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span className="tabular-nums font-bold">-₹{bookDiscount.toLocaleString()}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="tabular-nums font-bold">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-xs tracking-wider">
                      FREE
                    </span>
                  ) : (
                    <span className="font-bold text-gray-900 tabular-nums">₹{deliveryCharge}</span>
                  )}
                </div>

                {/* Total Amount Row */}
                <div className="pt-3 border-t border-gray-150 flex justify-between items-center">
                  <span className="text-sm sm:text-base font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#C61821] tabular-nums">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Green Savings Alert Pill */}
              {totalSavings > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You save ₹{totalSavings.toLocaleString()} on this order</span>
                </div>
              )}
            </div>


            {/* ---------------------------------------------------- */}
            {/* PLACE ORDER CTA BUTTON & TERMS                       */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || activeItems.length === 0}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {isSubmitting
                    ? "Processing Order..."
                    : activeItems.length === 0
                    ? "Cart is Empty"
                    : "Place Order"}
                </span>
              </button>

              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                By placing this order, you agree to our{" "}
                <Link href="/terms" className="text-[#C61821] hover:underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#C61821] hover:underline">
                  Privacy Policy.
                </Link>
              </p>
            </div>

            {/* ---------------------------------------------------- */}
            {/* TRUST BADGES STRIP                                   */}
            {/* ---------------------------------------------------- */}
            <div className="bg-[#F3F4F6] rounded-xl p-3 sm:p-3.5 border border-gray-200 flex items-center justify-around gap-2 text-gray-600 text-[10px] sm:text-[11px] font-bold">
              {/* SSL */}
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                <span>SSL SECURED</span>
              </div>

              {/* PCI DSS */}
              <div className="flex items-center gap-1.5">
                <span className="font-black italic text-gray-700">PCI</span>
                <span>DSS COMPLIANT</span>
              </div>

              {/* VERIFIED & TRUSTED */}
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>VERIFIED &amp; TRUSTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. WHY SHOP WITH US (FULL WIDTH RESPONSIVE SECTION) */}
      <section className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C61821]" />
                <span>Why shop with us?</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                India's trusted publication for competitive examination books
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100/80 self-start sm:self-auto">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Buyer Protection Guaranteed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* 1. 100% Original Books */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-150/80 hover:border-red-200 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  100% Original Books
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                  Authentic books from trusted publishers
                </p>
              </div>
            </div>

            {/* 2. Fast Delivery */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-150/80 hover:border-red-200 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  Fast Delivery
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                  Delivery on orders above ₹499
                </p>
              </div>
            </div>

            {/* 3. Easy Returns */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-150/80 hover:border-red-200 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  Easy Returns
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                  Hassle-free returns within 7 days
                </p>
              </div>
            </div>

            {/* 4. Secure Payments */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50/70 border border-gray-150/80 hover:border-red-200 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C61821] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  Secure Payments
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                  Safe &amp; secure payment gateway
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOBILE STICKY BOTTOM CHECKOUT BAR */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div>
            <span className="text-[10px] text-gray-500 font-medium">Total Payable:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#C61821] tabular-nums">
                ₹{finalTotal.toLocaleString()}
              </span>
              {totalSavings > 0 && (
                <span className="text-[10px] font-bold text-emerald-600">
                  Save ₹{totalSavings.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting || activeItems.length === 0}
            className="px-6 py-2.5 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isSubmitting
                ? "Placing..."
                : activeItems.length === 0
                ? "Cart Empty"
                : "Place Order"}
            </span>
          </button>
        </div>
      </div>

      {/* 5. ORDER PLACED CELEBRATION MODAL */}
      {isOrderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-center">
            {/* Celebration Badge */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Order Confirmed 🎉
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Thank You for Your Order!
              </h3>
              <p className="text-xs text-gray-500">
                Your book parcel is being prepared with utmost care.
              </p>
            </div>

            {/* Order Details Receipt Box */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-mono font-bold text-gray-900">{placedOrderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Expected Delivery:</span>
                <span className="font-semibold text-gray-900">In 3-5 Business Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Delivery To:</span>
                <span className="font-semibold text-gray-900 truncate max-w-[180px]">
                  {fullName ? `${fullName}${city ? ` (${city})` : ""}` : "Valued Customer"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-semibold text-gray-900 uppercase">
                  {selectedPayment === "upi"
                    ? "UPI Payment"
                    : selectedPayment === "cards"
                    ? "Credit / Debit Card"
                    : "Cash on Delivery"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-sm">
                <span className="text-gray-800">Amount Paid:</span>
                <span className="text-[#C61821] tabular-nums">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Link
                href="/shop"
                onClick={() => setIsOrderSuccess(false)}
                className="w-full py-3 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-600/25 transition-all"
              >
                <span>Continue Shopping Exam Books</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print Order Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
