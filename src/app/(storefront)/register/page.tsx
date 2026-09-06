"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim()) {
      setErrorMessage("Please enter your full name");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number");
      return;
    }
    if (!formData.password) {
      setErrorMessage("Please create a password");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password should be at least 6 characters long");
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage("Please accept the Terms & Conditions and Privacy Policy");
      return;
    }

    setIsLoading(true);
    // Simulate registration & save user session
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Account created successfully! Redirecting to your account...");

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "devanagari_user",
          JSON.stringify({
            name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
          })
        );
        localStorage.removeItem("devanagari_logged_out");
        // ponytail: wishlist is browser-global; reset it on new account so stale demo items don't carry over
        localStorage.removeItem("devanagari_wishlist_v2");
        window.dispatchEvent(new Event("devanagari_user_updated"));
      }

      setTimeout(() => {
        router.push("/account");
      }, 900);
    }, 1100);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[480px] bg-white rounded-[5px] border border-red-100/70 shadow-[0_12px_40px_rgba(200,40,40,0.07)] p-6 sm:p-8 md:p-9 transition-all">
        {/* Header inside card before inputs */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Create your <span className="text-[#C61821]">account</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1.5">
            Join thousands of learners. Start your success journey.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-[5px] flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-[#C61821] rounded-[5px] text-xs sm:text-sm font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          {/* Field 1: Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-xs sm:text-[13px] font-semibold text-gray-800"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                <User className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200/90 rounded-[5px] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
              />
            </div>
          </div>

          {/* Field 2: Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs sm:text-[13px] font-semibold text-gray-800"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                <Mail className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200/90 rounded-[5px] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
              />
            </div>
          </div>

          {/* Field 3: Phone Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block text-xs sm:text-[13px] font-semibold text-gray-800"
            >
              Phone Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                <Phone className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200/90 rounded-[5px] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
              />
            </div>
          </div>

          {/* Field 4: Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs sm:text-[13px] font-semibold text-gray-800"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C61821] pointer-events-none">
                <Lock className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-gray-200/90 rounded-[5px] text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#C61821] focus:ring-2 focus:ring-[#C61821]/15 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-gray-700 p-1 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Checkbox: Terms & Conditions */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded-[3px] border-gray-300 text-[#C61821] focus:ring-[#C61821] cursor-pointer accent-[#C61821]"
            />
            <label
              htmlFor="agreeTerms"
              className="text-xs text-gray-600 leading-snug cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-[#C61821] font-semibold hover:underline"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#C61821] font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-5 rounded-[5px] bg-[#C61821] hover:bg-[#A81119] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
              </>
            )}
          </button>
        </form>

        {/* Login footer link */}
        <div className="mt-2 text-center text-xs sm:text-[13px] text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#C61821] hover:text-[#991016] hover:underline transition-colors ml-0.5"
          >
            Login now
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
