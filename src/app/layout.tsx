import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Rozha_One, Noto_Sans_Devanagari } from "next/font/google";
import TopBanner from "@/components/layout/TopBanner";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { CartWishlistProvider } from "@/components/providers/CartWishlistProvider";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import GlobalToast from "@/components/layout/GlobalToast";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

const rozha = Rozha_One({
  weight: "400",
  subsets: ["latin", "devanagari"],
  variable: "--font-devanagari-display",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["latin", "devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "देवनागरी Books - India's Trusted Publication for Competitive Exams",
  description:
    "High-quality books for MPPSC, Judiciary, Civil Judge, Hindi Grammar, Essay Writing and Law — prepared by experienced educators.",
  keywords: [
    "Devanagari Books",
    "MPPSC Books",
    "Judiciary Exam Books",
    "Civil Judge Books",
    "Hindi Grammar",
    "Indian Polity",
    "IPC Books",
    "Competitive Exam Books",
  ],
  icons: {
    icon: "/logos.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hi"
      className={`${montserrat.variable} ${playfair.variable} ${rozha.variable} ${notoDevanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FBFBFC] text-[#1D2129]">
        <SmoothScrollProvider>
          <CartWishlistProvider>
            {/* Top announcement bar */}
            <TopBanner />

            {/* Main Navbar */}
            <Navbar />

            {/* Page Content */}
            <div className="flex-1 pb-6 md:pb-0">
              {children}
            </div>

            {/* Global Footer */}
            <Footer />

            {/* Mobile Bottom Navigation (Visible only on mobile screens) */}
            <MobileBottomNav />

            {/* Slide-over Wishlist Drawer & Global Toast */}
            <WishlistDrawer />
            <GlobalToast />
          </CartWishlistProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
