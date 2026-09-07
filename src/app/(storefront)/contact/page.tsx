"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Building,
} from "lucide-react";
import { getSiteSettings, firstPhone, SITE_DEFAULTS, type SiteSettings } from "@/lib/site-settings";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Book Order Inquiry",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [site, setSite] = useState<SiteSettings>(SITE_DEFAULTS);

  // ponytail: same single-row read as Footer, no server prefetch until SEO needs it
  useEffect(() => { getSiteSettings().then(setSite); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "Book Order Inquiry",
        message: "",
      });
    }, 4000);
  };

  const FAQS = [
    {
      q: "How long does delivery take?",
      a: "Safe delivery within 2-3 working days in MP, and 4-6 working days for other states.",
    },
    {
      q: "Are bulk discounts available for coaching institutes?",
      a: "Yes, special institutional discounts are available for orders above 20 books.",
    },
    {
      q: "Are all books based on the latest syllabus?",
      a: "Absolutely, all books are fully updated according to MPPSC new syllabus & New Criminal Laws 2024.",
    },
    {
      q: "Is Cash on Delivery (COD) available?",
      a: "Yes, COD and secure online payment options are available across most pincodes.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16">
      {/* HEADER BREADCRUMB */}
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Contact Us</h1>
            <p className="text-sm text-gray-500 mt-1">Get in touch for book inquiries, delivery status, or support.</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#C61821]">Contact</span>
          </nav>
        </div>
      </section>

      {/* COMPACT CONTACT CHANNELS */}
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-[5px] p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-[5px] bg-red-50 text-[#C61821] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Helpline</h3>
              <a href={`tel:+${firstPhone(site.phones).replace(/\D/g, "")}`} className="text-xs font-semibold text-[#C61821] hover:underline block mt-0.5">
                {site.phones}
              </a>
            </div>
          </div>

          <div className="bg-white rounded-[5px] p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-[5px] bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">WhatsApp</h3>
              <a href={site.whatsapp_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-600 hover:underline block mt-0.5">
                Chat Now →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-[5px] p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-[5px] bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Email</h3>
              <a href={`mailto:${site.email}`} className="text-xs font-semibold text-blue-600 hover:underline block mt-0.5 truncate w-32 sm:w-full">
                {site.email}
              </a>
            </div>
          </div>

          <div className="bg-white rounded-[5px] p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-[5px] bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Head Office</h3>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                {site.address}
              </p>
            </div>
          </div>
        </div>

        {/* FORM & FAQ GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[5px] p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Send a Message</h2>
            <p className="text-xs text-gray-500 mb-5">Fill out the form below and our team will get back to you shortly.</p>

            {isSubmitted ? (
              <div className="p-6 rounded-[5px] bg-green-50 border border-green-100 text-center animate-in zoom-in duration-200 h-64 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
                <h3 className="text-base font-bold text-green-900 mb-1">Message Sent Successfully!</h3>
                <p className="text-xs text-green-700">Our support team will contact you soon. Thank you!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C61821] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="98765XXXXX"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C61821] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C61821] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Inquiry Type</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C61821] focus:bg-white transition-all"
                    >
                      <option value="Book Order Inquiry">Book Order Inquiry</option>
                      <option value="Order Tracking">Order Tracking</option>
                      <option value="Bulk / Coaching Order">Bulk / Coaching Order</option>
                      <option value="Author / Publishing">Author / Publishing</option>
                      <option value="Other">Other Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please write your query in detail..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C61821] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#C61821] hover:bg-[#8F0E15] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-[5px] p-5 border border-gray-100 shadow-sm flex-grow">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-[#C61821]" />
                <h3 className="font-bold text-gray-900 text-base">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="p-3 rounded-[5px] bg-gray-50 border border-gray-100">
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">{faq.q}</h4>
                    <p className="text-[11px] text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-[5px] p-5 border border-red-100 flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">Looking to buy books?</h4>
                <p className="text-[11px] text-gray-600">View our complete catalog directly on the shop page.</p>
              </div>
              <Link
                href="/shop"
                className="shrink-0 px-4 py-2 rounded-lg bg-[#C61821] text-white font-bold text-xs shadow-sm hover:bg-red-700 transition-colors"
              >
                Go to Shop →
              </Link>
            </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-8 bg-white rounded-[5px] p-2 shadow-sm border border-gray-100 h-64 sm:h-80 lg:h-96 w-full relative">
          <iframe
            src="https://maps.google.com/maps?q=MG%20Road,%20Bhopal,%20Madhya%20Pradesh%20462001&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "0.75rem" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location - MG Road, Bhopal"
          ></iframe>
        </div>
      </main>
    </div>
  );
}
