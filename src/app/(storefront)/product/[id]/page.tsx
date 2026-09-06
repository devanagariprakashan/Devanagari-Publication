import ProductDetailClient from "@/components/product/ProductDetailClient";
import { Metadata } from "next";
import { fetchCatalogBooks } from "@/lib/catalog";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const books = await fetchCatalogBooks();
  const book =
    books.find((b) => String(b.id) === String(id)) ||
    books.find((b) => b.title.toLowerCase().includes(id.toLowerCase()));

  if (!book) {
    return {
      title: "Book Details - Dnyanagari Books",
    };
  }

  return {
    title: `${book.title} by ${book.author} - Dnyanagari Books`,
    description: book.shortSummary || book.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
