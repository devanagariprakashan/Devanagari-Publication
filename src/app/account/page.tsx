"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Star,
  LogOut,
  Home,
  CheckCircle2,
  X,
  Edit3,
  Plus,
  Trash2,
  Download,
  Search,
  Truck,
  Clock,
  MessageSquarePlus,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useCartWishlist } from "@/components/providers/CartWishlistProvider";

// Define Address Interface
interface UserAddress {
  id: string;
  tag: "Home" | "Work" | "Other";
  name: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Define Order Interface
interface AccountOrder {
  id: string;
  orderNumber: string;
  title: string;
  hindiTitle?: string;
  date: string;
  rawDate: string;
  price: number;
  originalPrice?: number;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  image: string;
  author: string;
  pages?: number;
  itemsCount: number;
  trackingNumber: string;
  courier: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
}

// Define Review Interface
interface UserReview {
  id: string;
  bookTitle: string;
  bookImage: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
}

// Initial Mock Orders
const INITIAL_ORDERS: AccountOrder[] = [
  {
    id: "ord-1",
    orderNumber: "DN123456",
    title: "NIBANDH SANHITA",
    hindiTitle: "निबंध संहिता एवं प्रारूप लेखन",
    date: "12 May 2025",
    rawDate: "2025-05-12",
    price: 249,
    originalPrice: 349,
    status: "Delivered",
    image: "/images/books/image-3.png",
    author: "Mr. Mayank Jagdish Sharma",
    pages: 456,
    itemsCount: 1,
    trackingNumber: "TRK-DN-994821",
    courier: "BlueDart Express",
    deliveredDate: "12 May 2025, 02:45 PM",
  },
  {
    id: "ord-2",
    orderNumber: "DN123455",
    title: "GENERAL STUDIES PAPER 1",
    hindiTitle: "MPPSC प्रारंभिक परीक्षा GS Paper 1",
    date: "10 May 2025",
    rawDate: "2025-05-10",
    price: 499,
    originalPrice: 799,
    status: "Delivered",
    image: "/images/books/image-10.png",
    author: "Mr. Shubham Gupta",
    pages: 720,
    itemsCount: 1,
    trackingNumber: "TRK-DN-994110",
    courier: "Delhivery Surface",
    deliveredDate: "10 May 2025, 11:30 AM",
  },
  {
    id: "ord-3",
    orderNumber: "DN123454",
    title: "INDIAN POLITY",
    hindiTitle: "भारतीय न्याय व राजव्यवस्था संहिता (BNS)",
    date: "08 May 2025",
    rawDate: "2025-05-08",
    price: 299,
    originalPrice: 450,
    status: "Shipped",
    image: "/images/books/image-5.png",
    author: "Devanagari Law Faculty",
    pages: 420,
    itemsCount: 1,
    trackingNumber: "TRK-DN-993708",
    courier: "DTDC Priority",
    estimatedDelivery: "Expected by tomorrow, 14 May",
  },
  {
    id: "ord-4",
    orderNumber: "DN123453",
    title: "ENVIRONMENT NOTEBOOK",
    hindiTitle: "पर्यावरण एवं पारिस्थितिकी हस्तलिखित नोट्स",
    date: "05 May 2025",
    rawDate: "2025-05-05",
    price: 199,
    originalPrice: 280,
    status: "Processing",
    image: "/images/books/image-4.png",
    author: "Devanagari Editorial Board",
    pages: 280,
    itemsCount: 1,
    trackingNumber: "TRK-DN-992514",
    courier: "Devanagari Logistics",
    estimatedDelivery: "Dispatching soon",
  },
];

// Initial 3 Saved Addresses
const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: "addr-1",
    tag: "Home",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    street: "12, Shivaji Nagar",
    area: "Near ICICI Bank",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
    isDefault: true,
  },
];

// Exactly 24 Initial User Reviews matching the 24 badge
const INITIAL_REVIEWS: UserReview[] = [
  {
    id: "rev-1",
    bookTitle: "NIBANDH SANHITA",
    bookImage: "/images/books/image-3.png",
    rating: 5,
    date: "14 May 2025",
    title: "Must buy for MPPSC Mains Essay Paper!",
    content: "All recent 2025 topics and statistical figures are covered in immense depth. The structure given for model essays helped me boost my score.",
    helpful: 38,
  },
  {
    id: "rev-2",
    bookTitle: "GENERAL STUDIES PAPER 1",
    bookImage: "/images/books/image-10.png",
    rating: 5,
    date: "05 April 2025",
    title: "Complete coverage of all 10 units of MPPSC Prelims",
    content: "The history of MP and tribal heritage section is exceptionally curated. Flowcharts and maps made revision super fast.",
    helpful: 41,
  },
  {
    id: "rev-3",
    bookTitle: "ENVIRONMENT NOTEBOOK",
    bookImage: "/images/books/image-4.png",
    rating: 4,
    date: "22 March 2025",
    title: "Clean diagrams and crisp handwritten notes",
    content: "Very concise, exam-oriented notes for environmental ecology and climate conventions.",
    helpful: 19,
  },
];

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const { wishlist, wishlistCount, addToCart, removeFromWishlist, toggleWishlist } =
    useCartWishlist();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "wishlist" | "addresses" | "reviews"
  >("overview");

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: "Rahul Sharma",
    email: "rahulsharma@gmail.com",
    phone: "+91 98765 43210",
  });

  // State for addresses, orders, and reviews
  const [addresses, setAddresses] = useState<UserAddress[]>(INITIAL_ADDRESSES);
  const [orders, setOrders] = useState<AccountOrder[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_REVIEWS);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");

  // Modals
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AccountOrder | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState<string | null>(null);

  // New Review Form State
  const [newReviewForm, setNewReviewForm] = useState({
    bookTitle: "NIBANDH SANHITA",
    bookImage: "/images/books/image-3.png",
    rating: 5,
    title: "",
    content: "",
  });

  // Sync tab param from URL
  useEffect(() => {
    if (
      tabParam &&
      ["overview", "orders", "wishlist", "addresses", "reviews"].includes(tabParam)
    ) {
      setActiveTab(
        tabParam as "overview" | "orders" | "wishlist" | "addresses" | "reviews"
      );
    }
  }, [tabParam]);

  // Load persisted state & seed initial wishlist if empty so user has items to test removing
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. User session
      const storedUser = localStorage.getItem("devanagari_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUserProfile((prev) => ({
            ...prev,
            name: parsed.name || parsed.fullName || prev.name,
            email: parsed.email || prev.email,
            phone: parsed.phone || prev.phone,
          }));
        } catch (e) {
          console.error("Failed to parse user session", e);
        }
      }

      // 2. Saved Addresses
      const storedAddresses = localStorage.getItem("devanagari_addresses");
      if (storedAddresses) {
        try {
          const parsed = JSON.parse(storedAddresses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // 3. Orders
      const storedOrders = localStorage.getItem("devanagari_orders");
      if (storedOrders) {
        try {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // 4. Reviews (starts at 24)
      const storedReviews = localStorage.getItem("devanagari_user_reviews");
      if (storedReviews) {
        try {
          const parsed = JSON.parse(storedReviews);
          if (Array.isArray(parsed)) {
            setReviews(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }

      // 5. Wishlist: Seed 3 real items if currently empty so user can experience real-time removal
      const wishlistKey = "devanagari_wishlist_v2";
      const existingWishlist = localStorage.getItem(wishlistKey);
      if (!existingWishlist || JSON.parse(existingWishlist).length === 0) {
        const seedWishlist = [
          {
            id: 102,
            title: "NIBANDH SANHITA",
            hindiTitle: "निबंध संहिता एवं प्रारूप लेखन",
            price: 249,
            originalPrice: 349,
            image: "/images/books/image-3.png",
            author: "Mr. Mayank Jagdish Sharma",
            rating: 4.9,
          },
          {
            id: 105,
            title: "MADHYA PRADESH SAMANYA GYAN",
            hindiTitle: "मध्य प्रदेश सामान्य ज्ञान मानचित्र",
            price: 389,
            originalPrice: 550,
            image: "/images/books/image-4.png",
            author: "Mr. Mayank Jagdish Sharma",
            rating: 4.9,
          },
          {
            id: 101,
            title: "SAMANYA HINDI EVAM VYAKARAN",
            hindiTitle: "सामान्य हिन्दी एवं व्याकरण",
            price: 900,
            originalPrice: 1000,
            image: "/images/books/image-2.png",
            author: "Mr. Mayank Jagdish Sharma",
            rating: 4.9,
          },
        ];
        localStorage.setItem(wishlistKey, JSON.stringify(seedWishlist));
        window.dispatchEvent(new Event("storage"));
      }
    }
  }, []);

  // Toast notification helper
  const triggerToast = (msg: string) => {
    setShowSaveToast(msg);
    setTimeout(() => setShowSaveToast(null), 2500);
  };

  // Default address finder
  const defaultAddress =
    addresses.find((a) => a.isDefault) || addresses[0] || INITIAL_ADDRESSES[0];

  // Save/Update Address
  const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updated: UserAddress = {
      id: editingAddress?.id || `addr-${Date.now()}`,
      tag: (formData.get("tag") as "Home" | "Work" | "Other") || "Home",
      name: (formData.get("name") as string) || userProfile.name,
      phone: (formData.get("phone") as string) || userProfile.phone,
      street: (formData.get("street") as string) || "",
      area: (formData.get("area") as string) || "",
      city: (formData.get("city") as string) || "Pune",
      state: (formData.get("state") as string) || "Maharashtra",
      pincode: (formData.get("pincode") as string) || "411005",
      isDefault: formData.get("isDefault") === "on" || editingAddress?.isDefault || false,
    };

    setAddresses((prev) => {
      let nextList = prev.map((item) => {
        if (item.id === updated.id) return updated;
        if (updated.isDefault) return { ...item, isDefault: false };
        return item;
      });

      if (!nextList.some((item) => item.id === updated.id)) {
        if (updated.isDefault) {
          nextList = nextList.map((item) => ({ ...item, isDefault: false }));
        }
        nextList.unshift(updated);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("devanagari_addresses", JSON.stringify(nextList));
      }
      return nextList;
    });

    setIsEditAddressOpen(false);
    setIsNewAddressModalOpen(false);
    setEditingAddress(null);
    triggerToast(editingAddress ? "Address updated successfully!" : "New address added!");
  };

  // Fast Address Removal (Real-Time)
  const handleDeleteAddress = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (addresses.length <= 1) {
      triggerToast("You must keep at least one address on file.");
      return;
    }

    const target = addresses.find((a) => a.id === id);
    const remaining = addresses.filter((a) => a.id !== id);

    let nextList = remaining;
    if (target?.isDefault && remaining.length > 0) {
      nextList = remaining.map((a, idx) => (idx === 0 ? { ...a, isDefault: true } : a));
    }

    setAddresses(nextList);
    if (typeof window !== "undefined") {
      localStorage.setItem("devanagari_addresses", JSON.stringify(nextList));
    }

    if (editingAddress?.id === id) {
      setIsEditAddressOpen(false);
      setEditingAddress(null);
    }

    triggerToast("Address removed successfully!");
  };

  // Fast Review Removal (Real-Time)
  const handleDeleteReview = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("devanagari_user_reviews", JSON.stringify(updated));
    }
    triggerToast("Review removed successfully!");
  };

  // Add New Review (Real-Time)
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.title.trim() || !newReviewForm.content.trim()) {
      triggerToast("Please enter a review headline and description");
      return;
    }

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      bookTitle: newReviewForm.bookTitle,
      bookImage: newReviewForm.bookImage,
      rating: newReviewForm.rating,
      date: "Just now",
      title: newReviewForm.title.trim(),
      content: newReviewForm.content.trim(),
      helpful: 1,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("devanagari_user_reviews", JSON.stringify(updated));
    }

    setIsWriteReviewOpen(false);
    setNewReviewForm({
      bookTitle: "NIBANDH SANHITA",
      bookImage: "/images/books/image-3.png",
      rating: 5,
      title: "",
      content: "",
    });
    triggerToast("Review published successfully!");
  };

  // Fast Wishlist Removal with Real-time Count Update
  const handleRemoveWishlist = (id: number, title?: string) => {
    removeFromWishlist(id);
    triggerToast(`Removed ${title ? `"${title}"` : "item"} from wishlist!`);
  };

  // Handle Logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("devanagari_user");
      localStorage.setItem("devanagari_logged_out", "true");
      window.dispatchEvent(new Event("devanagari_user_updated"));
    }
    setIsLogoutModalOpen(false);
    router.push("/login");
  };

  // Filtered Orders for the "My Orders" tab
  const filteredOrders = orders.filter((order) => {
    if (orderFilter !== "all" && order.status.toLowerCase() !== orderFilter.toLowerCase()) {
      return false;
    }
    if (
      orderSearch.trim() &&
      !order.title.toLowerCase().includes(orderSearch.toLowerCase()) &&
      !order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F8F9FA] text-[#1D2129] py-6 sm:py-8 lg:py-10 selection:bg-red-100 selection:text-[#C61821]">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Real-time Toast Alert */}
        {showSaveToast && (
          <div className="fixed top-20 right-5 z-50 bg-[#15803D] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in slide-in-from-top-3 fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{showSaveToast}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* MAIN DASHBOARD LAYOUT (SIDEBAR + CONTENT) */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* ========================================================== */}
          {/* LEFT SIDEBAR (Matching User Mockup) */}
          {/* ========================================================== */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="bg-white rounded-[5px] border border-gray-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-7 flex flex-col items-center">
              {/* User Avatar */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#ffeaf0] flex items-center justify-center mb-4 relative shadow-inner">
                <svg
                  className="w-14 h-14 sm:w-16 sm:h-16 text-[#9703ec]"
                  viewBox="0 0 64 64"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="32" cy="22" r="12" />
                  <path d="M12 52c0-11 9-20 20-20s20 9 20 20v2H12v-2z" />
                </svg>
              </div>

              {/* User Name */}
              <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight text-center">
                {userProfile.name}
              </h2>

              {/* User Email */}
              <p className="text-xs sm:text-[13px] text-gray-400 font-medium text-center mt-1 mb-7 truncate max-w-full">
                {userProfile.email}
              </p>

              {/* Navigation Menu */}
              <nav className="w-full space-y-2 select-none" aria-label="Account Tabs">
                {/* 1. Overview */}
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-[#FFF1F2] text-[#C61821] shadow-2xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Home
                    className={`w-5 h-5 ${
                      activeTab === "overview" ? "text-[#C61821]" : "text-gray-500"
                    }`}
                    strokeWidth={activeTab === "overview" ? 2.3 : 1.8}
                  />
                  <span>Overview</span>
                </button>

                {/* 2. My Orders */}
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-[#FFF1F2] text-[#C61821] shadow-2xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <ShoppingBag
                      className={`w-5 h-5 ${
                        activeTab === "orders" ? "text-[#C61821]" : "text-gray-500"
                      }`}
                      strokeWidth={activeTab === "orders" ? 2.3 : 1.8}
                    />
                    <span>My Orders</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeTab === "orders"
                        ? "bg-red-200/60 text-[#C61821]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {orders.length}
                  </span>
                </button>

                {/* 3. Wishlist (Real-time count) */}
                <button
                  type="button"
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === "wishlist"
                      ? "bg-[#FFF1F2] text-[#C61821] shadow-2xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Heart
                      className={`w-5 h-5 ${
                        activeTab === "wishlist" ? "text-[#C61821]" : "text-gray-500"
                      }`}
                      strokeWidth={activeTab === "wishlist" ? 2.3 : 1.8}
                    />
                    <span>Wishlist</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-all ${
                      activeTab === "wishlist"
                        ? "bg-red-200/60 text-[#C61821]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {wishlistCount}
                  </span>
                </button>

                {/* 4. Addresses (Real-time count) */}
                <button
                  type="button"
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === "addresses"
                      ? "bg-[#FFF1F2] text-[#C61821] shadow-2xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <MapPin
                      className={`w-5 h-5 ${
                        activeTab === "addresses" ? "text-[#C61821]" : "text-gray-500"
                      }`}
                      strokeWidth={activeTab === "addresses" ? 2.3 : 1.8}
                    />
                    <span>Addresses</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-all ${
                      activeTab === "addresses"
                        ? "bg-red-200/60 text-[#C61821]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {addresses.length}
                  </span>
                </button>

                {/* 5. Reviews (Real-time count) */}
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === "reviews"
                      ? "bg-[#FFF1F2] text-[#C61821] shadow-2xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Star
                      className={`w-5 h-5 ${
                        activeTab === "reviews" ? "text-[#C61821]" : "text-gray-500"
                      }`}
                      strokeWidth={activeTab === "reviews" ? 2.3 : 1.8}
                    />
                    <span>Reviews</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-all ${
                      activeTab === "reviews"
                        ? "bg-red-200/60 text-[#C61821]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {reviews.length}
                  </span>
                </button>

                {/* 6. Logout */}
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50/70 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-5 h-5 text-gray-500 hover:text-red-600" strokeWidth={1.8} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* ========================================================== */}
          {/* RIGHT MAIN CONTENT AREA */}
          {/* ========================================================== */}
          <main className="flex-1 min-w-0 w-full">
            {/* ======================================================== */}
            {/* TAB: OVERVIEW (MATCHING USER MOCKUP WITH REAL-TIME STATS) */}
            {/* ======================================================== */}
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
                {/* Page Title & Welcome Header */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                    My Account
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                    Welcome back, {userProfile.name.split(" ")[0]}! Here&apos;s what&apos;s
                    happening with your account.
                  </p>
                </div>

                {/* 4 Top Metric Cards (Row of 4) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {/* Card 1: Orders Placed */}
                  <div className="bg-white rounded-[5px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-red-100 transition-all duration-200 group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFEAEB] flex items-center justify-center text-[#E11D48] group-hover:scale-105 transition-transform shrink-0">
                        <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                          {orders.length}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                          Orders Placed
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className="text-[11px] sm:text-xs font-bold text-[#C61821] hover:text-[#991016] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        View all orders <ArrowRight className="w-3 h-3 hidden sm:inline" />
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Items in Wishlist */}
                  <div className="bg-white rounded-[5px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-red-100 transition-all duration-200 group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFEAEB] flex items-center justify-center text-[#E11D48] group-hover:scale-105 transition-transform shrink-0">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none transition-all">
                          {wishlistCount}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                          Items in Wishlist
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveTab("wishlist")}
                        className="text-[11px] sm:text-xs font-bold text-[#C61821] hover:text-[#991016] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        View wishlist <ArrowRight className="w-3 h-3 hidden sm:inline" />
                      </button>
                    </div>
                  </div>

                  {/* Card 3: Saved Addresses */}
                  <div className="bg-white rounded-[5px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-red-100 transition-all duration-200 group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFEAEB] flex items-center justify-center text-[#E11D48] group-hover:scale-105 transition-transform shrink-0">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none transition-all">
                          {addresses.length}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                          Saved Addresses
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveTab("addresses")}
                        className="text-[11px] sm:text-xs font-bold text-[#C61821] hover:text-[#991016] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        Manage addresses <ArrowRight className="w-3 h-3 hidden sm:inline" />
                      </button>
                    </div>
                  </div>

                  {/* Card 4: Reviews Written */}
                  <div className="bg-white rounded-[5px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-red-100 transition-all duration-200 group">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFEAEB] flex items-center justify-center text-[#E11D48] group-hover:scale-105 transition-transform shrink-0">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none transition-all">
                          {reviews.length}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 truncate">
                          Reviews Written
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveTab("reviews")}
                        className="text-[11px] sm:text-xs font-bold text-[#C61821] hover:text-[#991016] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        View all reviews <ArrowRight className="w-3 h-3 hidden sm:inline" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Two Column Lower Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* LEFT: Recent Orders Card */}
                  <div className="lg:col-span-12 xl:col-span-12 bg-white rounded-[5px] border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-5 sm:p-7">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Recent Orders
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className="text-xs sm:text-sm font-semibold text-[#C61821] hover:underline cursor-pointer"
                      >
                        View All Orders
                      </button>
                    </div>

                    {/* Orders List */}
                    <div className="divide-y divide-gray-100">
                      {orders.slice(0, 4).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 group hover:bg-rose-50/20 -mx-2 px-2 rounded-xl transition-all cursor-pointer"
                          role="button"
                          tabIndex={0}
                          aria-label={`View order details for ${order.title}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedOrder(order);
                          }}
                        >
                          {/* Thumbnail & Title */}
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            <div className="w-12 h-16 sm:w-16 sm:h-20 bg-gray-50 rounded border border-gray-100 shrink-0 shadow-2xs p-0.5 flex items-center justify-center overflow-hidden">
                              <div className="relative w-full h-full">
                                <Image
                                  src={order.image}
                                  alt={order.title}
                                  fill
                                  className="object-contain"
                                  sizes="(max-width: 640px) 60px, 80px"
                                />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tight truncate group-hover:text-[#C61821] transition-colors">
                                {order.title}
                              </h3>
                              <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">
                                Order #{order.orderNumber}
                              </p>
                            </div>
                          </div>

                          {/* Date, Price, and Status container for Mobile & Desktop alignment */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-10 shrink-0 w-full sm:w-auto pl-14 sm:pl-0">
                            {/* Date */}
                            <div className="text-[11px] sm:text-xs text-gray-500 font-medium whitespace-nowrap text-center sm:w-28">
                              {order.date}
                            </div>

                            {/* Price */}
                            <div className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap text-center sm:text-right sm:w-16">
                              ₹{order.price}
                            </div>

                            {/* Status Badge */}
                            <div className="shrink-0 w-20 sm:w-24 text-right">
                              {order.status === "Delivered" && (
                                <span className="inline-flex items-center justify-center w-full px-2 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#E8F8EE] text-[#16A34A]">
                                  Delivered
                                </span>
                              )}
                              {order.status === "Shipped" && (
                                <span className="inline-flex items-center justify-center w-full px-2 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                                  Shipped
                                </span>
                              )}
                              {order.status === "Processing" && (
                                <span className="inline-flex items-center justify-center w-full px-2 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#F1F5F9] text-[#64748B]">
                                  Processing
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Centered Outline Button */}
                    <div className="pt-6 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        className="inline-flex items-center justify-center px-7 py-2.5 rounded-lg border border-[#C61821] text-[#C61821] hover:bg-rose-50/70 active:bg-rose-100 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        View All Orders
                      </button>
                    </div>
                  </div>

                 
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: MY ORDERS (FULL HISTORY + REAL-TIME FILTERS) */}
            {/* ======================================================== */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      My Orders ({orders.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                      Track, view invoices, and reorder past purchases.
                    </p>
                  </div>

                  {/* Search Orders */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search order or title..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C61821]"
                    />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: "all", label: "All Orders" },
                    { id: "delivered", label: "Delivered" },
                    { id: "shipped", label: "Shipped" },
                    { id: "processing", label: "Processing" },
                  ].map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setOrderFilter(pill.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        orderFilter === pill.id
                          ? "bg-[#C61821] text-white shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-gray-800">No orders found</h3>
                      <p className="text-xs text-gray-500 mt-1 mb-4">
                        We couldn&apos;t find any orders matching your criteria.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex px-5 py-2.5 rounded-lg bg-[#C61821] text-white text-xs font-bold"
                      >
                        Explore Books
                      </Link>
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-5 sm:p-6 transition-all hover:border-red-100"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                          <div>
                            <span className="text-xs text-gray-400 font-medium">Order ID:</span>
                            <span className="text-xs font-bold text-gray-900 ml-1">
                              #{order.orderNumber}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {order.status === "Delivered" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#16A34A]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Delivered
                              </span>
                            )}
                            {order.status === "Shipped" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                                <Truck className="w-3.5 h-3.5" />
                                Shipped
                              </span>
                            )}
                            {order.status === "Processing" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#64748B]">
                                <Clock className="w-3.5 h-3.5" />
                                Processing
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Body */}
                        <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-20 sm:w-16 sm:h-22 relative bg-gray-50 rounded border border-gray-100 overflow-hidden shrink-0 shadow-2xs">
                              <Image
                                src={order.image}
                                alt={order.title}
                                fill
                                className="object-cover"
                                sizes="70px"
                              />
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-gray-900 uppercase">
                                {order.title}
                              </h3>
                              {order.hindiTitle && (
                                <p className="text-xs text-gray-500 font-hindi mt-0.5">
                                  {order.hindiTitle}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">Author: {order.author}</p>
                              <p className="text-xs font-semibold text-gray-700 mt-0.5">
                                Courier: {order.courier} ({order.trackingNumber})
                              </p>
                            </div>
                          </div>

                          <div className="text-right sm:text-right">
                            <span className="text-xs text-gray-400 block">Total Amount</span>
                            <span className="text-base sm:text-lg font-black text-gray-900">
                              ₹{order.price}
                            </span>
                            {order.originalPrice && (
                              <span className="text-xs text-gray-400 line-through block">
                                ₹{order.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Footer Actions */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-xs text-gray-500">
                            {order.deliveredDate && (
                              <span>Delivered on {order.deliveredDate}</span>
                            )}
                            {order.estimatedDelivery && (
                              <span className="text-amber-700 font-medium">
                                {order.estimatedDelivery}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                            >
                              Track Shipment
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                addToCart({
                                  id: parseInt(order.orderNumber.replace(/\D/g, "")) || 101,
                                  title: order.title,
                                  hindiTitle: order.hindiTitle,
                                  price: order.price,
                                  image: order.image,
                                });
                                triggerToast(`Added "${order.title}" to cart!`);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[#C61821] hover:bg-[#A81119] text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
                            >
                              Buy Again
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: WISHLIST (REAL-TIME ITEMS REMOVAL & ADD TO CART) */}
            {/* ======================================================== */}
            {activeTab === "wishlist" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      My Wishlist ({wishlistCount})
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                      Real-time wishlist items. Remove or move to cart with instant counter updates.
                    </p>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-xs font-semibold text-[#C61821] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                      {wishlistCount} items saved
                    </span>
                  )}
                </div>

                {wishlist.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-gray-800">Your wishlist is empty</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-4">
                      Explore top-rated exam books and save your favorites here.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex px-5 py-2.5 rounded-lg bg-[#C61821] text-white text-xs font-bold"
                    >
                      Browse Books
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col justify-between hover:shadow-md hover:border-red-100 transition-all group"
                      >
                        <div className="flex gap-3.5">
                          <div className="w-16 h-22 relative bg-gray-50 rounded border border-gray-100 shrink-0 overflow-hidden">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                                sizes="80px"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase truncate">
                              {item.title}
                            </h3>
                            {item.hindiTitle && (
                              <p className="text-[11px] text-gray-500 font-hindi truncate mt-0.5">
                                {item.hindiTitle}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm font-black text-gray-900">
                                ₹{item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 mt-3 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveWishlist(item.id, item.title)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            <span className="text-red-600">Remove</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              addToCart(item);
                              handleRemoveWishlist(item.id);
                              triggerToast(`Moved "${item.title}" to cart!`);
                            }}
                            className="flex-1 py-2 px-3 rounded-lg bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold transition-all cursor-pointer text-center"
                          >
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: ADDRESSES (FAST REMOVAL & REAL-TIME MANAGEMENT) */}
            {/* ======================================================== */}
            {activeTab === "addresses" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      Saved Addresses ({addresses.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                      Fast remove or edit any saved delivery address.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsNewAddressModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white rounded-2xl border p-5 sm:p-6 relative flex flex-col justify-between transition-all ${
                        addr.isDefault
                          ? "border-[#C61821]/40 shadow-[0_4px_20px_rgba(198,24,33,0.06)] ring-1 ring-[#C61821]/20"
                          : "border-gray-100 shadow-2xs hover:border-gray-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md">
                            <Home className="w-3.5 h-3.5 text-[#C61821]" />
                            <span>{addr.tag}</span>
                          </div>
                          {addr.isDefault ? (
                            <span className="text-[11px] font-bold text-[#C61821] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                              Default Address
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = addresses.map((a) => ({
                                  ...a,
                                  isDefault: a.id === addr.id,
                                }));
                                setAddresses(updated);
                                if (typeof window !== "undefined") {
                                  localStorage.setItem(
                                    "devanagari_addresses",
                                    JSON.stringify(updated)
                                  );
                                }
                                triggerToast("Set as default address!");
                              }}
                              className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 cursor-pointer"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-gray-900">{addr.name}</h3>
                        <p className="text-xs sm:text-[13px] text-gray-500 mt-1 leading-relaxed">
                          {addr.street}, {addr.area}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs font-semibold text-gray-800 mt-2">{addr.phone}</p>
                      </div>

                      {/* Action buttons with FAST REMOVE */}
                      <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddress(addr);
                            setIsEditAddressOpen(true);
                          }}
                          className="text-xs font-bold text-[#C61821] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Fast Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAddress(addr.id, e)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove this address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: REVIEWS (REAL-TIME 24 REVIEWS + ADD & DELETE) */}
            {/* ======================================================== */}
            {activeTab === "reviews" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                      Reviews Written ({reviews.length})
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                      Your authentic ratings and feedback. Add or delete reviews with instant real-time count updates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsWriteReviewOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Write a Review</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs p-5 sm:p-6 transition-all hover:border-red-100 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-16 relative bg-gray-50 rounded border border-gray-100 shrink-0 overflow-hidden shadow-2xs">
                          <Image
                            src={rev.bookImage}
                            alt={rev.bookTitle}
                            fill
                            className="object-cover"
                            sizes="50px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase">
                              {rev.bookTitle}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400">{rev.date}</span>
                              {/* Fast Delete Review Button */}
                              <button
                                type="button"
                                onClick={(e) => handleDeleteReview(rev.id, e)}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                title="Delete review"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 my-1.5 text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>

                          <h4 className="text-xs sm:text-sm font-semibold text-gray-800">
                            {rev.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {rev.content}
                          </p>

                          <div className="mt-3 text-[11px] text-gray-400 font-medium">
                            {rev.helpful} people found this review helpful
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* WRITE A REVIEW MODAL */}
      {/* ============================================================ */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-[#C61821]" />
                <span>Write a Book Review</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsWriteReviewOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Select Book */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select Book
                </label>
                <select
                  value={newReviewForm.bookTitle}
                  onChange={(e) => {
                    const title = e.target.value;
                    let img = "/images/books/image-3.png";
                    if (title.includes("HINDI")) img = "/images/books/image-2.png";
                    if (title.includes("GENERAL")) img = "/images/books/image-10.png";
                    if (title.includes("POLITY") || title.includes("NYAYA")) img = "/images/books/image-5.png";
                    if (title.includes("ENVIRONMENT")) img = "/images/books/image-4.png";
                    setNewReviewForm((prev) => ({
                      ...prev,
                      bookTitle: title,
                      bookImage: img,
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821] bg-white"
                >
                  <option value="NIBANDH SANHITA">NIBANDH SANHITA</option>
                  <option value="GENERAL STUDIES PAPER 1">GENERAL STUDIES PAPER 1</option>
                  <option value="ENVIRONMENT NOTEBOOK">ENVIRONMENT NOTEBOOK</option>
                </select>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewForm((prev) => ({ ...prev, rating: star }))}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewForm.rating ? "fill-current" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">
                    {newReviewForm.rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Headline */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent book for competitive exams!"
                  value={newReviewForm.title}
                  onChange={(e) => setNewReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                />
              </div>

              {/* Detailed Comments */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share what you liked, book quality, syllabus coverage..."
                  value={newReviewForm.content}
                  onChange={(e) =>
                    setNewReviewForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT / ADD ADDRESS MODAL */}
      {/* ============================================================ */}
      {(isEditAddressOpen || isNewAddressModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditAddressOpen(false);
                  setIsNewAddressModalOpen(false);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Address Type / Tag
                </label>
                <div className="flex gap-3">
                  {(["Home", "Work", "Other"] as const).map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="tag"
                        value={tag}
                        defaultChecked={
                          editingAddress ? editingAddress.tag === tag : tag === "Home"
                        }
                        className="accent-[#C61821]"
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingAddress?.name || userProfile.name}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    defaultValue={editingAddress?.phone || userProfile.phone}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Flat, House no., Building, Apartment
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  defaultValue={editingAddress?.street || ""}
                  placeholder="e.g. 12, Shivaji Nagar"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Area, Street, Sector, Village
                </label>
                <input
                  type="text"
                  name="area"
                  required
                  defaultValue={editingAddress?.area || ""}
                  placeholder="e.g. Near ICICI Bank"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    defaultValue={editingAddress?.city || "Pune"}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    defaultValue={editingAddress?.state || "Maharashtra"}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    defaultValue={editingAddress?.pincode || "411005"}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C61821]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultCheckbox"
                  name="isDefault"
                  defaultChecked={editingAddress?.isDefault || false}
                  className="accent-[#C61821]"
                />
                <label htmlFor="isDefaultCheckbox" className="text-xs text-gray-700 cursor-pointer">
                  Make this my default shipping address
                </label>
              </div>

              {/* Actions with Fast Delete Option */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-gray-100">
                {editingAddress && addresses.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(editingAddress.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Address</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditAddressOpen(false);
                      setIsNewAddressModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ORDER TRACKING & DETAILS MODAL */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-400">Order Details</span>
                <h3 className="text-base font-bold text-gray-900">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Book Info */}
            <div className="flex items-center gap-3.5 p-3.5 bg-gray-50 rounded-xl mb-6">
              <div className="w-12 h-16 relative bg-white rounded border border-gray-200 shrink-0 overflow-hidden">
                <Image
                  src={selectedOrder.image}
                  alt={selectedOrder.title}
                  fill
                  className="object-cover"
                  sizes="60px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 uppercase truncate">
                  {selectedOrder.title}
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Ordered on {selectedOrder.date}
                </p>
                <p className="text-xs font-bold text-[#C61821] mt-1">₹{selectedOrder.price}</p>
              </div>
            </div>

            {/* Shipment Progress Tracker */}
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
              Tracking Timeline
            </h4>
            <div className="space-y-4 pl-2 mb-6">
              {[
                {
                  step: "Order Placed",
                  date: `${selectedOrder.date}, 10:15 AM`,
                  done: true,
                },
                {
                  step: "Packed & Invoiced",
                  date: `${selectedOrder.date}, 02:20 PM`,
                  done: true,
                },
                {
                  step: "Dispatched via " + selectedOrder.courier,
                  date: `AWB: ${selectedOrder.trackingNumber}`,
                  done: selectedOrder.status !== "Processing",
                },
                {
                  step: "Delivered",
                  date: selectedOrder.deliveredDate || "Estimated: In 2 days",
                  done: selectedOrder.status === "Delivered",
                },
              ].map((item, idx, arr) => (
                <div key={idx} className="flex gap-3 relative">
                  {idx !== arr.length - 1 && (
                    <div
                      className={`absolute left-2.5 top-6 bottom-0 w-0.5 ${
                        item.done ? "bg-[#C61821]" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      item.done
                        ? "bg-[#C61821] text-white shadow-2xs"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 leading-tight">
                      {item.step}
                    </h5>
                    <p className="text-[11px] text-gray-400 font-medium">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Details */}
            <div className="p-3.5 rounded-xl border border-gray-100 bg-[#FBFBFC] text-xs space-y-1 mb-6">
              <span className="font-bold text-gray-800 block mb-1">Delivery Address:</span>
              <p className="text-gray-600">
                {defaultAddress.name} ({defaultAddress.phone})
              </p>
              <p className="text-gray-500">
                {defaultAddress.street}, {defaultAddress.area}, {defaultAddress.city},{" "}
                {defaultAddress.state} - {defaultAddress.pincode}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerToast("Invoice downloaded to your device!");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LOGOUT CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-[#C61821] flex items-center justify-center mx-auto mb-3.5">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Are you sure you want to log out?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              You will need to sign in again to access your orders and wishlist.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-[#C61821] hover:bg-[#A81119] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-[#F8F9FA]">
          <div className="flex items-center gap-3 text-[#C61821] font-semibold text-sm">
            <div className="w-6 h-6 border-2 border-[#C61821] border-t-transparent rounded-full animate-spin" />
            <span>Loading Account...</span>
          </div>
        </div>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}
