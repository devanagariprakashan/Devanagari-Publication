import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Devanagari Books & Publications",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16">
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mt-1">How we collect, use, and protect your information.</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#C61821]">Privacy Policy</span>
          </nav>
        </div>
      </section>

      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 text-sm sm:text-[15px] leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, and payment-related details (processed securely by our payment gateway, not stored by us).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p>We use your information to process and deliver orders, send order updates, respond to inquiries, improve our services, and, where you have opted in, send you newsletters about new releases and exam updates.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Sharing of Information</h2>
          <p>We share order details only with trusted third parties necessary to fulfil your order, such as payment gateways and courier/logistics partners. We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Cookies</h2>
          <p>Our website uses cookies and local storage to keep you signed in, remember your cart/wishlist, and understand how the site is used, so we can improve it.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
          <p>We take reasonable technical and organisational measures to protect your personal information against unauthorised access, alteration, or disclosure.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Your Rights</h2>
          <p>You may access, update, or request deletion of your account information at any time by contacting us, or by managing your details from your Account page.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy or how your data is handled, please reach out via our <Link href="/contact" className="text-[#C61821] font-semibold hover:underline">Contact page</Link>.</p>
        </section>
      </main>
    </div>
  );
}
