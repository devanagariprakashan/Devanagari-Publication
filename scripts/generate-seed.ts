import { ALL_BOOKS, SHOP_CATEGORIES } from "../src/data/booksData.ts";
import fs from "node:fs";

const HERO_IDS = new Set(["101", "102", "105", "106", "109", "110", "112", "115", "116"]);

const AUTHORS = [
  { id: "mayank-jagdish-sharma", name: "Mr. Mayank Jagdish Sharma", role: "Faculty, Hindi Sahitya And Vyakaran", short_role: "Hindi Sahitya & Vyakaran", bio: "Renowned Hindi literature & grammar mentor for MPPSC, Civil Services and State exams. Guided 15,000+ selected candidates.", image_url: "/images/authors/mayank-sharma.jpg" },
  { id: "shubham-gupta", name: "Mr. Shubham Gupta", role: "GS Faculty & Prelims Strategist", short_role: "GS & Current Affairs", bio: "Top General Studies educator specializing in high-yield Prelims notes, quick revision charts and analytical GS.", image_url: "/images/authors/shubham-gupta.jpg" },
  { id: "anand-mishra", name: "Mr. Anand Mishra", role: "Director - Raksha Academy • Faculty - Ethics", short_role: "Ethics & Integrity (Paper 4)", bio: "Director of Raksha Academy, senior philosopher & ethics mentor known for case-study frameworks in Paper-4.", image_url: "/images/authors/anand-mishra.jpg" },
  { id: "sunita-trivedi", name: "Dr. Sunita Trivedi", role: "Dean & Faculty - Law & Judicial Exams", short_role: "Law & Judicial Services", bio: "Authoritative jurist and mentor for Civil Judge, ADPO and Higher Judicial Services across Madhya Pradesh, UP & Rajasthan.", image_url: "/images/authors/sunita-trivedi.jpg" },
  { id: "rajeshwar-sharma", name: "Prof. Rajeshwar Sharma", role: "Senior Academician & MP Historian", short_role: "MP History & Culture", bio: "Distinguished historian, researcher and state awardee specializing in ancient and medieval tribal history of Central India.", image_url: "/images/authors/rajeshwar-sharma.jpg" },
  { id: "vivek-deshmukh", name: "Adv. Vivek Deshmukh", role: "Constitutional Law & Polity Expert", short_role: "Polity & Constitution", bio: "Supreme Court & High Court advocate holding masterclasses on Constitution, Governance and Public Policy.", image_url: "/images/authors/vivek-deshmukh.jpg" },
];

const INQUIRIES = [
  { id: "inq-1", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 43210", message: "Is the MPPSC Mains GS Paper 3 book available in Hindi-English diglot?", status: "unread" },
  { id: "inq-2", name: "Priya Verma", email: "priya@example.com", phone: "+91 91234 56789", message: "Do you offer bulk discounts for coaching institutes?", status: "unread" },
  { id: "inq-3", name: "Amit Singh", email: "amit@example.com", phone: "+91 99887 76655", message: "When will the 2026 edition of MP GK be released?", status: "unread" },
];

const ANNOUNCEMENTS = [
  { id: "ann-1", text: "Free shipping on orders above ₹499", is_active: true },
  { id: "ann-2", text: "New 2025-26 editions of MPPSC books now available", is_active: true },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function esc(v: string | null | undefined): string {
  if (v === null || v === undefined) return "null";
  return `'${v.replace(/'/g, "''")}'`;
}

function num(v: number | null | undefined): string {
  return v === null || v === undefined ? "null" : String(v);
}

function bool(v: boolean): string {
  return v ? "true" : "false";
}

let sql = "-- Devanagari Publications seed data\n";

sql += "\n-- categories\n";
for (const c of SHOP_CATEGORIES.filter((c) => c.id !== "all")) {
  sql += `insert into public.categories (id, name, slug, is_active) values (${esc(c.id)}, ${esc(c.name)}, ${esc(c.id)}, true) on conflict (id) do nothing;\n`;
}

sql += "\n-- authors\n";
for (const a of AUTHORS) {
  sql += `insert into public.authors (id, name, role, short_role, bio, image_url, is_active) values (${esc(a.id)}, ${esc(a.name)}, ${esc(a.role)}, ${esc(a.short_role)}, ${esc(a.bio)}, ${esc(a.image_url)}, true) on conflict (id) do nothing;\n`;
}

sql += "\n-- books\n";
for (const b of ALL_BOOKS) {
  const slug = `${slugify(b.title)}-${b.id}`;
  sql += `insert into public.books (id, slug, title, hindi_title, subtitle, author, category_id, isbn, edition, language, exam, format, price, original_price, discount_percent, rating, reviews_count, badge, badge_color, image_url, description, highlights, pages, publication, binding, in_stock, is_bestseller, is_new_release, is_featured, show_in_hero, is_active) values (${esc(String(b.id))}, ${esc(slug)}, ${esc(b.title)}, ${esc(b.hindiTitle)}, ${esc(b.subtitle)}, ${esc(b.author)}, ${esc(b.categorySlug)}, ${esc(b.isbn)}, ${esc(b.edition)}, ${esc(b.language)}, ${esc(b.exam)}, ${esc(b.format)}, ${num(b.price)}, ${num(b.originalPrice)}, ${num(b.discountPercent)}, ${num(b.rating)}, ${num(b.reviewsCount)}, ${esc(b.badge)}, ${esc(b.badgeColor)}, ${esc(b.image)}, ${esc(b.description)}, ${esc(JSON.stringify(b.highlights ?? []))}, ${num(b.pages)}, ${esc(b.publication)}, ${esc(b.binding)}, ${bool(b.inStock)}, ${bool(!!b.isBestseller)}, ${bool(!!b.isNewRelease)}, ${bool(!!b.isFeatured)}, ${bool(HERO_IDS.has(String(b.id)))}, true) on conflict (id) do update set
  slug = excluded.slug, title = excluded.title, hindi_title = excluded.hindi_title,
  subtitle = excluded.subtitle, author = excluded.author, category_id = excluded.category_id,
  isbn = excluded.isbn, edition = excluded.edition, language = excluded.language,
  exam = excluded.exam, format = excluded.format, price = excluded.price,
  original_price = excluded.original_price, discount_percent = excluded.discount_percent,
  rating = excluded.rating, reviews_count = excluded.reviews_count, badge = excluded.badge,
  badge_color = excluded.badge_color, image_url = excluded.image_url,
  description = excluded.description, highlights = excluded.highlights, pages = excluded.pages,
  publication = excluded.publication, binding = excluded.binding, in_stock = excluded.in_stock,
  is_bestseller = excluded.is_bestseller, is_new_release = excluded.is_new_release,
  is_featured = excluded.is_featured, show_in_hero = excluded.show_in_hero, is_active = excluded.is_active;\n`;
}

sql += "\n-- reviews (2 seeded per book; alter is idempotent for existing DBs)\n";
sql += `alter table public.reviews add column if not exists reviewer_name text;\n`;
{
  const seenBookIds = new Set<string>();
  for (const b of ALL_BOOKS) {
    const id = String(b.id);
    if (seenBookIds.has(id)) continue;
    seenBookIds.add(id);
    const seeded = [
      { n: 1, rating: 5, name: "राहुल शर्मा", comment: `${b.title} की भाषा बहुत सरल और परीक्षा-उपयोगी है। पूरा सिलेबस समय पर कवर हो जाता है।` },
      { n: 2, rating: 4, name: "प्रिया वर्मा", comment: "सामग्री अच्छी है और प्रश्न विगत वर्षों पर आधारित हैं। पैकेजिंग व डिलीवरी भी बढ़िया।" },
    ];
    for (const r of seeded) {
      sql += `insert into public.reviews (id, book_id, rating, comment, reviewer_name, is_approved) values (${esc(`rev-${id}-${r.n}`)}, ${esc(id)}, ${r.rating}, ${esc(r.comment)}, ${esc(r.name)}, true) on conflict (id) do nothing;\n`;
    }
  }
}

sql += "\n-- inquiries\n";
for (const q of INQUIRIES) {
  sql += `insert into public.inquiries (id, name, email, phone, message, status) values (${esc(q.id)}, ${esc(q.name)}, ${esc(q.email)}, ${esc(q.phone)}, ${esc(q.message)}, ${esc(q.status)}) on conflict (id) do nothing;\n`;
}

sql += "\n-- announcements\n";
for (const a of ANNOUNCEMENTS) {
  sql += `insert into public.announcements (id, text, is_active) values (${esc(a.id)}, ${esc(a.text)}, ${bool(a.is_active)}) on conflict (id) do nothing;\n`;
}

fs.writeFileSync("seed.sql", sql);
console.log("Wrote seed.sql");
