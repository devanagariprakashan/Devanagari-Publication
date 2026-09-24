import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Devanagari Books & Publications",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16">
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Terms &amp; Conditions</h1>
            <p className="text-sm text-gray-500 mt-1">Please read these terms carefully before using our website.</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#C61821]">Terms &amp; Conditions</span>
          </nav>
        </div>
      </section>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 text-sm sm:text-[15px] leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or placing an order on the Devanagari Books &amp; Publications website, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, please do not use this website.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. Products &amp; Pricing</h2>
          <p>We make every effort to ensure that book descriptions, images, and prices displayed on this website are accurate. However, errors may occasionally occur. We reserve the right to correct any pricing or product information and to cancel orders arising from such errors, with a full refund where applicable.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Orders &amp; Payment</h2>
          <p>Orders are confirmed only after successful payment or, for Cash on Delivery orders, after order placement. We accept UPI, cards, net banking, and COD (where available) as described on our checkout page. We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud or unavailability of stock.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Shipping &amp; Delivery</h2>
          <p>Delivery timelines mentioned on the website are estimates and may vary due to courier delays, weather, or other circumstances beyond our control. Shipping charges, if applicable, are shown at checkout before payment.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Returns &amp; Refunds</h2>
          <p>If you receive a damaged, defective, or incorrect book, please contact our support team within the return window mentioned on your order confirmation, with photos of the issue. Approved refunds are processed to the original payment method or as store credit, as applicable.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
          <p>All content on this website, including book titles, cover designs, descriptions, and logos, is the property of Devanagari Books &amp; Publications or its respective authors/publishers and may not be reproduced without permission.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Limitation of Liability</h2>
          <p>Devanagari Books &amp; Publications shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website or the products purchased through it.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Changes to Terms</h2>
          <p>We may update these Terms &amp; Conditions from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. Contact Us</h2>
          <p>For any questions regarding these Terms &amp; Conditions, please reach out via our <Link href="/contact" className="text-[#C61821] font-semibold hover:underline">Contact page</Link>.</p>
        </section>
      </main>
    </div>
  );
}
