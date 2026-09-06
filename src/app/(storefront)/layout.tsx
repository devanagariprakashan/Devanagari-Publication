import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { CartWishlistProvider } from "@/components/providers/CartWishlistProvider";
import TopBanner from "@/components/layout/TopBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import GlobalToast from "@/components/layout/GlobalToast";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <CartWishlistProvider>
        <TopBanner />
        <Navbar />
        <div className="flex-1 pb-6 md:pb-0">{children}</div>
        <Footer />
        <MobileBottomNav />
        <WishlistDrawer />
        <GlobalToast />
      </CartWishlistProvider>
    </SmoothScrollProvider>
  );
}
