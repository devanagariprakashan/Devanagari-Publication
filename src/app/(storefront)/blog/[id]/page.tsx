import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getPageContent } from "@/lib/page-content";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const content = await getPageContent("blog");
  const post = content.items.find((item) => item.id === id);
  if (!post) return { title: "Article not found" };
  return { title: `${post.title} - Devanagari Publications`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const content = await getPageContent("blog");
  const post = content.items.find((item) => item.id === id);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 pb-16">
      <section className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#C61821] transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/blog" className="hover:text-[#C61821] transition-colors">Blog</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#C61821] truncate">{post.title}</span>
          </nav>
          <span className="inline-flex px-2.5 py-1 rounded-md bg-red-50 text-[#C61821] text-[11px] font-bold uppercase tracking-wide">
            {post.category}
          </span>
          <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-50 text-[#C61821] flex items-center justify-center font-bold text-xs">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 leading-tight">{post.author}</p>
                {post.authorRole && <p className="text-xs text-gray-400 leading-tight">{post.authorRole}</p>}
              </div>
            </div>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className={`relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-br ${post.imageBg}`}>
          {post.image && (
            <>
              <Image src={post.image} alt={post.title} fill unoptimized sizes="768px" className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
            </>
          )}
        </div>

        <article className="mt-8">
          {post.content ? (
            post.content.split(/\n+/).filter(Boolean).map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
          )}
        </article>

        <Link
          href="/blog"
          className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#C61821] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all articles
        </Link>
      </div>
    </div>
  );
}
