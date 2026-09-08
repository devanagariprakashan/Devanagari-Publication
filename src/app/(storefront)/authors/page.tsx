import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import TopAuthorsSection, { AuthorItem } from "@/components/home/TopAuthorsSection";
import type { Database } from "@/types/database";
import { Sparkles } from "lucide-react";

type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];
type BookRow = Database["public"]["Tables"]["books"]["Row"];

const FALLBACKS = ["from-red-500 to-amber-600","from-blue-600 to-cyan-600","from-emerald-600 to-teal-700","from-purple-600 to-indigo-700","from-amber-600 to-orange-700","from-slate-700 to-slate-900"];

export default async function AuthorsPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("authors").select("*").eq("is_active", true).order("created_at");
  const authors: AuthorItem[] = [];
  for (let i = 0; i < (rows ?? []).length; i++) {
    const a: AuthorRow = (rows as AuthorRow[])[i];
    const { data: books } = await supabase.from("books").select("*").eq("author", a.name).eq("is_active", true).limit(4);
    authors.push({
      id: a.id, name: a.name, role: a.role ?? "", shortRole: a.short_role ?? a.role ?? "",
      category: "all", booksCount: (books ?? []).length,
      image: a.image_url ?? "/images/authors/default-author.jpg",
      fallbackGradient: FALLBACKS[i % FALLBACKS.length], experience: "", bio: a.bio ?? "",
      books: (books ?? []).map((b: BookRow) => ({ id: Number(b.id), title: b.title, category: b.exam ?? b.category_id ?? "", price: b.price ?? 0, image: b.image_url ?? "/images/books/image-2.png" })),
    });
  }
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Standard page header — same pattern as /team */}
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Authors</h1>
            <p className="text-sm text-gray-500 mt-1">Meet our expert faculty, authors, and researchers.</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-[#C61821] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#C61821]">Authors</span>
          </nav>
        </div>
      </section>
      <div className="py-6 sm:py-8">
        <TopAuthorsSection authors={authors.length ? authors : undefined} />
      </div>
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-800">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-red-400" />
              <span>Join As An Author</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-serif mb-1">
              Want to publish your book with Devanagari?
            </h3>
            <p className="text-gray-300 text-xs">
              If you are an educator or researcher, contact our editorial team to share your manuscript.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#C61821] text-white font-bold text-xs shadow-md hover:bg-red-700 transition-all hover:scale-105"
          >
            Contact Editorial Board →
          </Link>
        </div>
      </div>
    </div>
  );
}
