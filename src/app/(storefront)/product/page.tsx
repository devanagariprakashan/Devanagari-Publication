import ProductDetailClient from "@/components/product/ProductDetailClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nibandh Sanhita (निबंध संहिता) by Mr. Mayank Jagdish Sharma - Dnyanagari Books",
  description:
    "'निबंध संहिता' MPPSC प्रारंभिक एवं मुख्य परीक्षा के लिए निबंध लेखन की सर्वोत्तम पुस्तक। 250+ निबंध, समसामयिक विषय और अद्यतन आँकड़ों के साथ।",
};

export default function ProductIndexPage() {
  return <ProductDetailClient id="102" />;
}
