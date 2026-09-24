"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Package,
} from "lucide-react";
import { useCartWishlist, CartItem } from "@/components/providers/CartWishlistProvider";
import { createClient } from "@/lib/supabase/client";
import { Coupon, couponDiscount, couponDiscountLabel } from "@/lib/coupon-shared";
import { checkCodEligibility, computeShippingCharge, getSiteSettings, SITE_DEFAULTS, type SiteSettings } from "@/lib/site-settings";

const COUPON_STORAGE_KEY = "devanagari_coupon_v1";

// All 28 states + 8 union territories, so a pincode-verified address from anywhere in India
// (not just a handful of states) shows correctly selected instead of blank.
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
  "Other State / UT",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartCount, clearCart } = useCartWishlist();

  // Only real-time products from the user's cart
  const activeItems = cart;

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [isVerifyingPincode, setIsVerifyingPincode] = useState(false);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [saveAddress, setSaveAddress] = useState(true);

  // Pre-fill contact details from the logged-in session so the order's customer_email
  // matches the account dashboard's email and the order shows up under "My Orders".
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = localStorage.getItem("devanagari_user");
    if (!storedUser) return;
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed.name || parsed.fullName) setFullName(parsed.name || parsed.fullName);
      if (parsed.email) setEmail(parsed.email);
      if (parsed.phone) setPhoneNumber(parsed.phone);
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }, []);

  // Payment Method Selection — "online" covers UPI/Card/NetBanking/Wallets, all handled by PayU's
  // own hosted page after redirect, so there's no real choice for our site to make between them.
  type PaymentOption = "online" | "cod";
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>("online");

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

  // Keep the stepper in sync with actual scroll position — it used to only move when a step
  // button was clicked, so it stayed stuck on "Address" the whole way through checkout.
  // Note: "order-summary-section" is a sticky sidebar next to the form, not a section further
  // down the page, so it can't be used as a scroll target — step 4 is "near the page bottom" instead.
  useEffect(() => {
    const paymentEl = document.getElementById("payment-section");
    const triggerY = () => window.innerHeight * 0.3;

    const updateStep = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150;
      if (nearBottom) {
        setCurrentStep(4);
        return;
      }
      const reachedPayment = paymentEl ? paymentEl.getBoundingClientRect().top <= triggerY() : false;
      setCurrentStep(reachedPayment ? 3 : 2);
    };

    updateStep();
    window.addEventListener("scroll", updateStep, { passive: true });
    window.addEventListener("resize", updateStep);
    return () => {
      window.removeEventListener("scroll", updateStep);
      window.removeEventListener("resize", updateStep);
    };
  }, []);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);

  // Order Placement Modal & Loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  // The order's real database id — needed to link to /account/invoice/[orderId], since
  // placedOrderId above is the human-readable order number for COD orders.
  const [placedOrderDbId, setPlacedOrderDbId] = useState("");
  // Captured at the moment the order is placed/confirmed — the cart (and therefore any total
  // computed from it) is emptied right after, so the success screen can't recompute this later.
  const [placedOrderAmount, setPlacedOrderAmount] = useState(0);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Shipping, COD & payment settings (admin-configurable)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SITE_DEFAULTS);
  useEffect(() => {
    getSiteSettings().then(setSiteSettings);
  }, []);

  useEffect(() => {
    const syncPayuResult = () => {
      const params = new URLSearchParams(window.location.search);
      const payuStatus = params.get("payu");
      if (payuStatus === "paid") {
        const orderId = params.get("order") || "";
        setPlacedOrderId(orderId);
        setPlacedOrderDbId(orderId);
        setPlacedOrderAmount(Number(params.get("amount")) || 0);
        setIsOrderSuccess(true);
        clearCart();
        window.history.replaceState({}, "", "/checkout");
      } else if (payuStatus === "failed") {
        setFormErrors({ payment: "Payment was not completed. You can try again." });
        window.history.replaceState({}, "", "/checkout");
      }
    };
    const timer = window.setTimeout(syncPayuResult, 0);
    return () => window.clearTimeout(timer);
  }, [clearCart]);

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

  // Falls back to "standard" when express was picked but is no longer offered (derived, not stored)
  const effectiveShippingMethod: "standard" | "express" =
    shippingMethod === "express" && siteSettings.express_shipping_enabled ? "express" : "standard";

  // Delivery charge (Free above threshold, express flat rate, both admin-configurable)
  const deliveryCharge =
    activeItems.length === 0 ? 0 : computeShippingCharge(siteSettings, effectiveShippingMethod, subtotalCurrent);

  // Coupon discount
  const appliedDiscount = couponDiscount(appliedCoupon, subtotalCurrent);

  // COD handling fee (only applies when Cash on Delivery is the selected payment method)
  const codEligibility = useMemo(() => checkCodEligibility(siteSettings, subtotalCurrent), [siteSettings, subtotalCurrent]);

  const onlineEnabled = siteSettings.upi_enabled || siteSettings.card_enabled;

  // Falls back to the next available option when the picked method becomes disabled/ineligible (derived, not stored)
  const effectivePayment: PaymentOption =
    selectedPayment === "online" && !onlineEnabled
      ? siteSettings.cod_enabled ? "cod" : "online"
      : selectedPayment === "cod" && !codEligibility.eligible
      ? onlineEnabled ? "online" : "cod"
      : selectedPayment;

  const codFee = effectivePayment === "cod" ? siteSettings.cod_fee : 0;

  // Final Total & Total Savings
  const finalTotal = Math.max(0, subtotalCurrent - appliedDiscount + deliveryCharge + codFee);
  // Total savings shown in design: (subtotalOriginalMRP - finalTotal)
  const totalSavings = Math.max(0, subtotalOriginalMRP - finalTotal);

  // Load active coupons from the database
  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("coupons")
      .select("*")
      .eq("is_active", true)
      .order("created_at")
      .then(({ data, error }) => {
        if (!cancelled && !error && data) setAvailableCoupons(data as Coupon[]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-apply a coupon carried over from the cart page
  useEffect(() => {
    if (availableCoupons.length === 0) return;
    const stored = localStorage.getItem(COUPON_STORAGE_KEY);
    if (!stored) return;
    const found = availableCoupons.find((c) => c.code.toUpperCase() === stored.toUpperCase());
    if (!found || couponDiscount(found, subtotalCurrent) <= 0) return;
    const timer = window.setTimeout(() => setAppliedCoupon(found), 0);
    return () => window.clearTimeout(timer);
  }, [availableCoupons, subtotalCurrent]);

  // Handle Pincode Verify — real lookup against India Post's public pincode API,
  // not a hardcoded list of 4 city prefixes that "verified" any 6-digit number.
  const handleVerifyPincode = async () => {
    if (!pincode || pincode.trim().length !== 6) {
      setFormErrors((prev) => ({ ...prev, pincode: "Please enter a valid 6-digit Pincode" }));
      setPincodeVerified(false);
      return;
    }
    setIsVerifyingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      const postOffice = data?.[0]?.PostOffice?.[0];
      if (data?.[0]?.Status !== "Success" || !postOffice) {
        setFormErrors((prev) => ({ ...prev, pincode: "This pincode wasn't found. Please check and try again." }));
        setPincodeVerified(false);
        return;
      }
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.pincode;
        return copy;
      });
      setCity(postOffice.District || postOffice.Block || postOffice.Name || "");
      setState(postOffice.State || "");
      setPincodeVerified(true);
    } catch {
      setFormErrors((prev) => ({ ...prev, pincode: "Couldn't verify this pincode right now. Please check your connection and try again." }));
      setPincodeVerified(false);
    } finally {
      setIsVerifyingPincode(false);
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

    const found = availableCoupons.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      setCouponError("Invalid coupon code");
      return;
    }

    if (couponDiscount(found, subtotalCurrent) <= 0) {
      setCouponError(`Add ₹${Math.ceil((found.min_amount ?? 0) - subtotalCurrent)} more to use this code`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput("");
    localStorage.setItem(COUPON_STORAGE_KEY, found.code);
    setCouponSuccess(`Code '${found.code}' applied successfully!`);
    setTimeout(() => setCouponSuccess(null), 3500);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    if (activeItems.length === 0) {
      alert("Aapka cart empty hai! Please pehle books cart me add karein.");
      return;
    }

    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = "Full name is required";
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email address";
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 10) {
      errors.phoneNumber = "Enter a valid 10-digit mobile number";
    }
    if (!pincode.trim() || pincode.length !== 6) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }
    if (!address.trim()) errors.address = "Complete address is required";
    if (!city.trim()) errors.city = "City is required";
    if (effectivePayment === "cod" && !codEligibility.eligible) {
      errors.payment = codEligibility.reason || "Cash on Delivery is unavailable for this order";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to address top
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    if (effectivePayment !== "cod") {
      try {
        const response = await fetch("/api/payu/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: activeItems.map((item) => ({ id: item.id, quantity: item.quantity || 1 })),
            fullName, email, phone: phoneNumber, address, landmark, city, state, pincode,
            shippingMethod: effectiveShippingMethod, couponCode: appliedCoupon?.code,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Unable to start payment");
        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.action;
        Object.entries(result.fields as Record<string, string>).forEach(([name, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } catch (error) {
        setIsSubmitting(false);
        setFormErrors({ payment: error instanceof Error ? error.message : "Unable to start payment" });
      }
      return;
    }

    try {
      const response = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: activeItems.map((item) => ({ id: item.id, quantity: item.quantity || 1 })), fullName, email, phone: phoneNumber, address, landmark, city, state, pincode, shippingMethod: effectiveShippingMethod, couponCode: appliedCoupon?.code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create COD order");
      setPlacedOrderId(result.orderNumber);
      setPlacedOrderDbId(result.orderId);
      setPlacedOrderAmount(Number(result.totalAmount) || finalTotal);
      setIsSubmitting(false);
      setIsOrderSuccess(true);
      clearCart();
    } catch (error) {
      setIsSubmitting(false);
      setFormErrors({ payment: error instanceof Error ? error.message : "Unable to create COD order" });
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFC] text-[#1D2129] pb-28 md:pb-16">
      {/* Hide the filled-in form/cart behind the success modal — nothing left to edit or resubmit,
          and it kept the printed invoice spanning multiple pages. */}
      {!isOrderSuccess && (
      <>
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
                {/* Row 1: Contact details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#C61821] ${
                        formErrors.email ? "border-red-500 bg-red-50/20" : "border-gray-250 hover:border-gray-350 focus:border-[#C61821]"
                      }`}
                    />
                    {formErrors.email && <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>}
                  </div>
                </div>

                {/* Row 2: Address (full width — it needs the most room) */}
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

                {/* Row 3: Pincode (narrow — it's only 6 digits) + City / Town (wider) */}
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Pincode
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value.replace(/\D/g, ""));
                          setPincodeVerified(false);
                        }}
                        placeholder="Enter pincode"
                        maxLength={6}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#C61821] ${
                          formErrors.pincode
                            ? "border-red-500 bg-red-50/20"
                            : "border-gray-250 hover:border-gray-350 focus:border-[#C61821]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPincode}
                        disabled={isVerifyingPincode}
                        className="px-4 py-2.5 rounded-lg border border-[#C61821] text-[#C61821] font-semibold text-xs sm:text-sm hover:bg-red-50 transition-colors cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isVerifyingPincode ? "Checking..." : pincodeVerified ? "Verified ✓" : "Verify"}
                      </button>
                    </div>
                    {pincodeVerified && (
                      <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivery available to {city}{state ? `, ${state}` : ""} (Standard: 3-5 days)</span>
                      </p>
                    )}
                    {formErrors.pincode && (
                      <p className="text-[11px] text-red-600 mt-1">{formErrors.pincode}</p>
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
                      value={effectiveShippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-250 hover:border-gray-350 focus:border-[#C61821] focus:ring-1 focus:ring-[#C61821] text-xs sm:text-sm bg-white transition-colors focus:outline-none"
                    >
                      <option value="standard">Standard Delivery ({siteSettings.standard_delivery_days})</option>
                      {siteSettings.express_shipping_enabled && (
                        <option value="express">
                          Express Delivery ({siteSettings.express_delivery_days}) +₹{siteSettings.express_shipping_rate}
                        </option>
                      )}
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
              {formErrors.payment && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{formErrors.payment}</p>
              )}

              {/* 2-Column Responsive Layout for Payment Option Selection */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left: Payment Method Radio List (md:col-span-5) */}
                <div className="md:col-span-5 space-y-2.5">
                  {/* 1. Online Payment (UPI / Cards / NetBanking — all via PayU) */}
                  {onlineEnabled && (
                  <button
                    type="button"
                    onClick={() => setSelectedPayment("online")}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      effectivePayment === "online"
                        ? "border-[#C61821] bg-red-50/25 ring-1 ring-[#C61821]/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          effectivePayment === "online"
                            ? "border-[#C61821]"
                            : "border-gray-300"
                        }`}
                      >
                        {effectivePayment === "online" && (
                          <div className="w-2 h-2 rounded-full bg-[#C61821]" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                        Online Payment
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        UPI, Cards &amp; NetBanking via PayU
                      </p>
                      {/* Logos */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-black italic tracking-tighter text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          UPI
                        </span>
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
                  )}

                  {/* 2. Cash on Delivery Option */}
                  {siteSettings.cod_enabled && (
                  <button
                    type="button"
                    onClick={() => codEligibility.eligible && setSelectedPayment("cod")}
                    disabled={!codEligibility.eligible}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      !codEligibility.eligible
                        ? "border-gray-150 bg-gray-50 opacity-60 cursor-not-allowed"
                        : effectivePayment === "cod"
                        ? "border-[#C61821] bg-red-50/25 ring-1 ring-[#C61821]/20 cursor-pointer"
                        : "border-gray-200 hover:border-gray-300 bg-white cursor-pointer"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          effectivePayment === "cod"
                            ? "border-[#C61821]"
                            : "border-gray-300"
                        }`}
                      >
                        {effectivePayment === "cod" && (
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
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {codEligibility.eligible
                          ? siteSettings.cod_fee > 0
                            ? `Pay when you receive · +₹${siteSettings.cod_fee} handling fee`
                            : "Pay when you receive"
                          : codEligibility.reason}
                      </p>
                    </div>
                  </button>
                  )}
                </div>

                {/* Right: Active Detail Pane (md:col-span-7) */}
                <div className="md:col-span-7 bg-gray-50/60 rounded-xl p-4 sm:p-5 border border-gray-150 flex flex-col justify-between">
                  {/* === Online Payment Subview (UPI / Cards / NetBanking, all via PayU) === */}
                  {effectivePayment === "online" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                          Pay Online
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Click &quot;Place Order&quot; below — you&apos;ll choose UPI, card or NetBanking and complete payment on PayU&apos;s secure page.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[11px] text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Your payment details are entered directly on PayU&apos;s PCI-compliant secure page — never stored on our site.</span>
                      </div>

                      {/* Payment logos */}
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
                          BHIM
                        </span>
                        <span className="text-[9px] font-extrabold text-blue-800 bg-blue-50 px-1.5 py-1 rounded border border-blue-200 leading-none">
                          VISA
                        </span>
                        <span className="text-[9px] font-extrabold text-orange-600 bg-orange-50 px-1.5 py-1 rounded border border-orange-200 leading-none">
                          MC
                        </span>
                        <span className="text-[9px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-1 rounded border border-teal-200 leading-none">
                          RuPay
                        </span>
                      </div>
                    </div>
                  )}

                  {/* === Cash on Delivery Subview === */}
                  {effectivePayment === "cod" && (
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
                          <span>
                            {siteSettings.cod_fee > 0
                              ? `COD Handling Fee: ₹${siteSettings.cod_fee}`
                              : "Zero Extra COD Convenience Fee"}
                          </span>
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
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-md border border-dashed border-red-300 bg-red-50/60 text-[#C61821] hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{c.code}</span>
                        <span className="text-gray-500 font-normal">({couponDiscountLabel(c)})</span>
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
                        {appliedCoupon.title}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700 tabular-nums">
                    -₹{appliedDiscount}
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

                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="tabular-nums font-bold">-₹{appliedDiscount.toLocaleString()}</span>
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

                {codFee > 0 && (
                  <div className="flex justify-between items-center">
                    <span>COD Handling Fee</span>
                    <span className="font-bold text-gray-900 tabular-nums">₹{codFee}</span>
                  </div>
                )}

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
              {/* Hidden on mobile — the fixed bottom bar already has this same button there */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || activeItems.length === 0}
                className="hidden lg:flex w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#C61821] hover:bg-[#8F0E15] active:scale-98 text-white font-bold text-sm sm:text-base items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
                India&apos;s trusted publication for competitive examination books
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
                  Delivery on orders above ₹{siteSettings.free_shipping_threshold}
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
      </>
      )}

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
                  {effectivePayment === "online" ? "Online Payment" : "Cash on Delivery"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-sm">
                <span className="text-gray-800">Amount Paid:</span>
                <span className="text-[#C61821] tabular-nums">₹{placedOrderAmount.toLocaleString()}</span>
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
              <Link
                href="/account?tab=orders"
                onClick={() => setIsOrderSuccess(false)}
                className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </Link>
              <Link
                href={`/account/invoice/${placedOrderDbId}`}
                target="_blank"
                className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print Order Invoice</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
