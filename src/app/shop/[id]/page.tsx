import ProductDetailClient from "@/components/product/ProductDetailClient";
import { Metadata } from "next";
import { ALL_BOOKS } from "@/data/booksData";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const book = !isNaN(numericId)
    ? ALL_BOOKS.find((b) => b.id === numericId)
    : ALL_BOOKS.find((b) => b.title.toLowerCase().includes(id.toLowerCase()));

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

export default async function ShopProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
